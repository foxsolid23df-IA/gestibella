-- 014_force_login_fix.sql — Emergency fix: make login work even without hook
-- Problem: custom_access_token_hook may not be injecting tenant_id into JWT.
-- This causes ALL tenant_isolation RLS policies to block queries (500 errors).
-- Solution: Add a bypass for authenticated users querying their OWN staff record,
-- and make get_my_tenant work regardless of hook status.

-- 1) Ensure auth_user_id is linked for foxsolid22df@gmail.com
DO $$
DECLARE
  v_auth_id uuid;
  v_staff_id uuid;
BEGIN
  -- Find auth user
  SELECT id INTO v_auth_id FROM auth.users WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com');
  IF v_auth_id IS NULL THEN
    RAISE NOTICE 'No auth user found for foxsolid22df@gmail.com';
    RETURN;
  END IF;

  -- Find staff by email
  SELECT id INTO v_staff_id FROM public.staff WHERE LOWER(email) = LOWER('foxsolid22df@gmail.com') LIMIT 1;

  IF v_staff_id IS NOT NULL THEN
    UPDATE public.staff SET auth_user_id = v_auth_id WHERE id = v_staff_id;
    RAISE NOTICE 'Linked staff % to auth_user %', v_staff_id, v_auth_id;
  ELSE
    RAISE NOTICE 'No staff record found for foxsolid22df@gmail.com - check staff table';
  END IF;
END $$;

-- 2) Also link ALL unlinked auth users to staff by email
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT au.id AS auth_uid, au.email, s.id AS staff_id
    FROM auth.users au
    JOIN public.staff s ON LOWER(s.email) = LOWER(au.email)
    WHERE s.auth_user_id IS NULL
      AND au.email IS NOT NULL
  LOOP
    UPDATE public.staff SET auth_user_id = r.auth_uid WHERE id = r.staff_id;
    RAISE NOTICE 'Auto-linked staff % (%) to auth_user %', r.staff_id, r.email, r.auth_uid;
  END LOOP;
END $$;

-- 3) Add staff_self_read policy (allows reading own staff record even without tenant_id in JWT)
DROP POLICY IF EXISTS "staff_self_read" ON public.staff;
CREATE POLICY "staff_self_read" ON public.staff
  FOR SELECT USING (auth.uid() = auth_user_id);

-- 4) Add tenants_public_read (ensure anon + auth can read tenants for slug resolution)
DROP POLICY IF EXISTS "tenants_public_read" ON public.tenants;
CREATE POLICY "tenants_public_read" ON public.tenants
  FOR SELECT USING (true);

-- 5) Rewrite get_my_tenant to work WITHOUT hook (uses email fallback)
DROP FUNCTION IF EXISTS public.get_my_tenant();

CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS TABLE (tenant_id uuid, slug text, business_name text, is_demo boolean, staff_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_auth_id uuid := auth.uid();
  v_staff RECORD;
  v_tenant RECORD;
BEGIN
  -- Primary: find via auth_user_id
  SELECT s.id AS sid, t.id AS tid, t.slug AS tslug, t.business_name AS tname, COALESCE(t.is_demo, false) AS tdemo
  INTO v_staff
  FROM public.staff s
  JOIN public.tenants t ON t.id = s.tenant_id
  WHERE s.auth_user_id = v_auth_id
  LIMIT 1;

  IF FOUND THEN
    tenant_id := v_staff.tid;
    slug := v_staff.tslug;
    business_name := v_staff.tname;
    is_demo := v_staff.tdemo;
    staff_id := v_staff.sid;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Fallback: resolve by email
  SELECT t.id AS tid, t.slug AS tslug, t.business_name AS tname, COALESCE(t.is_demo, false) AS tdemo
  INTO v_tenant
  FROM public.tenants t
  JOIN public.staff s ON s.tenant_id = t.id
  WHERE LOWER(s.email) = LOWER((SELECT email FROM auth.users WHERE id = v_auth_id))
  LIMIT 1;

  IF FOUND THEN
    tenant_id := v_tenant.tid;
    slug := v_tenant.tslug;
    business_name := v_tenant.tname;
    is_demo := v_tenant.tdemo;
    staff_id := NULL;
    RETURN NEXT;
  END IF;
END $$;

REVOKE ALL ON FUNCTION public.get_my_tenant() FROM public;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO anon;

-- 6) Diagnostic: check hook status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'custom_access_token_hook') THEN
    RAISE WARNING 'custom_access_token_hook does NOT exist in database!';
  ELSE
    RAISE NOTICE 'custom_access_token_hook exists in database';
  END IF;
END $$;
