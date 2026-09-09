-- 029_fix_hook_user_id_path.sql — Fix: Supabase stores user_id at payload.user.id, NOT at user_id
-- This is the ROOT CAUSE of all JWT issues.

DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_claims jsonb;
  v_user_id text;
  v_tenant_id text;
  v_role text;
BEGIN
  -- Supabase puts user_id at event->'payload'->'user'->>'id', NOT event->>'user_id'
  v_user_id := event->'payload'->'user'->>'id';

  IF v_user_id IS NULL OR v_user_id = '' THEN
    RETURN event;
  END IF;

  v_claims := event->'claims';
  IF v_claims IS NULL THEN
    v_claims := '{}'::jsonb;
  END IF;

  -- Super-admin check
  IF EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = v_user_id::uuid AND is_super_admin = true
  ) THEN
    RETURN event;
  END IF;

  -- Find tenant and role
  SELECT tenant_id::text, role::text INTO v_tenant_id, v_role
  FROM public.staff
  WHERE auth_user_id = v_user_id::uuid
  LIMIT 1;

  IF v_tenant_id IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{tenant_id}', to_jsonb(v_tenant_id));
  END IF;

  IF v_role IS NOT NULL THEN
    v_claims := jsonb_set(v_claims, '{user_role}', to_jsonb(v_role));
  END IF;

  RETURN jsonb_set(event, '{claims}', v_claims);
EXCEPTION
  WHEN OTHERS THEN
    RETURN event;
END $$;
