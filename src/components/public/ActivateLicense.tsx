import React, { useState } from 'react';
import { KeyRound, Mail, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const ActivateLicense: React.FC = () => {
  // Esta ruta es solo para soporte interno; el cliente normal no ve el GB code.
  // El flujo principal es: admin crea tenant + staff owner → cliente recibe email + ?tenant=SLUG y entra directo con su password.
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string|null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) { setMsg('Supabase no configurado'); return; }
    if (!code || !email || !password) { setMsg('Completa código, email y contraseña'); return; }
    setLoading(true); setMsg(null);
    try {
      // 1) Validar código existe y no vencido
      const { data: lic, error: lErr } = await supabase.from('licenses').select('id,tenant_id,code,plan_tier,expires_at,status').eq('code', code.trim().toUpperCase()).maybeSingle();
      if (lErr) throw lErr;
      if (!lic) throw new Error('Código no encontrado. Verifica GB-2026-XXXX');
      if (lic.status !== 'active') throw new Error('Código no activo (revocado/expirado)');
      if (lic.expires_at && new Date(lic.expires_at).getTime() < Date.now()) throw new Error('Código vencido');

      // 2) Buscar tenant
      const { data: tenant } = await supabase.from('tenants').select('id,slug,business_name').eq('id', lic.tenant_id).single();
      if (!tenant) throw new Error('Tenant no encontrado para este código');

      // 3) Intentar crear usuario Auth (si ya existe, intentar login)
      let userId: string | null = null;
      const { data: signUp, error: sErr } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password });
      if (signUp.user) {
        userId = signUp.user.id;
      } else if (sErr && sErr.message.includes('already registered')) {
        const { data: signIn, error: iErr } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (iErr) throw new Error('Email ya registrado. Usa su contraseña correcta o recupera acceso. Detalle: ' + iErr.message);
        userId = signIn.user!.id;
      } else if (sErr) {
        throw sErr;
      }

      if (!userId) throw new Error('No se pudo crear/recuperar usuario');

      // 4) Vincular staff existente o crear uno nuevo para este tenant
      const { data: existingStaff } = await supabase.from('staff').select('id,auth_user_id').eq('tenant_id', tenant.id).eq('email', email.trim().toLowerCase()).maybeSingle();
      if (existingStaff) {
        if (!existingStaff.auth_user_id) {
          await supabase.from('staff').update({ auth_user_id: userId }).eq('id', existingStaff.id);
        }
      } else {
        await supabase.from('staff').insert({
          tenant_id: tenant.id,
          name: email.split('@')[0],
          email: email.trim().toLowerCase(),
          role: 'ADMIN',
          role_title: 'Propietario & Administrador',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
          is_active: true,
          auth_user_id: userId,
          permissions: {canAccessPOS:true, canAccessFinances:true, canAccessInventory:true, canAccessReports:true, canManageStaff:true}
        });
      }

      setOk(true);
      setMsg(`✅ Licencia ${code} activada para ${tenant.business_name} (${tenant.slug}). Ya puedes ingresar en ?tenant=${tenant.slug} → Acceso al Software con ${email}`);
    } catch (err: any) {
      setMsg('❌ ' + (err.message || String(err)));
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="bg-white border border-[#E8DFD8] rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-white flex items-center justify-center mx-auto"><KeyRound className="w-6 h-6"/></div>
          <h1 className="font-serif-luxury text-2xl font-bold">Activar Licencia</h1>
          <p className="text-xs text-[#78716C]">Ingresa el código <b>GB-2026-XXXX</b> que te entregó el administrador, tu email y crea tu contraseña para acceder a tu portal.</p>
        </div>
        <form onSubmit={handleActivate} className="space-y-3">
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]"/>
            <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="GB-2026-XXXX" className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-10 pr-3 py-2.5 text-sm font-mono tracking-widest" required />
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]"/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-10 pr-3 py-2.5 text-sm" required />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Crea tu contraseña (mín. 6)" className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-10 pr-3 py-2.5 text-sm" required minLength={6} />
          </div>
          {msg && <div className={`p-3 rounded-xl text-xs border flex items-center gap-2 ${ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>{ok ? <CheckCircle2 className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}<span>{msg}</span></div>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-[#1C1917] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? 'Activando...' : 'Activar y Crear Acceso'} <ArrowRight className="w-4 h-4"/>
          </button>
        </form>
        <div className="mt-6 pt-4 border-t border-[#F0E8E1] space-y-2 text-[11px] text-[#78716C]">
          <p><b>¿Dónde ingresar después?</b> Ve a <code>https://gestibella.vercel.app?tenant=TU-SLUG</code> → botón <b>Acceso al Software</b> → entra con tu <b>email y contraseña</b>.</p>
          <p className="bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl p-2">Flujo recomendado: el super-admin te crea la cuenta y te envía <b>email + link ?tenant=</b> por WhatsApp. No necesitas el código GB.</p>
        </div>
      </div>
    </div>
  );
};
