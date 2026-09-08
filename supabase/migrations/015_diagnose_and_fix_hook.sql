-- 015_diagnose_and_fix_hook.sql — Diagnose why hook doesn't inject tenant_id
-- Run this in Supabase SQL Editor and share the results

-- 1) Check if hook function exists and is correct
SELECT
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
WHERE p.proname = 'custom_access_token_hook';

-- 2) Check if auth_user_id is linked in staff
SELECT
  s.id AS staff_id,
  s.name,
  s.email,
  s.auth_user_id,
  s.tenant_id,
  t.slug AS tenant_slug
FROM public.staff s
JOIN public.tenants t ON t.id = s.tenant_id
WHERE LOWER(s.email) = LOWER('foxsolid22df@gmail.com')
   OR s.auth_user_id IS NOT NULL;

-- 3) Check all auth users and their staff linkage
SELECT
  au.id AS auth_uid,
  au.email AS auth_email,
  s.id AS staff_id,
  s.email AS staff_email,
  s.auth_user_id AS staff_auth_uid,
  s.tenant_id
FROM auth.users au
LEFT JOIN public.staff s ON LOWER(s.email) = LOWER(au.email);

-- 4) Check platform_admins
SELECT * FROM public.platform_admins;

-- 5) Force-link foxsolid22df@gmail.com if not linked
DO $$
DECLARE
  v_auth_id uuid;
  v_staff_id uuid;
BEGIN
  SELECT id INTO v_auth_id FROM auth.users WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com');
  IF v_auth_id IS NULL THEN
    RAISE NOTICE 'ERROR: No auth user found for foxsolid22df@gmail.com';
    RETURN;
  END IF;
  RAISE NOTICE 'Auth user ID: %', v_auth_id;

  SELECT id INTO v_staff_id FROM public.staff WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com') LIMIT 1;
  IF v_staff_id IS NULL THEN
    RAISE NOTICE 'ERROR: No staff record found for foxsolid22df@gmail.com - staff table has no matching email';
    RETURN;
  END IF;

  UPDATE public.staff SET auth_user_id = v_auth_id WHERE id = v_staff_id;
  RAISE NOTICE 'SUCCESS: Linked staff % (%) to auth_user %', v_staff_id, v_staff_id, v_auth_id;
END $$;

-- 6) Test: simulate what hook does for foxsolid22df@gmail.com
DO $$
DECLARE
  v_auth_id uuid;
  v_tenant_id uuid;
BEGIN
  SELECT id INTO v_auth_id FROM auth.users WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com');
  IF v_auth_id IS NULL THEN
    RAISE NOTICE 'TEST: No auth user found';
    RETURN;
  END IF;

  SELECT tenant_id INTO v_tenant_id FROM public.staff WHERE auth_user_id = v_auth_id LIMIT 1;
  IF v_tenant_id IS NULL THEN
    RAISE NOTICE 'TEST: Hook would NOT inject tenant_id (no staff with auth_user_id=%)', v_auth_id;
    RAISE NOTICE 'TEST: Checking by email instead...';
    SELECT s.tenant_id INTO v_tenant_id FROM public.staff s WHERE LOWER(s.email) = LOWER('foxsolid22df@gmail.com') LIMIT 1;
    IF v_tenant_id IS NULL THEN
      RAISE NOTICE 'TEST: FATAL - No staff record with this email exists';
    ELSE
      RAISE NOTICE 'TEST: Found tenant_id=% by email, but hook needs auth_user_id linked', v_tenant_id;
    END IF;
  ELSE
    RAISE NOTICE 'TEST: SUCCESS - Hook would inject tenant_id=%', v_tenant_id;
  END IF;
END $$;
