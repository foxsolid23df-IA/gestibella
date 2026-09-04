-- 011_demo_anon_access.sql — Permite a anon resolver solo gestibella-demo para mostrar botón Demo, manteniendo demo 100% memoria
-- Sin esto, anon no puede resolver tenant y LoginModal queda sin isDemoEphemeral => botón desaparece (imagen incógnito)

-- Permitir a anon leer solo el tenant demo (is_demo=true) para resolver slug -> isDemoEphemeral
drop policy if exists "tenants_demo_public_read" on public.tenants;
create policy "tenants_demo_public_read" on public.tenants
  for select using (is_demo = true);

-- Asegurar que get_my_tenant siga solo para authenticated (ya en 008/009)
-- No tocar staff RLS; demo 100% memoria usa isSupabaseEnabled=false, no necesita leer staff demo desde DB para anon
