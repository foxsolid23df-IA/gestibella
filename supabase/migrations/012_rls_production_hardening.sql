-- 012_rls_production_hardening.sql — Limpieza definitiva de RLS demo → producción
-- Este script elimina TODAS las políticas demo_allow_all y aplica tenant_isolation real.
-- Es idempotente: seguro de ejecutar en BD fresca o existente.
-- DEPENDE DE: 006_auth_hardening.sql (custom_access_token_hook + función base)

-- ============================================================
-- PASO 1: Eliminar TODAS las políticas demo_allow_all
-- ============================================================
DO $$
DECLARE
  t text;
  demo_tables text[] := array[
    'tenants','branches','staff',
    'services','inventory_items','branch_inventory','clients','client_packages','technical_formulas',
    'upsell_items','anti_noshow_settings','receipt_config','appointments','waitlist_entries',
    'tickets','ticket_items','expenses','branch_transfers','active_sessions',
    'platform_admins','licenses'
  ];
BEGIN
  FOREACH t IN ARRAY demo_tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t) THEN
      EXECUTE format('DROP POLICY IF EXISTS "demo_allow_all" ON public.%I', t);
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- PASO 2: Asegurar que RLS esté habilitado en TODAS las tablas
-- ============================================================
DO $$
DECLARE
  t text;
  all_tables text[] := array[
    'tenants','branches','staff',
    'services','inventory_items','branch_inventory','clients','client_packages','technical_formulas',
    'upsell_items','anti_noshow_settings','receipt_config','appointments','waitlist_entries',
    'tickets','ticket_items','expenses','branch_transfers','active_sessions',
    'platform_admins','licenses'
  ];
BEGIN
  FOREACH t IN ARRAY all_tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    END IF;
  END LOOP;
END $$;

-- ============================================================
-- PASO 3: Aplicar tenant_isolation en TODAS las tablas
-- ============================================================

-- TENANTS: pública para SELECT (login resuelve slug), escritura solo tenant_id match o super_admin
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenants_public_read" ON public.tenants;
CREATE POLICY "tenants_public_read" ON public.tenants
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "tenant_isolation" ON public.tenants;
CREATE POLICY "tenant_isolation" ON public.tenants
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- BRANCHES
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.branches;
CREATE POLICY "tenant_isolation" ON public.branches
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- STAFF: tenant_isolation + self_read (para login sin hook aún)
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.staff;
CREATE POLICY "tenant_isolation" ON public.staff
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );
DROP POLICY IF EXISTS "staff_self_read" ON public.staff;
CREATE POLICY "staff_self_read" ON public.staff
  FOR SELECT USING (auth.uid() = auth_user_id);

-- SERVICES
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.services;
CREATE POLICY "tenant_isolation" ON public.services
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- INVENTORY_ITEMS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.inventory_items;
CREATE POLICY "tenant_isolation" ON public.inventory_items
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- BRANCH_INVENTORY (no tiene tenant_id directo, deriva via branch_id)
ALTER TABLE public.branch_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.branch_inventory;
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

-- CLIENTS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.clients;
CREATE POLICY "tenant_isolation" ON public.clients
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- CLIENT_PACKAGES
ALTER TABLE public.client_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.client_packages;
CREATE POLICY "tenant_isolation" ON public.client_packages
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- TECHNICAL_FORMULAS
ALTER TABLE public.technical_formulas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.technical_formulas;
CREATE POLICY "tenant_isolation" ON public.technical_formulas
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- UPSELL_ITEMS
ALTER TABLE public.upsell_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.upsell_items;
CREATE POLICY "tenant_isolation" ON public.upsell_items
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ANTI_NOSHOW_SETTINGS
ALTER TABLE public.anti_noshow_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.anti_noshow_settings;
CREATE POLICY "tenant_isolation" ON public.anti_noshow_settings
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- RECEIPT_CONFIG
ALTER TABLE public.receipt_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.receipt_config;
CREATE POLICY "tenant_isolation" ON public.receipt_config
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- APPOINTMENTS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.appointments;
CREATE POLICY "tenant_isolation" ON public.appointments
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- WAITLIST_ENTRIES
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.waitlist_entries;
CREATE POLICY "tenant_isolation" ON public.waitlist_entries
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- TICKETS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.tickets;
CREATE POLICY "tenant_isolation" ON public.tickets
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- TICKET_ITEMS
ALTER TABLE public.ticket_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.ticket_items;
CREATE POLICY "tenant_isolation" ON public.ticket_items
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- EXPENSES
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.expenses;
CREATE POLICY "tenant_isolation" ON public.expenses
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- BRANCH_TRANSFERS
ALTER TABLE public.branch_transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.branch_transfers;
CREATE POLICY "tenant_isolation" ON public.branch_transfers
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ACTIVE_SESSIONS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.active_sessions;
CREATE POLICY "tenant_isolation" ON public.active_sessions
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- PLATFORM_ADMINS: solo super_admin puede ver su propia fila
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "platform_admins_self" ON public.platform_admins;
CREATE POLICY "platform_admins_self" ON public.platform_admins
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "platform_admins_superadmin_all" ON public.platform_admins;
CREATE POLICY "platform_admins_superadmin_all" ON public.platform_admins
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid() AND is_super_admin)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid() AND is_super_admin)
  );

-- LICENSES
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation" ON public.licenses;
CREATE POLICY "tenant_isolation" ON public.licenses
  FOR ALL USING (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  ) WITH CHECK (
    (auth.jwt()->>'tenant_id')::uuid = tenant_id
    OR EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid())
  );

-- ============================================================
-- PASO 4: Verificar que custom_access_token_hook existe
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'custom_access_token_hook') THEN
    RAISE WARNING 'custom_access_token_hook no existe. Ejecuta 006_auth_hardening.sql y 007_fix_hook.sql primero.';
  END IF;
END $$;

-- ============================================================
-- RESUMEN DE POLÍTICAS APLICADAS:
-- ============================================================
-- tenants:          public_read (anon puede resolver slug) + tenant_isolation
-- branches:         tenant_isolation
-- staff:            tenant_isolation + staff_self_read
-- services:         tenant_isolation
-- inventory_items:  tenant_isolation
-- branch_inventory: tenant_isolation (vía branch_id → branches.tenant_id)
-- clients:          tenant_isolation
-- client_packages:  tenant_isolation
-- technical_formulas: tenant_isolation
-- upsell_items:     tenant_isolation
-- anti_noshow_settings: tenant_isolation
-- receipt_config:   tenant_isolation
-- appointments:     tenant_isolation
-- waitlist_entries: tenant_isolation
-- tickets:          tenant_isolation
-- ticket_items:     tenant_isolation
-- expenses:         tenant_isolation
-- branch_transfers: tenant_isolation
-- active_sessions:  tenant_isolation
-- platform_admins:  self_read + superadmin_all
-- licenses:         tenant_isolation
-- ============================================================
