import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Demo mode: si no hay credenciales, trabajamos en modo mock (no rompe build)
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : (null as unknown as ReturnType<typeof createClient>);

/**
 * Resuelve tenant_id activo.
 * Prioridad: ?tenant=slug > localStorage tenant_slug > VITE_DEMO_TENANT_SLUG > gestibella-demo
 */
export function getTenantSlug(): string {
  if (typeof window === 'undefined') return import.meta.env.VITE_DEMO_TENANT_SLUG || 'gestibella-demo';
  const params = new URLSearchParams(window.location.search);
  const q = params.get('tenant');
  if (q) {
    localStorage.setItem('gestibella_tenant_slug', q);
    return q;
  }
  return localStorage.getItem('gestibella_tenant_slug') || import.meta.env.VITE_DEMO_TENANT_SLUG || 'gestibella-demo';
}

export async function resolveTenantId(slug?: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const s = slug || getTenantSlug();
  const { data, error } = await supabase.from('tenants').select('id').eq('slug', s).maybeSingle();
  if (error || !data) return null;
  return data.id;
}
