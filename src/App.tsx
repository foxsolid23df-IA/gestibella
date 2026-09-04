import React from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { FeaturesSection } from './components/public/FeaturesSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { CommunicationSection } from './components/public/CommunicationSection';
import { BlogSection } from './components/public/BlogSection';
import { PricingPlans } from './components/public/PricingPlans';
import { Footer } from './components/public/Footer';
import { LoginModal } from './components/public/LoginModal';
import { Privacy } from './components/public/Privacy';
import { Terms } from './components/public/Terms';

import { PortalHeader } from './components/portal/PortalHeader';
import { PortalSidebar } from './components/portal/PortalSidebar';
import { DashboardModule } from './components/portal/DashboardModule';
import { AgendaModule } from './components/portal/AgendaModule';
import { AntiNoShowModule } from './components/portal/AntiNoShowModule';
import { POSModule } from './components/portal/POSModule';
import { InventoryFormulasModule } from './components/portal/InventoryFormulasModule';
import { CRMModule } from './components/portal/CRMModule';
import { StaffCommissionsModule } from './components/portal/StaffCommissionsModule';
import { StaffManagementModule } from './components/portal/StaffManagementModule';
import { FinancesModule } from './components/portal/FinancesModule';
import { ReportsModule } from './components/portal/ReportsModule';
import { PrinterSettingsModule } from './components/portal/PrinterSettingsModule';
import { AuthorizedDevicesModule } from './components/portal/AuthorizedDevicesModule';
import { MultiBranchModule } from './components/portal/MultiBranchModule';
import { ArchitectureDocsModule } from './components/portal/ArchitectureDocsModule';
import { CheckoutModal } from './components/portal/CheckoutModal';
import { ReceiptModal } from './components/portal/ReceiptModal';
import { SwitchProfileModal } from './components/portal/SwitchProfileModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { useTenant } from './lib/tenantContext';

const AdminRouteGuard: React.FC = () => {
  const [checking, setChecking] = React.useState(true);
  const [isAllowed, setIsAllowed] = React.useState(false);
  const [email, setEmail] = React.useState('foxsolid23df@gmail.com');
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState<string|null>(null);
  const [loggingIn, setLoggingIn] = React.useState(false);
  const check = React.useCallback(async()=>{
      const { supabase, isSupabaseConfigured } = await import('./lib/supabaseClient');
      if (!isSupabaseConfigured || !supabase) { setIsAllowed(true); setChecking(false); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsAllowed(false); setChecking(false); return; }
      const { data } = await supabase.from('platform_admins').select('user_id').eq('user_id', session.user.id).maybeSingle();
      setIsAllowed(!!data);
      setChecking(false);
  },[]);
  React.useEffect(()=>{ check(); },[check]);
  const handleLogin = async (e: React.FormEvent)=>{
    e.preventDefault();
    setLoginError(null); setLoggingIn(true);
    try{
      const { supabase } = await import('./lib/supabaseClient');
      if (!supabase) throw new Error('Supabase no configurado');
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      // re-verificar super-admin
      const { data: row } = await supabase.from('platform_admins').select('user_id').eq('user_id', data.user!.id).maybeSingle();
      if (!row) throw new Error('Tu usuario no es super-admin (no está en platform_admins).');
      setIsAllowed(true);
    }catch(err:any){ setLoginError(err.message || String(err)); }
    finally{ setLoggingIn(false); }
  };
  if (checking) return <div className="p-8 text-center text-sm">Verificando acceso super-admin…</div>;
  if (!isAllowed) return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
      <div className="bg-white border border-[#E8DFD8] rounded-2xl p-6 max-w-md w-full space-y-4">
        <h2 className="font-bold text-center">Acceso restringido — Solo super-admin</h2>
        <p className="text-xs text-[#78716C] text-center">Inicia sesión con tu cuenta super-admin para acceder a <code>/admin</code>. Ya tienes tu usuario <b>foxsolid23df@gmail.com</b> creado.</p>
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email super-admin" className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2.5 text-sm" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2.5 text-sm" required />
          {loginError && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-2 text-xs">{loginError}</div>}
          <button type="submit" disabled={loggingIn} className="w-full py-2.5 bg-[#1C1917] text-white rounded-xl text-sm font-bold disabled:opacity-60">{loggingIn ? 'Verificando...' : 'Iniciar sesión super-admin'}</button>
        </form>
        <div className="text-center flex flex-col gap-2">
          <a href="/" className="text-xs text-[#78716C] hover:text-[#1C1917]">← Volver al sitio</a>
          <p className="text-[10px] text-[#A8A29E]">Si es demo local sin Supabase, este guard está deshabilitado y entrarías directo.</p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans antialiased">
      <div className="bg-[#1C1917] text-white px-4 py-2 text-xs flex items-center justify-between">
        <span className="font-bold tracking-wide">GESTIBELLA · SUPER-ADMIN</span>
        <a href="/" className="text-[#D8C3B5] hover:text-white text-xs">← Volver al sitio</a>
      </div>
      <div className="py-6"><AdminPanel /></div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { isPortalOpen, portalModule } = useSalon();
  const { isExpired, daysRemaining, tenant } = useTenant();
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  if (isAdminRoute) {
    return <AdminRouteGuard />;
  }
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  if (path === '/privacidad') return <div className="min-h-screen bg-[#FAF7F2]"><Privacy /><Footer /></div>;
  if (path === '/terminos') return <div className="min-h-screen bg-[#FAF7F2]"><Terms /><Footer /></div>;

  if (isPortalOpen) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-[#1C1917] font-sans antialiased">
        {isExpired && (
          <div className="bg-rose-600 text-white text-center py-2 text-xs font-bold tracking-wide">
            ⚠️ Licencia vencida ({tenant?.plan_tier}) — vence {tenant?.current_period_end ? new Date(tenant.current_period_end).toLocaleDateString() : '—'} · Contacta al administrador para renovar · Solo lectura
          </div>
        )}
        {/* Portal Internal Header */}
        <PortalHeader />

        {/* Workspace: Sidebar + Dynamic Module */}
        <div className="flex-1 flex overflow-hidden">
          <PortalSidebar />

          <main className="flex-1 p-4 sm:p-8 overflow-y-auto h-[calc(100vh-61px)]">
            <div className="max-w-7xl mx-auto pb-12">
              {portalModule === 'DASHBOARD' && <DashboardModule />}
              {portalModule === 'AGENDA' && <AgendaModule />}
              {portalModule === 'ANTI_NOSHOW' && <AntiNoShowModule />}
              {portalModule === 'POS' && <POSModule />}
              {portalModule === 'INVENTORY_FORMULAS' && <InventoryFormulasModule />}
              {portalModule === 'CRM' && <CRMModule />}
              {portalModule === 'STAFF_COMMISSIONS' && <StaffCommissionsModule />}
              {portalModule === 'STAFF_MANAGEMENT' && <StaffManagementModule />}
              {portalModule === 'FINANCES' && <FinancesModule />}
              {portalModule === 'REPORTS' && <ReportsModule />}
              {portalModule === 'PRINTER_SETTINGS' && <PrinterSettingsModule />}
              {portalModule === 'AUTHORIZED_DEVICES' && <AuthorizedDevicesModule />}
              {portalModule === 'MULTI_BRANCH' && <MultiBranchModule />}
              {portalModule === 'ARCHITECTURE_DOCS' && <ArchitectureDocsModule />}
            </div>
          </main>
        </div>

        {/* Global Modals for Checkout and Receipt */}
        <CheckoutModal />
        <ReceiptModal />
        <SwitchProfileModal />
      </div>
    );
  }

  // Public Marketing & Presentation Portal
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans antialiased flex flex-col selection:bg-[#BE5A38]/20 selection:text-[#BE5A38]">
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* Sections requested: INICIO, CARACTERISTICAS, TESTIMONIOS, COMUNICACION, BLOG, PLANES */}
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <TestimonialsSection />
        <CommunicationSection />
        <BlogSection />
        <PricingPlans />
      </main>

      {/* Public Footer */}
      <Footer />

      {/* Staff Login Modal (Acceso al Software) */}
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <MainContent />
    </SalonProvider>
  );
}
