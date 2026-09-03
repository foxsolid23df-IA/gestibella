import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const viteUrl = process.env.VITE_SUPABASE_URL || null;
  const viteAnon = process.env.VITE_SUPABASE_ANON_KEY || null;
  const gemini = process.env.GEMINI_API_KEY || null;
  const demoSlug = process.env.VITE_DEMO_TENANT_SLUG || null;
  // No exponer keys completas en prod, solo preview mascarado
  const mask = (v: string | null) => v ? v.slice(0, 20) + '...' + ` (${v.length} chars)` : null;
  res.json({
    buildTime: new Date().toISOString(),
    env: {
      VITE_SUPABASE_URL: viteUrl ? viteUrl.slice(0, 45) + '...' : null,
      VITE_SUPABASE_ANON_KEY: mask(viteAnon),
      VITE_DEMO_TENANT_SLUG: demoSlug,
      GEMINI_API_KEY: gemini ? 'set (' + gemini.length + ' chars, prefix ' + gemini.slice(0, 3) + ')' : null,
    },
    rawPresence: {
      has_VITE_SUPABASE_URL: !!viteUrl,
      has_VITE_SUPABASE_ANON_KEY: !!viteAnon,
      has_GEMINI: !!gemini,
    },
    hint: !viteUrl ? 'VITE_SUPABASE_URL VACÍA en runtime de Vercel Functions. Revisa Vercel Env Scopes: debe estar en Production, no solo Preview. Haz Redeploy SIN cache.' : 'OK en Functions, pero Vite build necesita redeploy con env en Production para inlinear en cliente.',
  });
}
