-- 005_licenses.sql — Sistema de licencias por tiempo (manual, super-admin solo tú)
-- Límites: starter 3/1/150, pro 10/3/ilimitado, elite ilimitado

-- 1) Extender tenants
alter table public.tenants add column if not exists max_staff int;
alter table public.tenants add column if not exists max_branches int;
alter table public.tenants add column if not exists max_clients int;
alter table public.tenants add column if not exists status text not null default 'trialing' check (status in ('trialing','active','past_due','suspended','cancelled'));
alter table public.tenants add column if not exists trial_ends_at timestamptz;
alter table public.tenants add column if not exists current_period_end timestamptz;
alter table public.tenants add column if not exists owner_email text;
alter table public.tenants add column if not exists notes text;
alter table public.tenants add column if not exists seats_override jsonb default '{}';

-- Backfill límites según plan_tier existente
update public.tenants set max_staff = 3, max_branches = 1, max_clients = 150 where plan_tier = 'starter' and max_staff is null;
update public.tenants set max_staff = 10, max_branches = 3, max_clients = null where plan_tier = 'pro' and max_staff is null;
update public.tenants set max_staff = null, max_branches = null, max_clients = null where plan_tier = 'elite' and max_staff is null;
-- Demo tenant pro
update public.tenants set status='active', current_period_end = now() + interval '12 months', trial_ends_at = now() + interval '14 days' where slug='gestibella-demo' and current_period_end is null;

-- 2) platform_admins (solo tú)
create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_super_admin boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.platform_admins enable row level security;
drop policy if exists "platform_admins_self" on public.platform_admins;
create policy "platform_admins_self" on public.platform_admins for select using (auth.uid() = user_id);
drop policy if exists "demo_allow_all" on public.platform_admins;
create policy "demo_allow_all" on public.platform_admins for all using (true) with check (true);

-- 3) licenses histórico
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text unique not null,
  plan_tier text not null check (plan_tier in ('starter','pro','elite')),
  max_staff int,
  max_branches int,
  features jsonb not null default '[]',
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  issued_by uuid references auth.users(id),
  notes text,
  status text not null default 'active' check (status in ('active','revoked','expired'))
);
create index if not exists licenses_tenant_idx on public.licenses(tenant_id);
create index if not exists licenses_code_idx on public.licenses(code);
create index if not exists licenses_expires_idx on public.licenses(expires_at);
alter table public.licenses enable row level security;
drop policy if exists "demo_allow_all" on public.licenses;
create policy "demo_allow_all" on public.licenses for all using (true) with check (true);

-- Helper para generar code GB-YYYY-XXXX
create or replace function public.generate_license_code() returns text language plpgsql as $$
declare c text;
begin
  c := 'GB-' || to_char(now(),'YYYY-') || upper(substr(md5(random()::text),1,6));
  return c;
end $$;

-- Trigger enforcement límites (solo starter/pro con límite not null)
create or replace function public.enforce_tenant_limits() returns trigger language plpgsql as $$
declare v_max int; v_count int; v_tenant uuid; v_plan text;
begin
  if TG_TABLE_NAME = 'staff' then v_tenant := NEW.tenant_id;
  elsif TG_TABLE_NAME = 'branches' then v_tenant := NEW.tenant_id;
  elsif TG_TABLE_NAME = 'clients' then v_tenant := NEW.tenant_id;
  else return NEW;
  end if;

  if TG_TABLE_NAME = 'staff' then
    select max_staff, plan_tier into v_max, v_plan from public.tenants where id = v_tenant;
    if v_max is not null then
      select count(*) into v_count from public.staff where tenant_id = v_tenant;
      if v_count >= v_max then raise exception 'Limite del plan % alcanzado: % staff maximo', v_plan, v_max; end if;
    end if;
  elsif TG_TABLE_NAME = 'branches' then
    select max_branches, plan_tier into v_max, v_plan from public.tenants where id = v_tenant;
    if v_max is not null then
      select count(*) into v_count from public.branches where tenant_id = v_tenant;
      if v_count >= v_max then raise exception 'Limite del plan % alcanzado: % sucursales maximo', v_plan, v_max; end if;
    end if;
  elsif TG_TABLE_NAME = 'clients' then
    select max_clients into v_max from public.tenants where id = v_tenant;
    if v_max is not null then
      select count(*) into v_count from public.clients where tenant_id = v_tenant;
      if v_count >= v_max then raise exception 'Limite del plan starter alcanzado: % clientes maximo', v_max; end if;
    end if;
  end if;
  return NEW;
end $$;

drop trigger if exists trg_enforce_staff_limit on public.staff;
create trigger trg_enforce_staff_limit before insert on public.staff for each row execute function public.enforce_tenant_limits();
drop trigger if exists trg_enforce_branch_limit on public.branches;
create trigger trg_enforce_branch_limit before insert on public.branches for each row execute function public.enforce_tenant_limits();
drop trigger if exists trg_enforce_client_limit on public.clients;
create trigger trg_enforce_client_limit before insert on public.clients for each row execute function public.enforce_tenant_limits();
