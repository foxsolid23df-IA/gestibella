-- 028_verify_hook_injects_tenant.sql — FINAL verification before applying RLS
-- Run this AFTER logging in with foxsolid22df@gmail.com (permissive RLS active)

-- 1) Check what's in the JWT right now
SELECT
  auth.jwt()->>'user_id' AS jwt_user_id,
  auth.jwt()->>'tenant_id' AS jwt_tenant_id,
  auth.jwt()->>'user_role' AS jwt_user_role,
  auth.jwt()->>'role' AS jwt_role;

-- 2) Check if platform_admins has foxsolid22df (would skip tenant injection)
SELECT user_id, is_super_admin
FROM public.platform_admins
WHERE user_id = '9857e2ec-5fd8-4f67-b0d5-968c20ef2891';

-- 3) Direct test: can we read the tenant with current JWT?
SELECT id, slug, business_name
FROM public.tenants
WHERE id = 'ae52487f-bd89-4122-b9ae-5e45d6aeca71';

-- 4) Direct test: can we read staff with current JWT?
SELECT id, name, email, tenant_id
FROM public.staff
WHERE id = '6faac20a-5f4e-4c9d-b0ff-039e88a37055';
