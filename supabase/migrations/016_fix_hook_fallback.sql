-- 016_fix_hook_fallback.sql — Fix hook to work even without auth_user_id linked
-- The current hook only looks up staff by auth_user_id.
-- If auth_user_id is not linked, it returns the event unchanged → no tenant_id in JWT → RLS blocks everything.
-- This version adds email fallback: if no staff found by auth_user_id, try by email.

DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  claims jsonb;
  user_id uuid;
  v_tenant uuid;
  v_is_super boolean;
  v_user_email text;
BEGIN
  claims := event->>'claims';
  user_id := (event->>'user_id')::uuid;

  -- ¿Es super-admin? No inyectar tenant_id
  SELECT EXISTS(
    SELECT 1 FROM public.platform_admins
    WHERE platform_admins.user_id = user_id AND is_super_admin
  ) INTO v_is_super;

  IF v_is_super THEN
    RETURN event;
  END IF;

  -- Primary: find tenant via auth_user_id
  SELECT tenant_id INTO v_tenant
  FROM public.staff
  WHERE auth_user_id = user_id
  LIMIT 1;

  -- Fallback: find tenant via email if auth_user_id not linked
  IF v_tenant IS NULL THEN
    SELECT email INTO v_user_email FROM auth.users WHERE id = user_id;
    IF v_user_email IS NOT NULL THEN
      SELECT s.tenant_id INTO v_tenant
      FROM public.staff s
      WHERE LOWER(s.email) = LOWER(v_user_email)
      LIMIT 1;

      -- Auto-link for future calls
      IF v_tenant IS NOT NULL THEN
        UPDATE public.staff
        SET auth_user_id = user_id
        WHERE LOWER(email) = LOWER(v_user_email)
          AND auth_user_id IS NULL;
      END IF;
    END IF;
  END IF;

  IF v_tenant IS NOT NULL THEN
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_tenant::text));
    claims := jsonb_set(claims, '{user_role}', to_jsonb(
      COALESCE(
        (SELECT role::text FROM public.staff WHERE auth_user_id = user_id LIMIT 1),
        (SELECT role::text FROM public.staff WHERE LOWER(email) = LOWER(v_user_email) LIMIT 1),
        'STYLIST'
      )
    ));
  END IF;

  RETURN jsonb_set(event, '{claims}', claims);
END $$;

-- Verify hook exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'custom_access_token_hook') THEN
    RAISE NOTICE 'Hook recreated successfully';
  ELSE
    RAISE WARNING 'Hook creation FAILED';
  END IF;
END $$;
