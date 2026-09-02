import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, getTenantSlug, resolveTenantId } from './supabaseClient';

interface TenantInfo { id: string; slug: string; business_name: string; }

interface TenantContextType {
  tenantId: string | null;
  tenantSlug: string;
  tenant: TenantInfo | null;
  isLoading: boolean;
  isDemoMock: boolean;
  error: string | null;
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
        const { data } = await supabase.from('tenants').select('id,slug,business_name').eq('id', id).single();
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

  return (
    <TenantContext.Provider value={{ tenantId, tenantSlug, tenant, isLoading, isDemoMock, error }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};
