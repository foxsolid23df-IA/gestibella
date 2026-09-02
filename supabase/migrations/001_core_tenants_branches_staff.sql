-- 001_core_tenants_branches_staff.sql
-- Multi-tenant core: tenants, branches, staff
-- Fase 5 hardening: RLS demo = allow all (USING true) para login fake

-- Enums
do $$ begin create type user_role as enum ('ADMIN','MANAGER','STYLIST','RECEPTIONIST'); exception when duplicate_object then null; end $$;
do $$ begin create type branch_status as enum ('ACTIVE','SYNCING','MAINTENANCE'); exception when duplicate_object then null; end $$;

-- Tenants
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  business_name text not null,
  tax_id text,
  plan_tier text not null default 'pro' check (plan_tier in ('starter','pro','elite')),
  currency text not null default 'MXN',
  timezone text not null default 'America/Mexico_City',
  created_at timestamptz not null default now()
);
create index if not exists tenants_slug_idx on public.tenants(slug);

-- Branches
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  address text not null,
  phone text,
  manager_name text,
  active_staff_count int not null default 0,
  today_sales numeric(12,2) not null default 0,
  monthly_revenue numeric(12,2) not null default 0,
  status branch_status not null default 'ACTIVE',
  color_tag text,
  created_at timestamptz not null default now(),
  unique(tenant_id, code)
);
create index if not exists branches_tenant_idx on public.branches(tenant_id);

-- Staff
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role user_role not null,
  role_title text not null,
  avatar text,
  service_commission_rate numeric(5,4) not null default 0.40,
  product_commission_rate numeric(5,4) not null default 0.10,
  specialties text[] not null default '{}',
  color_tag text,
  is_active boolean not null default true,
  permissions jsonb not null default '{"canAccessPOS": true, "canAccessFinances": false, "canAccessInventory": true, "canAccessReports": false, "canManageStaff": false}',
  created_at timestamptz not null default now(),
  unique(tenant_id, email)
);
create index if not exists staff_tenant_idx on public.staff(tenant_id);

-- RLS demo: allow all (login fake)
alter table public.tenants enable row level security;
alter table public.branches enable row level security;
alter table public.staff enable row level security;
drop policy if exists "demo_allow_all" on public.tenants;
create policy "demo_allow_all" on public.tenants for all using (true) with check (true);
drop policy if exists "demo_allow_all" on public.branches;
create policy "demo_allow_all" on public.branches for all using (true) with check (true);
drop policy if exists "demo_allow_all" on public.staff;
create policy "demo_allow_all" on public.staff for all using (true) with check (true);
