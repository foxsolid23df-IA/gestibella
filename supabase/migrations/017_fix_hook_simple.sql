-- 017_fix_hook_simple.sql — Rewrite hook WITHOUT auth.users query (was causing crash)
-- The hook crashed because SELECT FROM auth.users failed inside security definer.
-- This version only queries public.staff (safe) and returns gracefully if no match.

-- 1) Link foxsolid22df@gmail.com auth_user_id to staff
UPDATE public.staff
SET auth_user_id = '9857e2ec-5fd8-4f67-b0d5-968c20ef2891'
WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com')
  AND auth_user_id IS NULL;

-- 2) Link ALL unlinked auth users by email (one-time batch)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT au.id AS auth_uid, au.email
    FROM auth.users au
    WHERE EXISTS (
      SELECT 1 FROM public.staff s
      WHERE LOWER(s.email) = LOWER(au.email)
      AND s.auth_user_id IS NULL
    )
  LOOP
    UPDATE public.staff
    SET auth_user_id = r.auth_uid
    WHERE LOWER(email) = LOWER(r.email)
      AND auth_user_id IS NULL;
    RAISE NOTICE 'Linked % to %', r.email, r.auth_uid;
  END LOOP;
END $$;

-- 3) Recreate hook (simple version, no auth.users query)
DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  claims jsonb;
  user_id uuid;
  v_tenant uuid;
  v_role text;
  v_is_super boolean;
BEGIN
  claims := event->>'claims';
  user_id := (event->>'user_id')::uuid;

  IF user_id IS NULL THEN
    RETURN event;
  END IF;

  -- Check if super-admin
  SELECT EXISTS(
    SELECT 1 FROM public.platform_admins
    WHERE platform_admins.user_id = user_id AND is_super_admin
  ) INTO v_is_super;

  IF v_is_super THEN
    RETURN event;
  END IF;

  -- Find tenant and role from staff (only queries public.staff, no auth.users)
  SELECT s.tenant_id, s.role::text INTO v_tenant, v_role
  FROM public.staff s
  WHERE s.auth_user_id = user_id
  LIMIT 1;

  IF v_tenant IS NOT NULL THEN
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_tenant::text));
    IF v_role IS NOT NULL THEN
      claims := jsonb_set(claims, '{user_role}', to_jsonb(v_role));
    END IF;
  END IF;

  RETURN jsonb_set(event, '{claims}', claims);
END $$;
