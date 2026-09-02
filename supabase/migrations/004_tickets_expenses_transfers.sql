-- 004_tickets_expenses_transfers.sql
do $$ begin create type ticket_status as enum ('OPEN','HOLD','PAID','CANCELLED'); exception when duplicate_object then null; end $$;
do $$ begin create type ticket_item_type as enum ('SERVICE','PRODUCT','PACKAGE'); exception when duplicate_object then null; end $$;
do $$ begin create type payment_method as enum ('EFECTIVO','TARJETA_CREDITO','TARJETA_DEBITO','TRANSFERENCIA','PUNTOS','MIXTO'); exception when duplicate_object then null; end $$;
do $$ begin create type expense_category as enum ('Insumos y Productos','Alquiler y Local','Servicios Básicos','Mantenimiento','Marketing y Publicidad','Nómina y Comisiones','Otros'); exception when duplicate_object then null; end $$;
do $$ begin create type transfer_status as enum ('COMPLETED','IN_TRANSIT','CANCELLED'); exception when duplicate_object then null; end $$;

-- Sale tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  ticket_number text not null,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  chair_number text,
  status ticket_status not null default 'HOLD',
  created_at timestamptz not null default now(),
  appointment_id uuid references public.appointments(id) on delete set null,
  subtotal numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  deposit_credited numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  tip numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_method payment_method,
  payment_details jsonb,
  paid_at timestamptz,
  closed_by_staff_id uuid references public.staff(id) on delete set null,
  unique(tenant_id, ticket_number)
);
create index if not exists tickets_tenant_idx on public.tickets(tenant_id);
create index if not exists tickets_status_idx on public.tickets(status);

-- Ticket items
create table if not exists public.ticket_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  type ticket_item_type not null,
  item_id text not null,
  name text not null,
  staff_id uuid not null references public.staff(id) on delete restrict,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null
);
create index if not exists ticket_items_ticket_idx on public.ticket_items(ticket_id);

-- Expenses
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  date date not null,
  concept text not null,
  category expense_category not null,
  amount numeric(12,2) not null,
  payment_method text not null,
  receipt_number text,
  registered_by text,
  created_at timestamptz not null default now()
);
create index if not exists expenses_tenant_date_idx on public.expenses(tenant_id, date);

-- Branch product transfers
create table if not exists public.branch_transfers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  transfer_code text not null,
  date text not null,
  source_branch_id uuid not null references public.branches(id) on delete restrict,
  source_branch_name text not null,
  destination_branch_id uuid not null references public.branches(id) on delete restrict,
  destination_branch_name text not null,
  product_id uuid not null references public.inventory_items(id) on delete restrict,
  product_name text not null,
  product_sku text not null,
  quantity numeric(12,2) not null,
  unit text not null,
  authorized_by text,
  notes text,
  status transfer_status not null default 'COMPLETED',
  created_at timestamptz not null default now(),
  unique(tenant_id, transfer_code)
);
create index if not exists branch_transfers_tenant_idx on public.branch_transfers(tenant_id);

-- Active device sessions (para AuthorizedDevicesModule)
create table if not exists public.active_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  device_name text not null,
  device_type text not null check (device_type in ('Desktop','Tablet','Mobile')),
  browser text,
  ip_address text,
  location text,
  last_active text,
  is_current boolean not null default false,
  role text,
  token_signature text,
  created_at timestamptz not null default now()
);

-- RPC transaccional para traspaso entre sucursales (evita race, usado por transferProductBetweenBranches)
create or replace function public.transfer_product(
  p_tenant_id uuid,
  p_source_branch_id uuid,
  p_destination_branch_id uuid,
  p_product_id uuid,
  p_quantity numeric,
  p_authorized_by text,
  p_notes text
) returns uuid
language plpgsql
as $$
declare v_transfer_id uuid;
begin
  if p_source_branch_id = p_destination_branch_id then
    raise exception 'Origen y destino no pueden ser iguales';
  end if;
  if p_quantity <= 0 then raise exception 'Cantidad debe ser >0'; end if;

  -- lock rows para evitar race
  perform 1 from public.branch_inventory where branch_id = p_source_branch_id and inventory_item_id = p_product_id for update;

  -- validar stock origen
  if (select coalesce(stock,0) from public.branch_inventory where branch_id = p_source_branch_id and inventory_item_id = p_product_id) < p_quantity then
    raise exception 'Stock insuficiente en origen';
  end if;

  -- decrementar origen
  update public.branch_inventory set stock = stock - p_quantity, updated_at = now()
  where branch_id = p_source_branch_id and inventory_item_id = p_product_id;

  -- incrementar destino (upsert)
  insert into public.branch_inventory(branch_id, inventory_item_id, stock)
  values (p_destination_branch_id, p_product_id, p_quantity)
  on conflict (branch_id, inventory_item_id) do update set stock = branch_inventory.stock + p_quantity, updated_at = now();

  -- recalcular current_stock
  update public.inventory_items set current_stock = (select coalesce(sum(stock),0) from public.branch_inventory where inventory_item_id = p_product_id)
  where id = p_product_id;

  insert into public.branch_transfers(tenant_id, transfer_code, date, source_branch_id, source_branch_name, destination_branch_id, destination_branch_name, product_id, product_name, product_sku, quantity, unit, authorized_by, notes, status)
  select p_tenant_id, 'TRF-'|| to_char(now(),'YYYY-') || lpad((floor(random()*900+100))::text,3,'0'), to_char(now(),'YYYY-MM-DD HH24:MI'), p_source_branch_id, (select name from public.branches where id=p_source_branch_id), p_destination_branch_id, (select name from public.branches where id=p_destination_branch_id), p_product_id, (select name from public.inventory_items where id=p_product_id), (select sku from public.inventory_items where id=p_product_id), p_quantity, (select unit from public.inventory_items where id=p_product_id), p_authorized_by, p_notes, 'COMPLETED'
  returning id into v_transfer_id;

  return v_transfer_id;
end $$;

-- RLS demo
alter table public.tickets enable row level security;
alter table public.ticket_items enable row level security;
alter table public.expenses enable row level security;
alter table public.branch_transfers enable row level security;
alter table public.active_sessions enable row level security;
do $$ declare t text; begin foreach t in array array['tickets','ticket_items','expenses','branch_transfers','active_sessions'] loop execute format('drop policy if exists "demo_allow_all" on public.%I', t); execute format('create policy "demo_allow_all" on public.%I for all using (true) with check (true)', t); end loop; end $$;
