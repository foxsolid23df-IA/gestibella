# Manual Completo — Gestión de Cuentas y Licencias GestiBella

> **Sistema:** Multi-tenant SaaS (Supabase + Vercel Hobby) · Licencias por tiempo (mensual/anual) · 100% manual · Super-admin solo tú

---

## 1. Conceptos Clave

| Concepto | Qué es | Dónde vive |
|---|---|---|
| **Tenant / Cuenta** | Cada salón cliente (ej. `salon-roma`). Aísla todo: staff, clientes, citas, tickets. | Tabla `tenants` (`id, slug, business_name, plan_tier`) |
| **Plan** | `starter` / `pro` / `elite`. Define límites: ver tabla abajo. | `tenants.plan_tier` + `max_staff/max_branches/max_clients` |
| **Licencia** | Comprobante por tiempo con `code` (ej. `GB-2026-A3F9K1`) y `expires_at`. Cada renovación crea una nueva licencia (histórico). | Tabla `licenses` |
| **Vigencia** | `tenants.current_period_end` = vencimiento vigente. Si `now() > current_period_end` → licencia vencida → solo lectura. | `tenants.current_period_end` |

**Límites confirmados:**
- **Starter:** 3 staff, 1 branch, 150 clients
- **Pro:** 10 staff, 3 branches, ∞ clients
- **Elite:** ∞ staff, ∞ branches, ∞ clients

---

## 2. Dónde se Generan las Licencias

**Único lugar:** `https://TU_DOMINIO.vercel.app/admin`

- Ruta oculta (no indexada, no aparece en menú público).
- Header negro `GESTIBELLA · SUPER-ADMIN` + botón `← Volver al sitio`.
- Protegida: hoy en modo `demo_allow_all` (cualquiera con el link puede verla). En Fase 5 se restringe a tu `auth.users.id` vía `platform_admins` (ver §7).
- **Nunca se generan desde el portal del salón** — solo tú.

---

## 3. Paso a Paso — Crear un Nuevo Salón + Licencia

### Pre-requisito (solo la primera vez)
Ya ejecutaste `005_licenses.sql` en Supabase SQL Editor. Verifica: `tenants` debe tener columnas `max_staff, current_period_end` y `gestibella-demo` con `pro 10/3 active 2027-09-03`.

### Crear cuenta
1. Ve a `/admin`.
2. Click **Crear salón + licencia** (arriba derecha, botón coral).
3. Completa el formulario:
   - `slug` → identificador URL, solo `a-z0-9-` minúsculas, ej. `bella-roma`, `salon-polanco`. Se usará como `?tenant=bella-roma`.
   - `Nombre del salón` → ej. `Bella Roma Studio`.
   - `Email propietario` → opcional, para facturación/contacto.
   - `Plan` → elige `Starter / Pro / Elite` (ver límites).
   - `Duración` → `1 mes` (30 días) o `12 meses` (365 días).
4. Click **Generar licencia y crear cuenta**.
5. Verás toast `✅ Salón creado: bella-roma · Licencia GB-2026-XK3L9P vence 03/10/2026`.
6. La tabla principal ya muestra el nuevo salón con: badge `STARTER/PRO/ELITE`, uso `0/3 staff`, vigencia `03/10/2026 (30d restantes)`, estado `active` verde.

**Qué crea automáticamente:**
- `tenants` con límites del plan + `status=active` + `current_period_end` + `trial_ends_at=+14d`
- `licenses` con `code` único + `expires_at`
- `branches` inicial `MAIN-01` para que el salón tenga al menos 1 sucursal y pueda loguearse.

### Entregar acceso al cliente
- Comparte el link: `https://TU_DOMINIO.vercel.app?tenant=bella-roma`
- Envía también el `code` (ej. por WhatsApp): *“Tu licencia GestiBella Pro: GB-2026-XK3L9P, vence 03/10/2026. Accede con ?tenant=bella-roma”*
- El salón entra con **login fake** (elige su staff). No necesita password.

---

## 4. Renovar una Licencia

En `/admin`, en la fila del salón:
- **+1m** → crea nueva licencia de 30 días y actualiza `current_period_end` a `now()+30d`. Para cobro mensual.
- **+12m** → idem 365 días. Para anual.

Cada click genera un nuevo `code` y deja histórico en la tabla inferior **Últimas licencias**.

---

## 5. Suspender / Reactivar

- Botón `Ban` (icono prohibido):
  - Si está `active` → pasa a `suspended`. El salón verá banner rojo `Licencia vencida` y no podrá `addStaff / addClient / addAppointment / transfer` (guards en `SalonContext` + trigger DB).
  - Si está `suspended` → vuelve a `active`.

Útil para impagos.

---

## 6. Impersonar (Ver como el cliente)

Click icono `Crown` → abre `?tenant=slug` en nueva pestaña. Ves exactamente lo que ve el salón (útil para soporte). No necesitas su password.

---

## 7. Control Ordenado de Cada Cuenta — Qué Ves en `/admin`

**Tabla superior (cuentas):**
- `Salón / Slug` → nombre + `slug` mono + email
- `Plan & Límites` → badge color + `3/10/∞ staff · 1/3/∞ branches`
- `Uso real` → conteos vivos `staff/branches` (ej. `2/3 staff` — si llega a `3/3`, el trigger DB bloqueará el 4º)
- `Vigencia` → fecha + `25d restantes` (verde), `<7d` (ámbar), `Vencida hace 3d` (rojo)
- `Estado` → `active` (verde), `suspended` (rojo), `trialing/past_due` (ámbar)
- `Acciones` → `+1m +12m Ban Crown`

**Tabla inferior (últimas 50 licencias):**
- `Código` (mono, botón `Copy`), `Tenant`, `Plan`, `Vence`, `Estado`. Cada renovación queda auditada con `issued_at`.

---

## 8. Qué Pasa si se Alcanzan los Límites

**DB trigger `enforce_tenant_limits` (005):**
- Intento de 4º staff en Starter → error `Limite del plan starter alcanzado: 3 staff maximo` (rechazado a nivel DB).
- Intento de 2ª branch en Starter → `1 sucursales maximo`.
- Intento de 151º cliente en Starter → bloqueado.

**Frontend guard:**
- `PortalSidebar` → `Multi-Sucursal & Red` aparece bloqueado gris `Solo Pro/Elite` con tooltip si es Starter.
- `PortalHeader` → badge `STARTER · 3 staff · vence 03/10/2026 (20d)` visible siempre.
- `App` → si `isExpired`, banner rojo superior `Licencia vencida — contacta al administrador`.

---

## 9. Flujo Mensual Recomendado (Tú como Super-admin)

1. **Semana 1:** Revisa `/admin` → filtra `Vigencia <7d` → contacta por WhatsApp para renovar.
2. **Cobro manual:** Recibe transferencia/SPEI → en `/admin` click `+1m` o `+12m` → copia `code` → envía comprobante.
3. **Alta nueva:** `Crear salón + licencia` → entrega `?tenant=` + `code`.
4. **Baja/impago:** `Ban` → `suspended` (el salón queda en solo lectura, no pierde datos).

---

## 10. Troubleshooting

| Problema | Solución |
|---|---|
| `/admin` muestra `Modo DEMO local` | Falta `VITE_SUPABASE_URL` o no ejecutaste `005_licenses.sql`. Ejecuta el SQL y recarga. |
| `column tenants.max_staff does not exist` | Re-ejecuta `005_licenses.sql` completo (es `create or replace`). |
| `Límite del plan alcanzado` al añadir staff | Es esperado. Edita en `/admin` → cambia a `Pro` o aumenta `max_staff` directo en Supabase: `update tenants set max_staff=15 where slug='...'` |
| Cliente ve `Licencia vencida` | Renueva con `+1m/+12m`. Verifica `current_period_end` en DB. |
| Quiero añadirme como único super-admin con Auth | `insert into platform_admins (user_id) values ('TU_UUID_de_auth.users');` — ver `docs/AUTH_HARDENING.md`. En modo demo no es necesario. |

---

## 11. Próximos Pasos (Opcional)

- **Auth real Fase 5:** migrar de `login fake` a `Supabase Auth` y restringir `/admin` solo a tu `user_id` (ver `docs/AUTH_HARDENING.md`).
- **Vercel:** Asegura env vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY` en Vercel Dashboard → Redeploy.

---

**Archivo técnico:** `supabase/migrations/005_licenses.sql` · **Panel:** `src/components/admin/AdminPanel.tsx` · **Guards:** `src/context/SalonContext.tsx:211,416` · **Badge:** `src/components/portal/PortalHeader.tsx:57`
