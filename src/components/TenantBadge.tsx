import React from 'react';
import { Database, WifiOff } from 'lucide-react';
import { useTenant } from '../lib/tenantContext';

export const TenantBadge: React.FC = () => {
  const { tenantSlug, tenant, isDemoMock, isLoading, error } = useTenant();
  if (isLoading) return <span className="text-[10px] text-[#A8A29E]">Cargando tenant...</span>;
  if (error) return <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-1 rounded-full border border-rose-200">{error}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${isDemoMock ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
      {isDemoMock ? <WifiOff className="w-3 h-3" /> : <Database className="w-3 h-3" />}
      {tenant?.business_name || tenantSlug} · {isDemoMock ? 'DEMO LOCAL' : 'Supabase'}
    </span>
  );
};
