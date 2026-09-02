import React from 'react';
import {
  Scissors,
  Sparkles,
  LogOut,
  Bell,
  Clock,
  Receipt,
  User,
  UserCheck,
  ChevronDown,
  Globe,
  Plus
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { TenantBadge } from '../TenantBadge';

export const PortalHeader: React.FC = () => {
  const {
    currentStaff,
    logout,
    setIsPortalOpen,
    ticketsList,
    setPortalModule,
    setIsSwitchProfileModalOpen
  } = useSalon();

  const openHoldTickets = ticketsList.filter((t) => t.status === 'HOLD');

  return (
    <header className="bg-white border-b border-[#E8DFD8] px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Brand / Status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#BE5A38] to-[#E07A5F] flex items-center justify-center text-white shadow-xs">
            <Scissors className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                Gesti<span className="text-[#BE5A38]">Bella</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FAF7F2] text-[#8D5B4C] border border-[#E8DFD8] hidden sm:inline-block">
                Portal Interno
              </span>
            </div>
            <p className="text-[10px] text-[#78716C] font-medium hidden md:block">
              Salón & Spa Management • Modo Operativo
            </p>
          </div>
        </div>

        {/* Center: Open Hold Tickets Alert Indicator + Tenant */}
        <div className="flex items-center gap-3">
          <TenantBadge />
          <button
            id="btn-header-hold-tickets"
            onClick={() => setPortalModule('POS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              openHoldTickets.length > 0
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs hover:bg-amber-100'
                : 'bg-[#FAF7F2] border-[#E8DFD8] text-[#78716C]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#BE5A38]" />
            <span>
              {openHoldTickets.length} {openHoldTickets.length === 1 ? 'Cuenta en Espera' : 'Cuentas en Espera'}
            </span>
            {openHoldTickets.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Right: Staff Session & Navigation to Public Site */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Active Staff Badge */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] px-3 py-1.5 rounded-2xl border border-[#E8DFD8]">
            <img
              src={currentStaff.avatar}
              alt={currentStaff.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#BE5A38]"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-[#1C1917] leading-none">{currentStaff.name}</p>
              <p className="text-[10px] text-[#78716C] mt-0.5">{currentStaff.roleTitle}</p>
            </div>
          </div>

          {/* Switch Profile Button */}
          <button
            id="btn-open-switch-profile"
            onClick={() => setIsSwitchProfileModalOpen(true)}
            className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE0D6] border border-[#D8C3B5] text-[#8D5B4C] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Cambiar de usuario o perfil sin usar contraseña maestra"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#BE5A38]" />
            <span className="hidden md:inline">Cambiar Perfil</span>
          </button>

          {/* Return to Public Web */}
          <button
            id="btn-return-public-web"
            onClick={() => setIsPortalOpen(false)}
            className="p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2] rounded-xl transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            title="Ver sitio web público"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden xl:inline">Sitio Web</span>
          </button>

          {/* Logout */}
          <button
            id="btn-portal-logout"
            onClick={logout}
            className="p-2 text-[#78716C] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
