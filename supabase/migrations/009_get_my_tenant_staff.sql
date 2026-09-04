-- 009_get_my_tenant_staff.sql — Extiende get_my_tenant para devolver staff_id y evitar segunda query bloqueada por RLS sin hook
drop function if exists public.get_my_tenant();
create or replace function public.get_my_tenant()
returns table (tenant_id uuid, slug text, business_name text, is_demo boolean, staff_id uuid)
language sql security definer set search_path = public as $$
  select t.id, t.slug, t.business_name, coalesce(t.is_demo,false), s.id
  from public.staff s
  join public.tenants t on t.id = s.tenant_id
  where s.auth_user_id = auth.uid()
  limit 1;
$$;
revoke all on function public.get_my_tenant() from public;
grant execute on function public.get_my_tenant() to authenticated;
