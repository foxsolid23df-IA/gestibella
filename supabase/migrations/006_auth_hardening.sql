-- 006_auth_hardening.sql — RLS tenant_isolation + Auth real (super-admin solo tú)
-- Reemplaza demo_allow_all por aislamiento por JWT (auth.jwt()->>'tenant_id')
-- Mantiene compat manual: si no hay JWT (anon), las políticas permiten solo lectura de tenants para resolver slug (fallback)

-- 1) staff.auth_user_id
alter table public.staff add column if not exists auth_user_id uuid references auth.users(id) on delete set null;
create index if not exists staff_auth_user_idx on public.staff(auth_user_id);
create unique index if not exists staff_auth_unique on public.staff(auth_user_id) where auth_user_id is not null;

-- 2) Hook para inyectar tenant_id en JWT (custom_access_token_hook)
-- Supabase Auth llama a esta función al generar el JWT. Si el usuario es staff, inyecta tenant_id.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  claims jsonb;
  user_id uuid;
  v_tenant uuid;
  v_is_super boolean;
begin
  claims := event->'claims';
  user_id := (event->>'user_id')::uuid;

  -- ¿Es super-admin? No inyectar tenant_id, deja que /admin use service_role check aparte
  select exists(select 1 from public.platform_admins where platform_admins.user_id = user_id and is_super_admin) into v_is_super;
  if v_is_super then
    return event;
  end if;

  select tenant_id into v_tenant from public.staff where auth_user_id = user_id limit 1;
  if v_tenant is not null then
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_tenant::text));
    -- también exponer role para posible gating futuro
    claims := jsonb_set(claims, '{user_role}', to_jsonb((select role::text from public.staff where auth_user_id=user_id limit 1)));
  end if;
  return jsonb_set(event, '{claims}', claims);
end $$;

-- 3) Reemplazar RLS demo_allow_all por tenant_isolation
-- Lista completa de tablas con tenant_id
do $$
declare
  t text;
  tables text[] := array[
    'tenants','branches','staff','services','inventory_items','branch_inventory',
    'clients','client_packages','technical_formulas','upsell_items','anti_noshow_settings','receipt_config',
    'appointments','waitlist_entries','tickets','ticket_items','expenses','branch_transfers','active_sessions','licenses'
  ];
begin
  foreach t in array tables loop
    -- solo si la tabla existe
    if exists (select 1 from information_schema.tables where table_schema='public' and table_name=t) then
      execute format('alter table public.%I enable row level security', t);
      execute format('drop policy if exists "demo_allow_all" on public.%I', t);
      -- tenants es especial: permitir lectura anon para resolver slug, pero escritura solo super_admin/service_role
      if t = 'tenants' then
        execute 'drop policy if exists "tenant_isolation" on public.tenants';
        execute 'drop policy if exists "tenants_public_read" on public.tenants';
        execute 'create policy "tenants_public_read" on public.tenants for select using (true)';
        execute 'create policy "tenant_isolation" on public.tenants for all using (
          (auth.jwt() ->> ''tenant_id'')::uuid = id OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        ) with check (
          (auth.jwt() ->> ''tenant_id'')::uuid = id OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        )';
      elsif t = 'licenses' or t = 'platform_admins' then
        execute format('drop policy if exists "tenant_isolation" on public.%I', t);
        execute format('create policy "tenant_isolation" on public.%I for all using (
          exists (select 1 from public.platform_admins where user_id = auth.uid())
          OR (auth.jwt() ->> ''tenant_id'')::uuid = tenant_id
        ) with check (
          exists (select 1 from public.platform_admins where user_id = auth.uid())
          OR (auth.jwt() ->> ''tenant_id'')::uuid = tenant_id
        )', t, t);
      elsif t = 'branch_inventory' then
        -- branch_inventory no tiene tenant_id directo; deriva via branch_id -> branches.tenant_id
        execute 'drop policy if exists "tenant_isolation" on public.branch_inventory';
        execute 'create policy "tenant_isolation" on public.branch_inventory for all using (
          exists (select 1 from public.branches b where b.id = branch_id and b.tenant_id = (auth.jwt()->>''tenant_id'')::uuid)
          OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        ) with check (
          exists (select 1 from public.branches b where b.id = branch_id and b.tenant_id = (auth.jwt()->>''tenant_id'')::uuid)
          OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        )';
      elsif t = 'ticket_items' or t = 'client_packages' or t = 'technical_formulas' then
        execute format('drop policy if exists "tenant_isolation" on public.%I', t);
        execute format('create policy "tenant_isolation" on public.%I for all using (
          (auth.jwt() ->> ''tenant_id'')::uuid = tenant_id OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        ) with check (
          (auth.jwt() ->> ''tenant_id'')::uuid = tenant_id OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        )', t, t);
      else
        execute format('drop policy if exists "tenant_isolation" on public.%I', t);
        execute format('create policy "tenant_isolation" on public.%I for all using (
          (auth.jwt() ->> ''tenant_id'')::uuid = tenant_id OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        ) with check (
          (auth.jwt() ->> ''tenant_id'')::uuid = tenant_id OR exists (select 1 from public.platform_admins where user_id = auth.uid())
        )', t, t);
      end if;
    end if;
  end loop;
end $$;

-- 4) Permitir que anon aún pueda resolver tenant por slug para el flujo de login (antes de tener JWT)
-- La política tenants_public_read ya permite select sin JWT. Para el resto, el app hará fallback a modo DEMO local si no hay sesión (no rompe).

-- Nota: activar hook en Supabase Dashboard → Auth → Hooks → Custom Access Token → public.custom_access_token_hook
-- O vía SQL: update auth.config set custom_access_token_hook = 'public.custom_access_token_hook' (requiere superuser, se hace manual en dashboard)
