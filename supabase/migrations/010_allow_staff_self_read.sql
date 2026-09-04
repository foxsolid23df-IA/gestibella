-- 010_allow_staff_self_read.sql — Permite a cada usuario leer su propia fila staff sin depender del JWT tenant_id
-- Necesario para login sin ?tenant cuando el hook aún no ha inyectado tenant_id

-- Política adicional: cada usuario autenticado puede leer su propia fila staff via auth_user_id
drop policy if exists "staff_self_read" on public.staff;
create policy "staff_self_read" on public.staff
  for select using (auth.uid() = auth_user_id);

-- También permitir que get_my_tenant siga funcionando (ya es security definer, no necesita RLS)
-- Asegurar que tenants_public_read siga solo para authenticated (ya en 008)
