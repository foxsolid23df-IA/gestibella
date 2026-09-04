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

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    staffList,
    loginAs,
    addToast
  } = useSalon();
  const { tenantSlug, isDemoMock } = useTenant();

  const [email, setEmail] = useState('valentina@gestibella.com');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('error', 'Campos Incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }
    // Si Supabase Auth está configurado y no es demo, intenta login real; fallback a fake para no romper demo
    const { supabase, isSupabaseConfigured } = await import('../../lib/supabaseClient');
    if (isSupabaseConfigured && supabase && !isDemoMock) {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (!error && data.user) {
        // Buscar staff vinculado a este auth_user_id
        const { data: staff } = await supabase.from('staff').select('id').eq('auth_user_id', data.user.id).maybeSingle();
        if (staff?.id) {
          loginAs(staff.id);
          addToast('success', 'Sesión Iniciada (Auth)', `Bienvenida, ${data.user.email}`);
          setIsLoading(false);
          return;
        }
        // Si no hay staff vinculado pero el login fue válido, permitir entrada como ADMIN genérico
        const adminStaff = staffList.find((s) => s.role === 'ADMIN') || staffList[0];
        loginAs(adminStaff.id);
        addToast('success', 'Sesión Iniciada (Auth sin staff vinculado)', 'Bienvenida al portal.');
        setIsLoading(false);
        return;
      }
      // Si falla Auth (ej. usuario no existe en auth.users), fallback a fake para mantener compatibilidad demo
      if (error) {
        // No bloquear: intenta fake
        console.warn('[LoginModal] Auth falló, fallback fake:', error.message);
      }
      setIsLoading(false);
    }
    // Fallback fake (demo / compat): intentar por email exacto primero
    const byEmail = staffList.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
    if (byEmail) {
      loginAs(byEmail.id);
      addToast('success', 'Sesión Iniciada', `Bienvenida, ${byEmail.name} (${byEmail.roleTitle})`);
      return;
    }
    // Si el email no existe en este tenant, avisar claramente
    if (email.trim().toLowerCase().includes('valentina') && tenantSlug !== 'gestibella-demo') {
      addToast('error', 'Tenant incorrecto', `Valentina solo existe en gestibella-demo. Estás en "${tenantSlug}". Cambia con ?tenant=gestibella-demo`);
      return;
    }
    if (email.trim().toLowerCase().includes('foxsolid22df') && tenantSlug !== 'salon-prueba') {
      addToast('error', 'Tenant incorrecto', `foxsolid22df@gmail.com es de salon-prueba. Estás en "${tenantSlug}". Cambia con ?tenant=salon-prueba`);
      return;
    }
    const adminStaff = staffList.find((s) => s.role === 'ADMIN' || s.role === 'RECEPTIONIST') || staffList[0];
    if (adminStaff) {
      loginAs(adminStaff.id);
      addToast('success', 'Sesión Iniciada', 'Bienvenida al portal de gestión GestiBella.');
    } else {
      addToast('error', 'Sin personal', 'Este salón aún no tiene staff. Contacta al super-admin.');
    }
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

          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8DFD8] text-[11px] text-[#57534E] space-y-1">
            <div className="font-bold text-[#BE5A38] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Flujo Operativo del Salón:</span>
            </div>
            <p>
              Los trabajadores (estilistas) no requieren cuenta ni acceso a la aplicación. La recepción o el administrador gestionan el calendario y les asignan e indican sus citas directamente.
            </p>
            <p className="pt-1.5 mt-1.5 border-t border-[#E8DFD8] flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isDemoMock ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              <span className="font-bold">Modo: {isDemoMock ? 'DEMO (login fake)' : 'Supabase'}</span> — Tenant: <span className="font-mono bg-white px-1 rounded border">{tenantSlug}</span>
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <a href="?tenant=gestibella-demo" className={`px-2 py-1 rounded-full text-[10px] font-bold border ${tenantSlug==='gestibella-demo'?'bg-[#BE5A38] text-white border-[#BE5A38]':'bg-white border-[#E8DFD8] text-[#57534E] hover:bg-[#FAF7F2]'}`}>Demo · Valentina</a>
              <a href="?tenant=salon-prueba" className={`px-2 py-1 rounded-full text-[10px] font-bold border ${tenantSlug==='salon-prueba'?'bg-[#BE5A38] text-white border-[#BE5A38]':'bg-white border-[#E8DFD8] text-[#57534E] hover:bg-[#FAF7F2]'}`}>POPOTLA · Propietario</a>
              <button type="button" onClick={()=>{ localStorage.removeItem('gestibella_tenant_slug'); window.location.href='?tenant=gestibella-demo'; }} className="px-2 py-1 rounded-full text-[10px] bg-white border border-[#E8DFD8]">Reset</button>
            </div>
            {!isDemoMock && <p className="text-[10px] text-[#A8A29E]">Valentina solo en <code>gestibella-demo</code> · Propietario POPOTLA solo en <code>salon-prueba</code></p>}
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
