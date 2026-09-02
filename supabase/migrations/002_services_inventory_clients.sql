-- 002_services_inventory_clients.sql
do $$ begin create type service_category as enum ('Cabello','Colorimetría','Manicura & Pedicura','Spa & Masajes','Faciales','Cejas & Pestañas'); exception when duplicate_object then null; end $$;
do $$ begin create type inventory_category as enum ('Tintes','Tratamientos','Shampoo & Cuidado','Químicos & Peróxidos','Insumos Desechables','Retail Venta'); exception when duplicate_object then null; end $$;

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  category service_category not null,
  duration_minutes int not null,
  price numeric(10,2) not null,
  cost numeric(10,2) not null default 0,
  required_supplies jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists services_tenant_idx on public.services(tenant_id);

-- Inventory items
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  sku text not null,
  name text not null,
  brand text,
  category inventory_category not null,
  unit text not null,
  cost_price numeric(10,4) not null,
  retail_price numeric(10,2),
  is_retail boolean not null default false,
  location text,
  min_stock numeric(12,2) not null default 0,
  max_stock numeric(12,2) not null default 100,
  current_stock numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  unique(tenant_id, sku)
);
create index if not exists inventory_tenant_idx on public.inventory_items(tenant_id);

-- Branch inventory (normaliza branchStock Record<string,number> de InventoryItem)
create table if not exists public.branch_inventory (
  branch_id uuid not null references public.branches(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  stock numeric(12,2) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (branch_id, inventory_item_id)
);
create index if not exists branch_inventory_item_idx on public.branch_inventory(inventory_item_id);

-- Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  avatar text,
  joined_date date not null default current_date,
  total_spent numeric(12,2) not null default 0,
  visit_count int not null default 0,
  loyalty_points int not null default 0,
  stamp_card_count int not null default 0 check (stamp_card_count >=0 and stamp_card_count <=6),
  preferred_staff_id uuid references public.staff(id) on delete set null,
  allergies_or_notes text,
  created_at timestamptz not null default now()
);
create index if not exists clients_tenant_idx on public.clients(tenant_id);

-- Client packages (activePackages)
create table if not exists public.client_packages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  package_name text not null,
  total_sessions int not null,
  used_sessions int not null default 0,
  expiry_date date not null,
  created_at timestamptz not null default now()
);
create index if not exists client_packages_client_idx on public.client_packages(client_id);

-- Technical formulas
do $$ begin create type porosity as enum ('Baja','Media','Alta'); exception when duplicate_object then null; end $$;
create table if not exists public.technical_formulas (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  client_name text not null,
  staff_id uuid not null references public.staff(id) on delete restrict,
  staff_name text not null,
  service_type text not null,
  base_natural text,
  porosity porosity not null,
  formula_details text not null,
  exposure_time_minutes int not null,
  treatment_used text,
  photo_url text,
  notes text,
  date date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists formulas_client_idx on public.technical_formulas(client_id);
create index if not exists formulas_tenant_idx on public.technical_formulas(tenant_id);

-- RLS demo
alter table public.services enable row level security;
alter table public.inventory_items enable row level security;
alter table public.branch_inventory enable row level security;
alter table public.clients enable row level security;
alter table public.client_packages enable row level security;
alter table public.technical_formulas enable row level security;
do $$ declare t text; begin foreach t in array array['services','inventory_items','branch_inventory','clients','client_packages','technical_formulas'] loop execute format('drop policy if exists "demo_allow_all" on public.%I', t); execute format('create policy "demo_allow_all" on public.%I for all using (true) with check (true)', t); end loop; end $$;
