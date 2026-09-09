-- 025_fix_the_actual_staff_record.sql — Find and fix the REAL staff record

-- 1) Find the staff record that get_my_tenant returns
SELECT id, name, email, auth_user_id, tenant_id, role
FROM public.staff
WHERE id = '6faac20a-5f4e-4c9d-b0ff-039e88a37055';

-- 2) Show ALL staff records to find which one matches
SELECT id, name, email, auth_user_id, tenant_id, role
FROM public.staff
ORDER BY created_at;

-- 3) Link the correct staff record to foxsolid22df@gmail.com auth user
-- Auth UID: 9857e2ec-5fd8-4f67-b0d5-968c20ef2891
UPDATE public.staff
SET auth_user_id = '9857e2ec-5fd8-4f67-b0d5-968c20ef2891'
WHERE id = '6faac20a-5f4e-4c9d-b0ff-039e88a37055';

-- 4) Verify
SELECT id, name, email, auth_user_id, tenant_id, role
FROM public.staff
WHERE id = '6faac20a-5f4e-4c9d-b0ff-039e88a37055';

-- 5) Simulate hook
DO $$
DECLARE
  v_tenant uuid;
  v_role text;
BEGIN
  SELECT tenant_id, role INTO v_tenant, v_role
  FROM public.staff
  WHERE auth_user_id = '9857e2ec-5fd8-4f67-b0d5-968c20ef2891'
  LIMIT 1;

  IF v_tenant IS NOT NULL THEN
    RAISE NOTICE 'HOOK OK: tenant=% role=%', v_tenant, v_role;
  ELSE
    RAISE WARNING 'HOOK FAIL: no staff with auth_user_id=9857e2ec-5fd8-4f67-b0d5-968c20ef2891';
  END IF;
END $$;
