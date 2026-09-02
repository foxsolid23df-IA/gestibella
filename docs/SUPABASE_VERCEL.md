# Supabase + Vercel Hobby — Guía operativa

## Supabase Cloud Setup (5 min)
1. https://supabase.com → New project → Region `South America (São Paulo)` o `US East` (cercana a Vercel `iad1`).
2. SQL Editor → pega en orden:
   - `supabase/migrations/001_core_tenants_branches_staff.sql`
   - `supabase/migrations/002_services_inventory_clients.sql`
   - `supabase/migrations/003_appointments_waitlist_upsell.sql`
   - `supabase/migrations/004_tickets_expenses_transfers.sql`
   - `supabase/seed.sql`
3. Settings → API → copia `Project URL` y `anon public` key.

## Env locales
`.env.local` (no commitear):
```
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_DEMO_TENANT_SLUG=gestibella-demo
GEMINI_API_KEY=AIza...
```

## Vercel Hobby Deploy
```bash
npm i -g vercel
vercel link
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_DEMO_TENANT_SLUG
vercel env add GEMINI_API_KEY
vercel --prod
```
Verifica: `https://tu-app.vercel.app?tenant=gestibella-demo` → badge debe decir `Supabase` (no `DEMO LOCAL`).

## Troubleshooting
- Badge `DEMO LOCAL` → `VITE_SUPABASE_URL` no inyectada (revisa Vercel env + redeploy).
- `Tenant no encontrado` → ejecuta `seed.sql` o verifica `VITE_DEMO_TENANT_SLUG`.
- `transfer_product` 500 → verifica que `branch_inventory` tenga filas seed (migration 004 RPC requiere stock previo).
- `GEMINI_API_KEY no configurada` → es server-only, no debe tener prefijo `VITE_`.

## Costos Hobby
- Vercel Hobby: $0, 10s function, 100GB bw. Suficiente para GestiBella demo.
- Supabase Free: 500MB DB, 2 proyectos, pausado tras 7d inactividad (usar `pg_cron` keepalive si necesitas 24/7).
