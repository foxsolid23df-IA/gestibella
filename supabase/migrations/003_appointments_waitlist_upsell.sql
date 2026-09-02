-- 003_appointments_waitlist_upsell.sql
do $$ begin create type appointment_status as enum ('CONFIRMED','IN_WAITING','IN_CHAIR','COMPLETED','CANCELLED'); exception when duplicate_object then null; end $$;
do $$ begin create type waitlist_status as enum ('WAITING','NOTIFIED','BOOKED','EXPIRED'); exception when duplicate_object then null; end $$;
do $$ begin create type deposit_method as enum ('TRANSFERENCIA','TARJETA_CREDITO','STRIPE_LINK','EFECTIVO'); exception when duplicate_object then null; end $$;

-- Upsell items
create table if not exists public.upsell_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  category text not null,
  price numeric(10,2) not null,
  duration_minutes int not null,
  description text,
  recommended_for_category text[] not null default '{}',
  popular_prompt text,
  created_at timestamptz not null default now()
);

-- AntiNoShow settings (1 row por tenant)
create table if not exists public.anti_noshow_settings (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  deposits_enabled boolean not null default true,
  deposit_percentage int not null default 30,
  minimum_service_price_for_deposit numeric(10,2) not null default 1000,
  deposit_required_categories text[] not null default array['Colorimetría','Cabello','Faciales','Spa & Masajes'],
  ics_calendar_attachment_enabled boolean not null default true,
  reminder_upsell_enabled boolean not null default true,
  automated_waitlist_trigger_enabled boolean not null default true,
  reminder_notice_hours int not null default 24,
  updated_at timestamptz not null default now()
);

-- Receipt config (1 row por tenant)
create table if not exists public.receipt_config (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  salon_name text not null default 'GestiBella Salon & Spa',
  salon_slogan text,
  address text,
  phone text,
  tax_id text,
  logo_url text,
  printer_name text,
  printer_connection text not null default 'USB',
  paper_width text not null default '80mm',
  font_size text not null default 'xs',
  accent_color text,
  show_logo boolean not null default true,
  show_tax_id boolean not null default true,
  show_staff_name boolean not null default true,
  show_client_name boolean not null default true,
  show_chair_number boolean not null default true,
  show_loyalty_points boolean not null default true,
  show_barcode boolean not null default true,
  custom_footer_message text,
  auto_cutter boolean not null default true,
  spacing text not null default 'normal',
  updated_at timestamptz not null default now()
);

-- Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  client_phone text,
  staff_id uuid not null references public.staff(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  service_name text not null,
  date date not null,
  time text not null,
  duration_minutes int not null,
  price numeric(10,2) not null,
  status appointment_status not null default 'CONFIRMED',
  notes text,
  ticket_id uuid,
  notification_sent boolean not null default false,
  deposit_required boolean not null default false,
  deposit_amount numeric(10,2),
  deposit_paid boolean not null default false,
  deposit_paid_at text,
  deposit_payment_method deposit_method,
  suggested_upsell_id uuid references public.upsell_items(id) on delete set null,
  upsell_accepted boolean not null default false,
  upsell_item_name text,
  upsell_item_price numeric(10,2),
  created_at timestamptz not null default now()
);
create index if not exists appt_tenant_date_idx on public.appointments(tenant_id, date);
create index if not exists appt_staff_idx on public.appointments(staff_id);

-- Waitlist
create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  client_id uuid references public.clients(id) on delete set null,
  service_id uuid not null references public.services(id) on delete restrict,
  service_name text not null,
  preferred_staff_id text not null default 'ANY',
  preferred_date date not null,
  preferred_time_range text not null,
  status waitlist_status not null default 'WAITING',
  notes text,
  created_at timestamptz not null default now(),
  last_notified_at text,
  notification_history jsonb not null default '[]'
);
create index if not exists waitlist_tenant_idx on public.waitlist_entries(tenant_id);

-- RLS demo
alter table public.upsell_items enable row level security;
alter table public.anti_noshow_settings enable row level security;
alter table public.receipt_config enable row level security;
alter table public.appointments enable row level security;
alter table public.waitlist_entries enable row level security;
do $$ declare t text; begin foreach t in array array['upsell_items','anti_noshow_settings','receipt_config','appointments','waitlist_entries'] loop execute format('drop policy if exists "demo_allow_all" on public.%I', t); execute format('create policy "demo_allow_all" on public.%I for all using (true) with check (true)', t); end loop; end $$;
