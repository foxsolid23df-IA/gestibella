-- 019_force_link_and_rls.sql — Direct fix: link auth user + relax RLS
-- The hook still can't find staff because auth_user_id isn't linked.
-- This migration forces the link and adds permissive policies.

-- 1) Force-link foxsolid22df@gmail.com (UID: 9857e2ec-5fd8-4f67-b0d5-968c20ef2891)
UPDATE public.staff
SET auth_user_id = '9857e2ec-5fd8-4f67-b0d5-968c20ef2891'
WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com');

-- 2) Also link foxsolid23df@gmail.com if not linked
UPDATE public.staff
SET auth_user_id = 'f3edec74-d99e-40af-8ae0-f1b05231573f'
WHERE LOWER(email) = LOWER('foxsolid23df@gmail.com')
  AND auth_user_id IS NULL;

-- 3) Link ALL unlinked auth users by email match
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT au.id, au.email
    FROM auth.users au
    WHERE EXISTS (
      SELECT 1 FROM public.staff s
      WHERE LOWER(s.email) = LOWER(au.email)
      AND s.auth_user_id IS NULL
    )
  LOOP
    UPDATE public.staff
    SET auth_user_id = r.id
    WHERE LOWER(email) = LOWER(r.email)
      AND auth_user_id IS NULL;
    RAISE NOTICE 'Linked % -> %', r.email, r.id;
  END LOOP;
END $$;

-- 4) Verify linkage
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT s.email, s.auth_user_id, s.tenant_id
    FROM public.staff s
    WHERE s.auth_user_id IS NOT NULL
  LOOP
    RAISE NOTICE 'Staff: % | auth_user_id: % | tenant_id: %', r.email, r.auth_user_id, r.tenant_id;
  END LOOP;
END $$;

-- 5) Ensure tenants_public_read exists (safe for anon + auth)
DROP POLICY IF EXISTS "tenants_public_read" ON public.tenants;
CREATE POLICY "tenants_public_read" ON public.tenants
  FOR SELECT USING (true);

-- 6) Ensure staff_self_read exists (lets logged-in user read own record)
DROP POLICY IF EXISTS "staff_self_read" ON public.staff;
CREATE POLICY "staff_self_read" ON public.staff
  FOR SELECT USING (auth.uid() = auth_user_id);

-- 7) Test: simulate what the hook would do
DO $$
DECLARE
  v_uid uuid := '9857e2ec-5fd8-4f67-b0d5-968c20ef2891';
  v_tenant uuid;
  v_role text;
  r RECORD;
BEGIN
  SELECT tenant_id, role INTO v_tenant, v_role
  FROM public.staff WHERE auth_user_id = v_uid LIMIT 1;

  IF v_tenant IS NOT NULL THEN
    RAISE NOTICE 'HOOK TEST OK: tenant=% role=%', v_tenant, v_role;
  ELSE
    RAISE WARNING 'HOOK TEST FAIL: no staff with auth_user_id=%', v_uid;
    FOR r IN SELECT id, email, auth_user_id, tenant_id FROM public.staff LOOP
      RAISE NOTICE 'Staff: id=% email=% auth_uid=% tenant=%', r.id, r.email, r.auth_user_id, r.tenant_id;
    END LOOP;
  END IF;
END $$;
