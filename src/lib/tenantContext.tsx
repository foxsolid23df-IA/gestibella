import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, getTenantSlug, resolveTenantId } from './supabaseClient';

interface TenantInfo {
  id: string; slug: string; business_name: string;
  plan_tier?: 'starter'|'pro'|'elite'; max_staff?: number|null; max_branches?: number|null; max_clients?: number|null;
  status?: string; trial_ends_at?: string|null; current_period_end?: string|null; owner_email?: string|null;
  is_demo?: boolean;
}

interface TenantContextType {
  tenantId: string | null;
  tenantSlug: string;
  setTenantSlug: (slug: string) => void;
  tenant: TenantInfo | null;
  isLoading: boolean;
  isDemoMock: boolean;
  isDemoEphemeral: boolean;
  error: string | null;
  limits: { maxStaff: number|null; maxBranches: number|null; maxClients: number|null };
  isExpired: boolean;
  daysRemaining: number|null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantSlug, setTenantSlug] = useState(() => getTenantSlug());
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Si hay sesión Auth, priorizar tenant_id del JWT (RLS tenant_isolation) — permite login sin ?tenant
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const resolve = async (overrideSlug?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const { data: { session } } = await supabase.auth.getSession();
        const jwtTenantId = (session?.user as any)?.app_metadata?.tenant_id || (session?.access_token ? (()=>{ try{ const p=JSON.parse(atob(session.access_token.split('.')[1])); return p.tenant_id; }catch{ return null; }})() : null);
        // Si hay JWT con tenant_id, priorizar; si no, usar slug (para demo/anon). overrideSlug permite forzar tras login
        const effectiveSlug = overrideSlug ?? tenantSlug;
        let id: string | null = null;
        if (jwtTenantId) {
          id = jwtTenantId;
        } else {
          id = await resolveTenantId(effectiveSlug);
        }
        if (cancelled) return;
        if (!id) {
          setError(`Tenant no encontrado: ${effectiveSlug}. Verifica VITE_DEMO_TENANT_SLUG y seed.sql`);
          setIsLoading(false);
          return;
        }
        let data: any = null;
        const { data: full, error: fullErr } = await supabase.from('tenants').select('id,slug,business_name,plan_tier,max_staff,max_branches,max_clients,status,trial_ends_at,current_period_end,owner_email,is_demo').eq('id', id).maybeSingle();
        if (!fullErr && full) data = full;
        else {
          const { data: base } = await supabase.from('tenants').select('id,slug,business_name').eq('id', id).maybeSingle();
          data = base ? { ...base, plan_tier: 'pro', max_staff: 10, max_branches: 3, max_clients: null, status: 'active', is_demo: (base as any).slug === 'gestibella-demo' } : null;
        }
        if (!cancelled && data) {
          setTenantId(data.id);
          setTenant(data as TenantInfo);
          if (data.slug !== tenantSlug) {
            // Sincronizar slug sin exponer ?tenant en URL para cliente (solo super-admin usa atajo oculto)
            localStorage.setItem('gestibella_tenant_slug', data.slug);
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    resolve();
    // Re-resolver al cambiar sesión (login/logout) — ahora sí reacciona y deriva tenant del JWT sin ?tenant
    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      const jwtTenantId = (_session as any)?.user?.app_metadata?.tenant_id || (()=>{ try{ const p=JSON.parse(atob((_session as any)?.access_token?.split('.')[1] || '')); return p?.tenant_id; }catch{ return null; }})();
      if (jwtTenantId) resolve();
      else if (_event === 'SIGNED_OUT') {
        // Al salir, volver a demo
        const demoSlug = getTenantSlug();
        setTenantSlug(demoSlug);
      }
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [tenantSlug]);

  const isDemoMock = !isSupabaseConfigured;
  const isDemoEphemeral = !!tenant?.is_demo;
  const limits = {
    maxStaff: tenant?.max_staff ?? (tenant?.plan_tier === 'starter' ? 3 : tenant?.plan_tier === 'pro' ? 10 : null),
    maxBranches: tenant?.max_branches ?? (tenant?.plan_tier === 'starter' ? 1 : tenant?.plan_tier === 'pro' ? 3 : null),
    maxClients: tenant?.max_clients ?? (tenant?.plan_tier === 'starter' ? 150 : null),
  };
  const daysRemaining = tenant?.current_period_end ? Math.ceil((new Date(tenant.current_period_end).getTime() - Date.now()) / 86400000) : null;
  const isExpired = !!(tenant?.current_period_end && new Date(tenant.current_period_end).getTime() < Date.now() && tenant?.status !== 'active');

  return (
    <TenantContext.Provider value={{ tenantId, tenantSlug, setTenantSlug, tenant, isLoading, isDemoMock, isDemoEphemeral, error, limits, isExpired, daysRemaining }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};
