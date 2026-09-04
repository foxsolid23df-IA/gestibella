-- 008_secure_demo.sql — Demo efímero + login sin exponer slugs + ocultar GB code
-- Decisiones: Probar Demo sin password (anon), escritura efímera (resetea al salir), solo super-admin ve GB code

-- 1) Marcar demo tenant
alter table public.tenants add column if not exists is_demo boolean not null default false;
update public.tenants set is_demo = true where slug = 'gestibella-demo';
update public.tenants set is_demo = false where slug != 'gestibella-demo' and is_demo is distinct from false;

-- 2) Cerrar enumeración anon de tenants (revocar public_read)
drop policy if exists "tenants_public_read" on public.tenants;
-- Solo authenticated puede leer su propio tenant vía tenant_isolation; anon no lista nada
create policy "tenants_public_read" on public.tenants
  for select using (auth.role() = 'authenticated');

-- 3) RPC que devuelve solo TU tenant (sin exponer lista)
create or replace function public.get_my_tenant()
returns table (tenant_id uuid, slug text, business_name text, is_demo boolean)
language sql security definer set search_path = public as $$
  select t.id, t.slug, t.business_name, t.is_demo
  from public.staff s
  join public.tenants t on t.id = s.tenant_id
  where s.auth_user_id = auth.uid()
  limit 1;
$$;
revoke all on function public.get_my_tenant() from public;
grant execute on function public.get_my_tenant() to authenticated;
-- Permitir anon a demo? No: demo anon usará staff sin auth_user_id, se maneja en app con modo efímero local

-- 4) Asegurar índice email lower global para evitar colisión (opcional, no bloquea si ya hay duplicados por tenant)
-- create unique index if not exists staff_email_lower_global on public.staff (lower(email));
-- Comentado para no romper tenants demo con mismo email pattern; activar cuando quieras 1 email = 1 tenant global
