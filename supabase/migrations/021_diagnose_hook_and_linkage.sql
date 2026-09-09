-- 021_diagnose_hook_and_linkage.sql — Verify hook + auth_user_id linkage BEFORE restoring RLS
-- Run this FIRST. It does NOT modify any data or policies. Read-only diagnostic.

-- 1) Does the hook function exist and is it correct?
SELECT
  p.proname AS function_name,
  p.prosecdef AS is_security_definer,
  pg_get_functiondef(p.oid) AS full_definition
FROM pg_proc p
WHERE p.proname = 'custom_access_token_hook';

-- 2) Check auth_user_id linkage for ALL staff
SELECT
  s.id AS staff_id,
  s.name,
  s.email,
  s.auth_user_id,
  s.tenant_id,
  t.slug AS tenant_slug,
  CASE
    WHEN s.auth_user_id IS NOT NULL THEN 'LINKED'
    ELSE 'NOT LINKED'
  END AS status
FROM public.staff s
LEFT JOIN public.tenants t ON t.id = s.tenant_id;

-- 3) Check ALL auth users vs staff
SELECT
  au.id AS auth_uid,
  au.email AS auth_email,
  s.id AS matched_staff_id,
  s.email AS matched_staff_email,
  s.auth_user_id AS staff_auth_uid,
  CASE
    WHEN s.id IS NULL THEN 'NO STAFF MATCH'
    WHEN s.auth_user_id = au.id THEN 'ALREADY LINKED'
    WHEN s.auth_user_id IS NULL THEN 'NEEDS LINKING'
    ELSE 'MISMATCH'
  END AS status
FROM auth.users au
LEFT JOIN public.staff s ON LOWER(s.email) = LOWER(au.email);

-- 4) Simulate what the hook would do for each auth user
DO $$
DECLARE
  r RECORD;
  v_tenant uuid;
  v_role text;
BEGIN
  FOR r IN SELECT au.id, au.email FROM auth.users au LOOP
    -- Check if super-admin
    IF EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = r.id AND is_super_admin) THEN
      RAISE NOTICE 'User % (%) → SUPER ADMIN (no tenant_id needed)', r.email, r.id;
      CONTINUE;
    END IF;

    -- Try to find tenant via auth_user_id
    SELECT tenant_id, role INTO v_tenant, v_role
    FROM public.staff WHERE auth_user_id = r.id LIMIT 1;

    IF v_tenant IS NOT NULL THEN
      RAISE NOTICE 'User % (%) → HOOK OK: tenant=% role=%', r.email, r.id, v_tenant, v_role;
    ELSE
      RAISE WARNING 'User % (%) → HOOK WOULD FAIL: no staff with auth_user_id=%', r.email, r.id, r.id;
    END IF;
  END LOOP;
END $$;

-- 5) Check current RLS policies on tenants and staff
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('tenants', 'staff')
ORDER BY tablename, policyname;

-- 6) Check if any OTHER tables have broken policies
SELECT
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
