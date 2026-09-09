-- 020_nuke_rls_and_rebuild.sql — Nuclear option: drop ALL policies, recreate clean
-- This eliminates any conflicting or broken RLS policies and starts fresh.

-- 1) Drop ALL policies on tenants
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tenants'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.tenants', pol.policyname);
    RAISE NOTICE 'Dropped policy % on tenants', pol.policyname;
  END LOOP;
END $$;

-- 2) Drop ALL policies on staff
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.staff', pol.policyname);
    RAISE NOTICE 'Dropped policy % on staff', pol.policyname;
  END LOOP;
END $$;

-- 3) Recreate tenants policies (CLEAN)
CREATE POLICY "tenants_allow_all" ON public.tenants
  FOR ALL USING (true) WITH CHECK (true);

-- 4) Recreate staff policies (CLEAN)
CREATE POLICY "staff_allow_authenticated" ON public.staff
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 5) Enable RLS (idempotent)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 6) Verify policies exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tenants' AND policyname = 'tenants_allow_all') THEN
    RAISE NOTICE 'tenants: tenants_allow_all policy OK';
  ELSE
    RAISE WARNING 'tenants: tenants_allow_all policy MISSING';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'staff_allow_authenticated') THEN
    RAISE NOTICE 'staff: staff_allow_authenticated policy OK';
  ELSE
    RAISE WARNING 'staff: staff_allow_authenticated policy MISSING';
  END IF;
END $$;

-- 7) Verify auth_user_id linkage
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT email, auth_user_id, tenant_id FROM public.staff LOOP
    RAISE NOTICE 'Staff: % | auth_uid: % | tenant: %', r.email, r.auth_user_id, r.tenant_id;
  END LOOP;
END $$;
