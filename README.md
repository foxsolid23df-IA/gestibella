# GestiBella — SaaS Multi-tenant para Salones & Spa
> Stack: React 19 + Vite 6 + Tailwind 4 + Supabase (Postgres + RLS) + Vercel Hobby

## Arquitectura
- **Frontend:** SPA Vite (`src/`), estado via `SalonContext.tsx` + `TanStack Query`, multi-tenant por `?tenant=slug`
- **Backend:** Supabase PostgREST + RPC `transfer_product` (transaccional), Storage `salon-assets`
- **Auth (demo):** Login fake `loginAs()` sin Supabase Auth. RLS en modo `demo allow all`. Fase 5 → Auth real.
- **Deploy:** Vercel Hobby (`vercel.json` rewrites SPA + `api/gemini.ts` proxy GEMINI_API_KEY, 10s timeout)

## Quick Start
```bash
npm install
cp .env.example .env.local  # completa VITE_SUPABASE_URL / ANON_KEY / GEMINI_API_KEY
npm run dev                 # http://localhost:3000  |  http://localhost:3000?tenant=gestibella-demo
npm run build && npm run preview
```

## Supabase (local o cloud)
```bash
# Local (requiere Docker + supabase CLI)
supabase link --project-ref YOUR_REF
supabase db push            # aplica supabase/migrations/*.sql
psql $DATABASE_URL -f supabase/seed.sql   # o supabase db reset
npm run db:types             # genera src/types/supabase.ts

# Cloud: crea proyecto en supabase.com (region sa-east-1 recomendado para Vercel),
# copia URL + anon key a .env.local y Vercel env, luego ejecuta migrations via SQL Editor
```

## Vercel Hobby Deploy
1. `vercel link` y `vercel --prod`
2. Vercel Dashboard → Settings → Environment Variables:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DEMO_TENANT_SLUG=gestibella-demo`
   - `GEMINI_API_KEY` (solo server, sin VITE_)
3. Redeploy. SPA rewrites ya en `vercel.json`.

## Migración Dura (sin localStorage)
- Todo `localStorage` eliminado de `SalonContext.tsx`. Estado es efímero + hidratación desde Supabase si `VITE_SUPABASE_URL` configurado.
- Sin Supabase → funciona en modo DEMO local con `initialData.ts` (ideal para preview sin DB).
- Con Supabase → lee `tenants/staff/branches/clients/...` al boot (`useTenant` + `useEffect` hydrate) y persiste mutaciones via `sbInsert/sbUpdate/sbRpcTransfer`.

## Multi-tenant
- Tenant por slug: `?tenant=gestibella-demo` → guarda en `localStorage gestibella_tenant_slug` → `resolveTenantId()` en `supabaseClient.ts`.
- Añadir tenant: `insert into tenants (slug, business_name) values ('nuevo-salon','Nuevo Salón');` + seed branches/staff ligados a ese `tenant_id`.

## Fase 5 — Hardening Auth Real (pendiente)
Ver `docs/AUTH_HARDENING.md`.

