import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, getTenantSlug, resolveTenantId } from './supabaseClient';

interface TenantInfo {
  id: string; slug: string; business_name: string;
  plan_tier?: 'starter'|'pro'|'elite'; max_staff?: number|null; max_branches?: number|null; max_clients?: number|null;
  status?: string; trial_ends_at?: string|null; current_period_end?: string|null; owner_email?: string|null;
}

interface TenantContextType {
  tenantId: string | null;
  tenantSlug: string;
  tenant: TenantInfo | null;
  isLoading: boolean;
  isDemoMock: boolean;
  error: string | null;
  limits: { maxStaff: number|null; maxBranches: number|null; maxClients: number|null };
  isExpired: boolean;
  daysRemaining: number|null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantSlug] = useState(() => getTenantSlug());
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const id = await resolveTenantId(tenantSlug);
        if (cancelled) return;
        if (!id) {
          setError(`Tenant no encontrado: ${tenantSlug}. Verifica VITE_DEMO_TENANT_SLUG y seed.sql`);
          setIsLoading(false);
          return;
        }
        // Intenta leer cols nuevas (005), fallback a cols base si aún no migrado
        let data: any = null;
        const { data: full, error: fullErr } = await supabase.from('tenants').select('id,slug,business_name,plan_tier,max_staff,max_branches,max_clients,status,trial_ends_at,current_period_end,owner_email').eq('id', id).single();
        if (!fullErr && full) data = full;
        else {
          const { data: base } = await supabase.from('tenants').select('id,slug,business_name').eq('id', id).single();
          data = base ? { ...base, plan_tier: 'pro', max_staff: 10, max_branches: 3, max_clients: null, status: 'active' } : null;
        }
        if (!cancelled && data) {
          setTenantId(data.id);
          setTenant(data as TenantInfo);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tenantSlug]);

  const isDemoMock = !isSupabaseConfigured;
  const limits = {
    maxStaff: tenant?.max_staff ?? (tenant?.plan_tier === 'starter' ? 3 : tenant?.plan_tier === 'pro' ? 10 : null),
    maxBranches: tenant?.max_branches ?? (tenant?.plan_tier === 'starter' ? 1 : tenant?.plan_tier === 'pro' ? 3 : null),
    maxClients: tenant?.max_clients ?? (tenant?.plan_tier === 'starter' ? 150 : null),
  };
  const daysRemaining = tenant?.current_period_end ? Math.ceil((new Date(tenant.current_period_end).getTime() - Date.now()) / 86400000) : null;
  const isExpired = !!(tenant?.current_period_end && new Date(tenant.current_period_end).getTime() < Date.now() && tenant?.status !== 'active');

  return (
    <TenantContext.Provider value={{ tenantId, tenantSlug, tenant, isLoading, isDemoMock, error, limits, isExpired, daysRemaining }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};
