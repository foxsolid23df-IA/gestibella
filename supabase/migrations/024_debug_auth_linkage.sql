-- 024_debug_auth_linkage.sql — CRITICAL: find why hook can't find staff
-- This runs AFTER 023 (permissive RLS restored). Safe to run.

-- 1) Show ALL staff records with their auth linkage
SELECT
  id,
  name,
  email,
  auth_user_id,
  tenant_id,
  role,
  CASE WHEN auth_user_id IS NOT NULL THEN 'LINKED' ELSE 'NOT LINKED' END AS auth_status
FROM public.staff
ORDER BY email;

-- 2) Show ALL auth users
SELECT id, email, created_at, last_sign_in_at FROM auth.users ORDER BY email;

-- 3) Cross-reference: match auth users to staff by email
SELECT
  au.email AS auth_email,
  au.id AS auth_uid,
  s.email AS staff_email,
  s.id AS staff_id,
  s.auth_user_id AS staff_auth_uid,
  s.tenant_id AS staff_tenant,
  CASE
    WHEN s.id IS NULL THEN 'NO STAFF RECORD'
    WHEN s.auth_user_id = au.id THEN 'ALREADY LINKED'
    WHEN s.auth_user_id IS NULL THEN 'NOT LINKED - NEEDS UPDATE'
    ELSE 'WRONG LINK'
  END AS action_needed
FROM auth.users au
LEFT JOIN public.staff s ON LOWER(s.email) = LOWER(au.email)
ORDER BY au.email;

-- 4) Force-link foxsolid22df@gmail.com (UID: 9857e2ec-5fd8-4f67-b0d5-968c20ef2891)
DO $$
BEGIN
  UPDATE public.staff
  SET auth_user_id = '9857e2ec-5fd8-4f67-b0d5-968c20ef2891'
  WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com');
  IF FOUND THEN
    RAISE NOTICE 'Linked foxsolid22df@gmail.com to auth_user_id 9857e2ec-5fd8-4f67-b0d5-968c20ef2891';
  ELSE
    RAISE WARNING 'No staff record found for foxsolid22df@gmail.com';
  END IF;
END $$;

-- 5) Verify the link worked
SELECT
  s.email,
  s.auth_user_id,
  s.tenant_id,
  t.slug AS tenant_slug
FROM public.staff s
JOIN public.tenants t ON t.id = s.tenant_id
WHERE LOWER(s.email) = LOWER('foxsolid22df@gmail.com');

-- 6) Simulate EXACTLY what the hook does
DO $$
DECLARE
  v_uid uuid := '9857e2ec-5fd8-4f67-b0d5-968c20ef2891';
  v_tenant uuid;
  v_role text;
BEGIN
  SELECT tenant_id, role INTO v_tenant, v_role
  FROM public.staff
  WHERE auth_user_id = v_uid
  LIMIT 1;

  IF v_tenant IS NOT NULL THEN
    RAISE NOTICE 'HOOK SIMULATION: SUCCESS - would inject tenant_id=% role=%', v_tenant, v_role;
  ELSE
    RAISE WARNING 'HOOK SIMULATION: FAIL - no staff with auth_user_id=%', v_uid;
    RAISE WARNING 'This means the hook will NOT inject tenant_id into the JWT';
  END IF;
END $$;

-- 7) Check if hook function body has issues
SELECT pg_get_functiondef(oid) AS hook_source
FROM pg_proc WHERE proname = 'custom_access_token_hook';
