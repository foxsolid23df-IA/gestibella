import React, { useEffect, useState } from 'react';
import { Shield, Plus, RefreshCw, Ban, Copy, Calendar, Building2, Users, Crown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { useTenant } from '../../lib/tenantContext';

interface TenantRow {
  id: string; slug: string; business_name: string; plan_tier: string;
  max_staff: number|null; max_branches: number|null; max_clients: number|null;
  status: string; current_period_end: string|null; trial_ends_at: string|null;
  owner_email: string|null; created_at: string;
  _counts?: { staff:number; branches:number; clients:number };
}

interface LicenseRow {
  id: string; tenant_id: string; code: string; plan_tier: string;
  expires_at: string|null; issued_at: string; status: string; notes: string|null;
}

export const AdminPanel: React.FC = () => {
  const { isDemoMock } = useTenant();
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string|null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ slug:'', business_name:'', owner_email:'', plan_tier:'starter' as 'starter'|'pro'|'elite', duration:'1m' as '1m'|'12m' });

  const load = async () => {
    if (!isSupabaseConfigured || !supabase) { setLoading(false); return; }
    setLoading(true);
    const { data: t } = await supabase.from('tenants').select('id,slug,business_name,plan_tier,max_staff,max_branches,max_clients,status,current_period_end,trial_ends_at,owner_email,created_at').order('created_at', {ascending:false});
    const { data: l } = await supabase.from('licenses').select('id,tenant_id,code,plan_tier,expires_at,issued_at,status,notes').order('issued_at', {ascending:false}).limit(50);
    if (t) {
      // contar uso real por tenant
      const enriched: TenantRow[] = await Promise.all(t.map(async (row:any)=>{
        const [s,b,c] = await Promise.all([
          supabase.from('staff').select('id', {count:'exact', head:true}).eq('tenant_id', row.id),
          supabase.from('branches').select('id', {count:'exact', head:true}).eq('tenant_id', row.id),
          supabase.from('clients').select('id', {count:'exact', head:true}).eq('tenant_id', row.id),
        ]);
        return { ...row, _counts: { staff: s.count||0, branches: b.count||0, clients: c.count||0 } };
      }));
      setTenants(enriched);
    }
    if (l) setLicenses(l as any);
    setLoading(false);
  };
  useEffect(()=>{ load(); }, []);

  const createTenant = async () => {
    if (!form.slug || !form.business_name) { setMsg('Slug y nombre requeridos'); return; }
    if (!supabase) return;
    const limits = form.plan_tier==='starter' ? {max_staff:3,max_branches:1,max_clients:150} : form.plan_tier==='pro' ? {max_staff:10,max_branches:3,max_clients:null} : {max_staff:null,max_branches:null,max_clients:null};
    const expires_at = form.duration==='1m' ? new Date(Date.now()+30*86400000).toISOString() : new Date(Date.now()+365*86400000).toISOString();
    const code = 'GB-'+new Date().getFullYear()+'-'+Math.random().toString(36).substring(2,8).toUpperCase();
    try{
      const { data: tenant, error: tErr } = await supabase.from('tenants').insert({
        slug: form.slug.toLowerCase().trim(), business_name: form.business_name.trim(),
        plan_tier: form.plan_tier, ...limits, status:'active', current_period_end: expires_at, trial_ends_at: new Date(Date.now()+14*86400000).toISOString(), owner_email: form.owner_email||null
      }).select('id').single();
      if (tErr) throw tErr;
      const { error: lErr } = await supabase.from('licenses').insert({
        tenant_id: tenant.id, code, plan_tier: form.plan_tier, max_staff: limits.max_staff, max_branches: limits.max_branches, expires_at, status:'active', notes: `Alta manual ${form.duration}`
      });
      if (lErr) throw lErr;
      // crear branch inicial + staff admin bootstrap para que el salón pueda entrar
      await supabase.from('branches').insert({ tenant_id: tenant.id, code:'MAIN-01', name: form.business_name+' (Principal)', address: '—', manager_name: 'Propietario', status:'ACTIVE', color_tag:'#BE5A38' });
      setMsg(`✅ Salón creado: ${form.slug} · Licencia ${code} vence ${new Date(expires_at).toLocaleDateString()}`);
      setShowCreate(false); setForm({slug:'',business_name:'',owner_email:'',plan_tier:'starter',duration:'1m'}); load();
    }catch(e:any){ setMsg('❌ '+(e.message||String(e))); }
  };

  const renew = async (tenant: TenantRow, duration:'1m'|'12m')=>{
    if (!supabase) return;
    const expires_at = duration==='1m' ? new Date(Date.now()+30*86400000).toISOString() : new Date(Date.now()+365*86400000).toISOString();
    const code = 'GB-'+new Date().getFullYear()+'-'+Math.random().toString(36).substring(2,8).toUpperCase();
    const { error: lErr } = await supabase.from('licenses').insert({ tenant_id: tenant.id, code, plan_tier: tenant.plan_tier, max_staff: tenant.max_staff, max_branches: tenant.max_branches, expires_at, status:'active', notes:`Renovación ${duration}` });
    if (lErr) { setMsg('❌ '+lErr.message); return; }
    await supabase.from('tenants').update({ status:'active', current_period_end: expires_at }).eq('id', tenant.id);
    setMsg(`✅ Licencia renovada ${code} → ${new Date(expires_at).toLocaleDateString()}`); load();
  };
  const toggleStatus = async (tenant: TenantRow)=>{
    if (!supabase) return;
    const next = tenant.status==='active' ? 'suspended' : 'active';
    await supabase.from('tenants').update({ status: next }).eq('id', tenant.id);
    setMsg(`Estado ${tenant.slug}: ${next}`); load();
  };

  if (isDemoMock) return (
    <div className="max-w-3xl mx-auto p-8 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-900">
      <div className="flex items-center gap-2 font-bold"><AlertTriangle className="w-5 h-5"/> Modo DEMO local</div>
      <p className="mt-2">Configura <code>VITE_SUPABASE_URL</code> y ejecuta <code>supabase/migrations/005_licenses.sql</code> en el dashboard para activar el panel. Luego recarga.</p>
    </div>
  );
  if (loading) return <div className="p-8 text-center text-sm text-[#78716C]">Cargando licencias…</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C1917] to-[#44403C] text-white flex items-center justify-center"><Shield className="w-5 h-5"/></div>
          <div>
            <h1 className="font-serif-luxury text-2xl font-bold">Panel Super-Admin — Licencias</h1>
            <p className="text-xs text-[#78716C]">Solo tú. Genera licencias por tiempo (1m/12m), renueva y suspende. Manual 100%.</p>
          </div>
        </div>
        <button onClick={()=>setShowCreate(!showCreate)} className="px-4 py-2.5 bg-[#BE5A38] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#A84E30]"><Plus className="w-4 h-4"/> Crear salón + licencia</button>
      </div>

      {msg && <div className="p-3 rounded-xl border text-xs bg-white border-[#E8DFD8] flex items-center justify-between"><span>{msg}</span><button onClick={()=>setMsg(null)} className="text-[#A8A29E] text-xs">✕</button></div>}

      {showCreate && (
        <div className="bg-white border border-[#E8DFD8] rounded-2xl p-4 grid sm:grid-cols-2 gap-3">
          <input placeholder="slug (ej. salon-roma)" value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} className="bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2.5 text-sm"/>
          <input placeholder="Nombre del salón" value={form.business_name} onChange={e=>setForm({...form, business_name:e.target.value})} className="bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2.5 text-sm"/>
          <input placeholder="Email propietario (opcional)" value={form.owner_email} onChange={e=>setForm({...form, owner_email:e.target.value})} className="bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2.5 text-sm"/>
          <div className="flex gap-2">
            <select value={form.plan_tier} onChange={e=>setForm({...form, plan_tier:e.target.value as any})} className="flex-1 bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2.5 text-sm">
              <option value="starter">Starter — 3 staff / 1 branch / 150 clients</option>
              <option value="pro">Pro — 10 / 3 / ilimitado</option>
              <option value="elite">Elite — ilimitado</option>
            </select>
            <select value={form.duration} onChange={e=>setForm({...form, duration:e.target.value as any})} className="bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2.5 text-sm">
              <option value="1m">1 mes</option>
              <option value="12m">12 meses</option>
            </select>
          </div>
          <button onClick={createTenant} className="sm:col-span-2 py-3 bg-[#1C1917] text-white rounded-xl font-bold text-sm hover:bg-black">Generar licencia y crear cuenta</button>
        </div>
      )}

      <div className="bg-white border border-[#E8DFD8] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] text-[#78716C] font-bold">
              <tr><th className="text-left p-3">Salón / Slug</th><th className="text-left p-3">Plan & Límites</th><th className="text-left p-3">Uso real</th><th className="text-left p-3">Vigencia</th><th className="text-left p-3">Estado</th><th className="text-right p-3">Acciones</th></tr>
            </thead>
            <tbody>
              {tenants.map(t=>{
                const days = t.current_period_end ? Math.ceil((new Date(t.current_period_end).getTime()-Date.now())/86400000) : null;
                const expired = days!==null && days<0;
                return (
                  <tr key={t.id} className="border-t border-[#F0E8E1] hover:bg-[#FFFBF8]">
                    <td className="p-3">
                      <div className="font-bold text-[#1C1917] flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-[#BE5A38]"/>{t.business_name}</div>
                      <div className="font-mono text-[11px] text-[#A8A29E]">{t.slug} · {t.owner_email||'—'}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${t.plan_tier==='elite'?'bg-purple-50 border-purple-200 text-purple-800':t.plan_tier==='pro'?'bg-[#BE5A38]/10 border-[#BE5A38]/20 text-[#8D5B4C]':'bg-stone-100 border-stone-200 text-stone-700'}`}>{t.plan_tier.toUpperCase()}</span>
                      <div className="text-[11px] text-[#78716C] mt-1">{t.max_staff??'∞'} staff · {t.max_branches??'∞'} branches · {t.max_clients??'∞'} clients</div>
                    </td>
                    <td className="p-3 text-[11px]">
                      <div className="flex items-center gap-1"><Users className="w-3 h-3"/>{t._counts?.staff ?? 0}/{t.max_staff??'∞'} staff</div>
                      <div>{t._counts?.branches ?? 0}/{t.max_branches??'∞'} branches</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-[11px]"><Calendar className="w-3 h-3"/>{t.current_period_end ? new Date(t.current_period_end).toLocaleDateString() : '—'}</div>
                      {days!==null && <div className={`text-[11px] font-bold ${expired?'text-rose-600':days<7?'text-amber-600':'text-emerald-700'}`}>{expired ? `Vencida hace ${Math.abs(days)}d` : `${days}d restantes`}</div>}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${t.status==='active' && !expired ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : t.status==='suspended' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                        {t.status==='active' && !expired ? <CheckCircle2 className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3"/>}{t.status}{expired?' · vencida':''}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={()=>renew(t,'1m')} title="Renovar 1 mes" className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E8DFD8] rounded-lg text-[11px] font-bold hover:bg-[#EAE0D6]">+1m</button>
                        <button onClick={()=>renew(t,'12m')} title="Renovar 12 meses" className="px-2.5 py-1.5 bg-[#1C1917] text-white rounded-lg text-[11px] font-bold hover:bg-black">+12m</button>
                        <button onClick={()=>toggleStatus(t)} title={t.status==='active'?'Suspender':'Reactivar'} className={`p-1.5 rounded-lg border ${t.status==='active'?'bg-white border-[#E8DFD8] text-[#78716C] hover:text-rose-600':'bg-amber-50 border-amber-200 text-amber-800'}`}><Ban className="w-3.5 h-3.5"/></button>
                        <a href={`?tenant=${t.slug}`} title="Impersonar" className="p-1.5 bg-white border border-[#E8DFD8] rounded-lg hover:bg-[#FAF7F2]"><Crown className="w-3.5 h-3.5 text-[#BE5A38]"/></a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-[#E8DFD8] rounded-2xl overflow-hidden">
        <div className="p-3 border-b border-[#F0E8E1] font-bold text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-[#BE5A38]"/> Últimas licencias (50)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#FAF7F2] text-[#78716C]"><tr><th className="text-left p-2">Código</th><th className="text-left p-2">Tenant</th><th className="text-left p-2">Plan</th><th className="text-left p-2">Vence</th><th className="text-left p-2">Estado</th><th className="text-right p-2">Copiar</th></tr></thead>
            <tbody>
              {licenses.map(l=>{
                const tenant = tenants.find(t=>t.id===l.tenant_id);
                return (
                  <tr key={l.id} className="border-t border-[#F0E8E1]">
                    <td className="p-2 font-mono font-bold">{l.code}</td>
                    <td className="p-2">{tenant?.slug||l.tenant_id.slice(0,8)}</td>
                    <td className="p-2">{l.plan_tier}</td>
                    <td className="p-2">{l.expires_at ? new Date(l.expires_at).toLocaleDateString() : '—'}</td>
                    <td className="p-2"><span className={`px-2 py-0.5 rounded-full text-[10px] border ${l.status==='active'?'bg-emerald-50 border-emerald-200 text-emerald-800':'bg-stone-100 border-stone-200'}`}>{l.status}</span></td>
                    <td className="p-2 text-right"><button onClick={()=>{navigator.clipboard.writeText(l.code);}} className="p-1.5 bg-[#FAF7F2] border border-[#E8DFD8] rounded-lg"><Copy className="w-3 h-3"/></button></td>
                  </tr>
                );
              })}
              {licenses.length===0 && <tr><td colSpan={6} className="p-4 text-center text-[#A8A29E]">Sin licencias aún — crea el primer salón.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
