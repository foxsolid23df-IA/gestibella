-- 022_restore_tenant_isolation.sql — Restore proper RLS on ALL tables
-- DEPENDS ON: 021_diagnose_hook_and_linkage.sql (run diagnostic FIRST)
-- This script replaces permissive policies with tenant_isolation.
-- If hook doesn't inject tenant_id, app will still work via staff_self_read fallback.

-- ============================================================
-- TENANTS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenants_allow_all" ON public.tenants;
  DROP POLICY IF EXISTS "tenants_public_read" ON public.tenants;
  DROP POLICY IF EXISTS "tenant_isolation" ON public.tenants;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants_public_read" ON public.tenants
  FOR SELECT USING (true);

CREATE POLICY "tenant_isolation" ON public.tenants
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- STAFF
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "staff_allow_authenticated" ON public.staff;
  DROP POLICY IF EXISTS "staff_self_read" ON public.staff;
  DROP POLICY IF EXISTS "tenant_isolation" ON public.staff;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_self_read" ON public.staff
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "tenant_isolation" ON public.staff
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- BRANCHES
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.branches;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.branches;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.branches
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- SERVICES
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.services;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.services;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.services
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- INVENTORY_ITEMS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.inventory_items;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.inventory_items;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.inventory_items
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- BRANCH_INVENTORY (no tenant_id, derives via branch_id)
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.branch_inventory;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.branch_inventory;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.branch_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.branch_inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.branches b
      WHERE b.id = branch_id
      AND b.tenant_id = (auth.jwt()->>'tenant_id')::uuid
    )
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.branches b
      WHERE b.id = branch_id
      AND b.tenant_id = (auth.jwt()->>'tenant_id')::uuid
    )
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- CLIENTS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.clients;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.clients;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.clients
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- CLIENT_PACKAGES
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.client_packages;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.client_packages;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.client_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.client_packages
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- TECHNICAL_FORMULAS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.technical_formulas;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.technical_formulas;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.technical_formulas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.technical_formulas
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- UPSELL_ITEMS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.upsell_items;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.upsell_items;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.upsell_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.upsell_items
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- ANTI_NOSHOW_SETTINGS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.anti_noshow_settings;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.anti_noshow_settings;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.anti_noshow_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.anti_noshow_settings
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- RECEIPT_CONFIG
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.receipt_config;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.receipt_config;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.receipt_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.receipt_config
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- APPOINTMENTS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.appointments;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.appointments;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.appointments
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- WAITLIST_ENTRIES
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.waitlist_entries;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.waitlist_entries;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.waitlist_entries
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- TICKETS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.tickets;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.tickets;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.tickets
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- TICKET_ITEMS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.ticket_items;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.ticket_items;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.ticket_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.ticket_items
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- EXPENSES
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.expenses;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.expenses;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.expenses
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- BRANCH_TRANSFERS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.branch_transfers;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.branch_transfers;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.branch_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.branch_transfers
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- ACTIVE_SESSIONS
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.active_sessions;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.active_sessions;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.active_sessions
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- PLATFORM_ADMINS (solo super_admin)
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "platform_admins_self" ON public.platform_admins;
  DROP POLICY IF EXISTS "platform_admins_superadmin_all" ON public.platform_admins;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.platform_admins;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_admins_self" ON public.platform_admins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "platform_admins_superadmin_all" ON public.platform_admins
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid() AND is_super_admin)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid() AND is_super_admin)
  );

-- ============================================================
-- LICENSES
-- ============================================================
DO $$ BEGIN
  DROP POLICY IF EXISTS "tenant_isolation" ON public.licenses;
  DROP POLICY IF EXISTS "demo_allow_all" ON public.licenses;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON public.licenses
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- RESUMEN
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  RAISE NOTICE '=== RLS Policies Applied ===';
  FOR r IN
    SELECT tablename, COUNT(*) AS policies
    FROM pg_policies WHERE schemaname = 'public'
    GROUP BY tablename ORDER BY tablename
  LOOP
    RAISE NOTICE '%: % policies', r.tablename, r.policies;
  END LOOP;
END $$;
