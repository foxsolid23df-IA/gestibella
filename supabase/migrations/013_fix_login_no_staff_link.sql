-- 013_fix_login_no_staff_link.sql — Fix login when auth_user_id is not linked to staff
-- Problem: User signs in via Supabase Auth but has no staff.auth_user_id linked.
-- get_my_tenant returns empty → client fallback blocked by RLS → "Credenciales inválidas"
-- Solution: Auto-link auth_user_id to staff by matching email, then fix get_my_tenant fallback.

-- 1) Auto-link unlinked auth users to staff by email
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
    UPDATE public.staff
    SET auth_user_id = r.auth_uid
    WHERE id = r.staff_id;
    RAISE NOTICE 'Linked staff % (%) to auth_user %', r.staff_id, r.email, r.auth_uid;
  END LOOP;
END $$;

-- 2) Fix get_my_tenant: fallback by email when no staff.auth_user_id match
DROP FUNCTION IF EXISTS public.get_my_tenant();

CREATE OR REPLACE FUNCTION public.get_my_tenant()
RETURNS TABLE (tenant_id uuid, slug text, business_name text, is_demo boolean, staff_id uuid)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  -- Primary: find via auth_user_id (normal path)
  SELECT t.id, t.slug, t.business_name, COALESCE(t.is_demo, false), s.id
  FROM public.staff s
  JOIN public.tenants t ON t.id = s.tenant_id
  WHERE s.auth_user_id = auth.uid()
  LIMIT 1

  UNION ALL

  -- Fallback: resolve tenant by email when no staff link exists
  SELECT t.id, t.slug, t.business_name, COALESCE(t.is_demo, false), NULL::uuid
  FROM public.tenants t
  JOIN public.staff s ON s.tenant_id = t.id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.staff sx WHERE sx.auth_user_id = auth.uid()
  )
  AND LOWER(s.email) = LOWER((SELECT email FROM auth.users WHERE id = auth.uid()))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_my_tenant() FROM public;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO anon;
