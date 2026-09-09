-- 023_revert_to_permissive.sql — REVERT: restore permissive RLS (emergency rollback)
-- The tenant_isolation policies broke login because the hook doesn't inject tenant_id.
-- This restores the working permissive policies.

-- TENANTS: allow all
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenants_public_read" ON public.tenants;
  DROP POLICY IF EXISTS "tenant_isolation" ON public.tenants;
  DROP POLICY IF EXISTS "tenants_allow_all" ON public.tenants;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
CREATE POLICY "tenants_allow_all" ON public.tenants FOR ALL USING (true) WITH CHECK (true);

-- STAFF: allow authenticated
DO $$ BEGIN
  DROP POLICY IF EXISTS "staff_self_read" ON public.staff;
  DROP POLICY IF EXISTS "tenant_isolation" ON public.staff;
  DROP POLICY IF EXISTS "staff_allow_authenticated" ON public.staff;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
CREATE POLICY "staff_allow_authenticated" ON public.staff FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ALL OTHER TABLES: allow authenticated
DO $$
DECLARE
  t text;
  tables text[] := array[
    'branches','services','inventory_items','branch_inventory',
    'clients','client_packages','technical_formulas','upsell_items',
    'anti_noshow_settings','receipt_config','appointments','waitlist_entries',
    'tickets','ticket_items','expenses','branch_transfers','active_sessions',
    'platform_admins','licenses'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t) THEN
      EXECUTE format('DROP POLICY IF EXISTS "tenant_isolation" ON public.%I', t);
      EXECUTE format('DROP POLICY IF EXISTS "demo_allow_all" ON public.%I', t);
      EXECUTE format('DROP POLICY IF EXISTS "%I_allow_authenticated" ON public.%I', t, t);
      EXECUTE format('CREATE POLICY "%I_allow_authenticated" ON public.%I FOR ALL USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'')', t, t);
    END IF;
  END LOOP;
END $$;
