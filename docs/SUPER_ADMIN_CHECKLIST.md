# Super-Admin Checklist — foxsolid23df@gmail.com

**UID:** `f3edec74-d99e-40af-8ae0-f1b05231573f`  
**Estado:** ✅ Insertado en `platform_admins` (201) el 2026-09-03T06:20:36Z  
**Staff vinculado:** Valentina Rossi (ADMIN, `00000000-...-0101`) → `auth_user_id` vinculado

## Verificado automático
- `platform_admins` → 1 fila `is_super_admin=true`
- `staff` → Valentina Rossi vinculada a tu UID

## Pendiente manual (1 toggle en Supabase Dashboard)
1. Ve a **Supabase → Authentication → Hooks → Custom Access Token Hook**
2. Activa **Enabled** → selecciona `public.custom_access_token_hook` (creado en `006_auth_hardening.sql`) → Save
3. Sin esto, el JWT no lleva `tenant_id`; el RLS `tenant_isolation` no filtrará por tenant (seguirá funcionando en modo demo fallback).

## Prueba final
- Cierra sesión y vuelve a iniciar en `https://TU_DOMINIO.vercel.app` con `foxsolid23df@gmail.com` / tu password
- Abre `/admin` → debe mostrar tabla `gestibella-demo Pro 10/3` sin cartel DEMO
- Abre `/admin` sin sesión (incógnito) → debe mostrar "Acceso restringido — Solo super-admin"
- Intenta `curl -H "apikey: sb_publishable..." /rest/v1/clients` sin JWT → debe dar 0 rows tras activar RLS (antes daba todos)

## Notas
- Vercel env ya corregidas a `Config` (no Secret) para `VITE_*` → redeploy `22b49a5` Ready
- Si cambias de staff, actualiza: `update staff set auth_user_id = 'PUID' where email = 'otro@...'`
