# Licencias GestiBella — Manual 100% Manual (Super-admin solo tú)

## Dónde generar licencias
Abre `https://tu-dominio.vercel.app/admin` (ruta oculta, no indexada). Solo tú tienes acceso (tabla `platform_admins`).

Si ves `Modo DEMO local`, ejecuta primero en Supabase SQL Editor:
`supabase/migrations/005_licenses.sql`

## Crear un nuevo salón + licencia
1. `/admin` → `Crear salón + licencia`
2. Completa: `slug` (ej. `salon-roma`, solo `a-z0-9-`), `Nombre`, `Email propietario`, `Plan` (Starter/Pro/Elite), `Duración` (1 mes / 12 meses).
3. Click `Generar licencia y crear cuenta` → se crea:
   - `tenants` con `max_staff/max_branches/max_clients` según plan (Starter 3/1/150, Pro 10/3/∞, Elite ∞)
   - `licenses` con `code GB-YYYY-XXXX` y `expires_at`
   - `branches` inicial `MAIN-01`
4. Copia el `code` y envíalo por WhatsApp/email. El salón entra con `?tenant=salon-roma` y login fake del primer ADMIN.

## Renovar / Suspender
- En la tabla de salones: `+1m` renueva 30 días, `+12m` 365 días (crea nueva licencia y actualiza `current_period_end`).
- `Ban` → suspende (`suspended`), bloquea `addStaff/addClient/addAppointment` (guards en `SalonContext` + trigger DB).
- `Crown` → impersonar (abre `?tenant=slug`).

## Límites
- Trigger DB `enforce_tenant_limits` (`005_licenses.sql:38`) rechaza `insert staff/branches/clients` si excede `max_*`.
- Frontend guards: `addStaffMember` (`SalonContext.tsx:211`), `addClient` (`:416`), `MultiBranchModule` (sidebar bloqueado si Starter), badge en `PortalHeader` muestra `Pro · 10 staff · vence 12/09/2027 (25d)`.

## Vigencia
- `current_period_end` es la fecha de vencimiento vigente. Banner rojo en `App.tsx` si vencida.
- `licenses` es histórico: cada renovación crea nueva fila, nunca borra.

## Añadirte como super-admin
```sql
insert into platform_admins (user_id) values ('TU_AUTH_USERS_ID');
-- Si usas login fake (sin Supabase Auth), el panel está en modo demo_allow_all y no necesita este paso.
```

## Troubleshooting
- `column tenants.max_staff does not exist` → ejecuta `005_licenses.sql` de nuevo.
- `Límite del plan alcanzado` → edita `tenants.max_staff` directamente o renueva con plan superior.
