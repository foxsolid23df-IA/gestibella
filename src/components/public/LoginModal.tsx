import React, { useState } from 'react';
import {
  Lock,
  X,
  User,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { useTenant } from '../../lib/tenantContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    staffList,
    loginAs,
    addToast
  } = useSalon();
  const { isDemoEphemeral, setTenantSlug } = useTenant();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleDemoEnter = () => {
    // Demo efímero sin password: siempre entra como Valentina en gestibella-demo
    if (!isDemoEphemeral) {
      localStorage.setItem('gestibella_tenant_slug', 'gestibella-demo');
      window.location.href = window.location.pathname + '?tenant=gestibella-demo';
      return;
    }
    const demoStaff = staffList.find((s) => s.email.toLowerCase() === 'valentina@gestibella.com') || staffList.find((s) => s.role === 'ADMIN') || staffList[0];
    if (demoStaff) {
      loginAs(demoStaff.id);
      addToast('success', 'Demo iniciado', 'Estás en modo demo efímero — lo que crees se borrará al salir.');
    } else {
      addToast('error', 'Demo no disponible', 'No se encontró staff demo.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('error', 'Campos Incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    // Solo el botón "Probar Demo sin contraseña" entra sin validar; el form principal siempre valida
    if (isSupabaseConfigured && supabase) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) throw new Error('Credenciales inválidas');
        if (!data.user) throw new Error('Credenciales inválidas');
        // Derivar tenant y staff vía RPC (no expone lista, funciona sin hook y sin segunda query bloqueada)
        const { data: rpcData, error: rpcErr } = await supabase.rpc('get_my_tenant' as any);
        let tenantRow: any = null;
        let staffIdFromRpc: string | null = null;
        if (!rpcErr && rpcData && !(Array.isArray(rpcData) && rpcData.length === 0)) {
          tenantRow = Array.isArray(rpcData) ? rpcData[0] : rpcData as any;
          staffIdFromRpc = (tenantRow as any).staff_id || null;
          if (tenantRow?.slug) {
            localStorage.setItem('gestibella_tenant_slug', tenantRow.slug);
            try { setTenantSlug(tenantRow.slug); } catch {}
          }
          if (staffIdFromRpc) {
            loginAs(staffIdFromRpc);
            addToast('success', 'Sesión Iniciada', `Bienvenida, ${data.user.email}`);
            return;
          }
        }
        // Fallback legacy (si RPC no devuelve staff_id)
        const { data: staffFallback } = await supabase.from('staff').select('id, tenant_id').eq('auth_user_id', data.user.id).maybeSingle();
        if (staffFallback?.id) {
          const { data: t } = await supabase.from('tenants').select('slug').eq('id', staffFallback.tenant_id).maybeSingle();
          if (t?.slug) {
            localStorage.setItem('gestibella_tenant_slug', t.slug);
            try { setTenantSlug(t.slug); } catch {}
          }
          loginAs(staffFallback.id);
          addToast('success', 'Sesión Iniciada', `Bienvenida, ${data.user.email}`);
          return;
        }
        throw new Error('Credenciales inválidas');
      } catch (err: any) {
        // Mensaje genérico siempre, no revelar si email existe o tenant
        addToast('error', 'Credenciales inválidas', 'Verifica tu correo, contraseña y que tu cuenta esté activa.');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    // Fallback final genérico
    addToast('error', 'Credenciales inválidas', 'Verifica tu correo y contraseña.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8]">
        
        {/* Close Button */}
        <button
          id="btn-close-login-modal"
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE0D6] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BE5A38] to-[#E07A5F] text-white flex items-center justify-center mx-auto shadow-md shadow-[#BE5A38]/20">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
            Acceso Administrador & Recepción
          </h3>
          <p className="text-xs text-[#78716C]">
            GestiBella es operado exclusivamente por el Administrador y la Recepcionista para agendar y asignar citas al personal.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1">
              Correo Electrónico (Admin / Recepción)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ej. valentina@gestibella.com"
                className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1">
              Contraseña / Clave Maestra
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8DFD8] text-[11px] text-[#57534E] space-y-2">
            <div className="font-bold text-[#BE5A38] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Acceso Seguro</span>
            </div>
            <p>
              Ingresa tu correo y contraseña asignados por tu administrador. Cada cuenta está vinculada a su salón — no necesitas elegir tenant.
            </p>
            {isDemoEphemeral && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-amber-900">
                <div className="font-bold text-xs">Demo efímero</div>
                <p className="text-[11px]">Prueba sin compromiso: lo que crees se borrará al salir. Para tu salón real, usa tu email y contraseña.</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleDemoEnter}
              className="w-full mt-1 py-2 bg-white border border-[#BE5A38] text-[#BE5A38] rounded-xl text-xs font-bold hover:bg-[#FFF7F3] flex items-center justify-center gap-2"
            >
              Probar Demo sin contraseña
            </button>
          </div>

          <button
            id="btn-submit-master-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-md hover:from-[#A84E30] hover:to-[#B45309] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
          >
            <span>{isLoading ? 'Verificando...' : 'Iniciar Sesión en el Software'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-5 pt-4 border-t border-[#F0E8E1] text-center">
          <p className="text-[11px] text-[#78716C] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Control de Acceso Seguro • GestiBella Pro
          </p>
        </div>

      </div>
    </div>
  );
};
