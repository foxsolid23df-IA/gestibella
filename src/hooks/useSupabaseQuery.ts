import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useTenant } from '../lib/tenantContext';

// Generic hook factory for tenant-scoped tables
export function useTenantTable<T>(table: string, enabled = true) {
  const { tenantId, isDemoMock } = useTenant();
  return useQuery({
    queryKey: [table, tenantId],
    enabled: enabled && !!tenantId && !isDemoMock,
    queryFn: async (): Promise<T[]> => {
      const { data, error } = await supabase.from(table).select('*').eq('tenant_id', tenantId!);
      if (error) throw error;
      return (data as T[]) || [];
    },
  });
}

export function useTenantSingle<T>(table: string, enabled = true) {
  const { tenantId, isDemoMock } = useTenant();
  return useQuery({
    queryKey: [table, 'single', tenantId],
    enabled: enabled && !!tenantId && !isDemoMock,
    queryFn: async (): Promise<T | null> => {
      const { data, error } = await supabase.from(table).select('*').eq('tenant_id', tenantId!).maybeSingle();
      if (error) throw error;
      return (data as T) || null;
    },
  });
}

export function useTenantMutation<T>(table: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  const { tenantId } = useTenant();
  return useMutation({
    mutationFn: async (payload: Partial<T> & Record<string, any>): Promise<T> => {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase no configurado');
      const row = { ...payload, tenant_id: tenantId };
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      return data as T;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [table] });
      onSuccess?.();
    },
  });
}
