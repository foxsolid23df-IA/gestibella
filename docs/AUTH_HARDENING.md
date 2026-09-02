# Fase 5 — Hardening Auth Real (cuando salir de demo fake)

## Objetivo
Reemplazar login fake (`loginAs` en `SalonContext.tsx:205`) por Supabase Auth con RLS estricta por `tenant_id`.

## Paso 1 — Habilitar Auth en Supabase
- Dashboard → Auth → Enable email/password + magic link opcional.
- Crear usuarios y vincular a `staff` via `staff.auth_user_id uuid references auth.users(id)`.

## Paso 2 — RLS estricta
Reemplazar policies demo:
```sql
drop policy "demo_allow_all" on public.staff;
create policy "tenant_isolation" on public.staff
  for all using (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
  with check (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
-- repetir para todas las tablas
-- Añadir claim tenant_id al JWT via Supabase Auth Hook o trigger en auth.users
```

Hook para inyectar tenant_id en JWT:
```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql as $$
declare claims jsonb; tenant uuid;
begin
  select tenant_id into tenant from public.staff where auth_user_id = (event->>'user_id')::uuid limit 1;
  claims := event->'claims';
  if tenant is not null then
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(tenant::text));
  end if;
  return jsonb_set(event, '{claims}', claims);
end $$;
```

## Paso 3 — Frontend
- `supabaseClient.ts`: `auth: { persistSession: true, autoRefreshToken: true }`, `supabase.auth.onAuthStateChange`.
- `TenantContext`: ya no usa `resolveTenantId` por slug, sino `auth.jwt().tenant_id`.
- `LoginModal.tsx`: `supabase.auth.signInWithPassword({email,password})` → `loginAs` lee `staff` por `auth_user_id`.
- `PortalHeader.tsx`: logout → `supabase.auth.signOut()`.

## Paso 4 — Vercel Hobby límites
- Hobby soporta Supabase Auth sin cambios.
- Si necesitas `pg_cron` para recordatorios 24h/waitlist, usa Supabase `pg_cron` extension (no Vercel Cron que es Pro).

## Checklist
- [ ] Migrar `active_sessions` a `auth.sessions` nativo o tabla propia con `auth_user_id`.
- [ ] Rotar `anon key` y revocar demo policies.
- [ ] Test RLS con `EXPLAIN` y usuario no-tenant (debe ver 0 rows).
