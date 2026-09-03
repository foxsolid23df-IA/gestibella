import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Receipt,
  FlaskConical,
  HeartHandshake,
  Users,
  UserCog,
  LineChart,
  Code,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Printer,
  Building2
} from 'lucide-react';
import { useSalon, PortalNavModule } from '../../context/SalonContext';
import { useTenant } from '../../lib/tenantContext';

export const PortalSidebar: React.FC = () => {
  const {
    portalModule,
    setPortalModule,
    ticketsList,
    appointmentsList,
    inventoryList,
    waitlistEntries,
    resetToDemoData
  } = useSalon();
  const { tenant, limits } = useTenant();

  const openHoldCount = ticketsList.filter((t) => t.status === 'HOLD').length;
  const inChairAptCount = appointmentsList.filter((a) => a.status === 'IN_CHAIR').length;
  const lowStockCount = inventoryList.filter((i) => i.currentStock <= i.minStock).length;
  const activeWaitlistCount = waitlistEntries.filter((w) => w.status === 'WAITING').length;

  const isStarter = tenant?.plan_tier === 'starter';
  const menuItems: {
    id: PortalNavModule;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    locked?: boolean;
    lockReason?: string;
  }[] = [
    {
      id: 'DASHBOARD',
      label: 'Tablero General',
      icon: LayoutDashboard
    },
    {
      id: 'AGENDA',
      label: 'Agenda & Citas',
      icon: Calendar,
      badge: inChairAptCount > 0 ? `${inChairAptCount} en sillón` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'ANTI_NOSHOW',
      label: 'Anti No-Show & Retención',
      icon: ShieldCheck,
      badge: activeWaitlistCount > 0 ? `${activeWaitlistCount} en espera` : 'Activo',
      badgeColor: 'bg-amber-100 text-amber-900 font-bold'
    },
    {
      id: 'POS',
      label: 'POS & Ticket en Espera',
      icon: Receipt,
      badge: openHoldCount > 0 ? `${openHoldCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 font-bold'
    },
    {
      id: 'INVENTORY_FORMULAS',
      label: 'Inventario & Fórmulas',
      icon: FlaskConical,
      badge: lowStockCount > 0 ? `${lowStockCount} bajo` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'CRM',
      label: 'CRM & Sellos Lealtad',
      icon: HeartHandshake
    },
    {
      id: 'STAFF_COMMISSIONS',
      label: 'Personal & Comisiones',
      icon: Users
    },
    {
      id: 'STAFF_MANAGEMENT',
      label: 'Personal & Permisos',
      icon: UserCog
    },
    {
      id: 'FINANCES',
      label: 'Finanzas & Arqueo Caja',
      icon: LineChart
    },
    {
      id: 'REPORTS',
      label: 'Reportes & Analítica',
      icon: BarChart3
    },
    {
      id: 'PRINTER_SETTINGS',
      label: 'Impresora & Tickets POS',
      icon: Printer
    },
    {
      id: 'MULTI_BRANCH',
      label: 'Multi-Sucursal & Red',
      icon: Building2,
      badge: isStarter ? 'Solo Pro/Elite' : 'Pro',
      badgeColor: isStarter ? 'bg-amber-100 text-amber-800' : 'bg-[#BE5A38]/10 text-[#BE5A38]',
      locked: isStarter,
      lockReason: `Starter limitado a ${limits.maxBranches ?? 1} sucursal. Actualiza a Pro (3) o Elite (∞).`
    },
    {
      id: 'AUTHORIZED_DEVICES',
      label: 'Dispositivos & Seguridad',
      icon: ShieldAlert,
      badge: 'Single',
      badgeColor: 'bg-emerald-500/10 text-emerald-700'
    },
    {
      id: 'ARCHITECTURE_DOCS',
      label: 'Arquitectura SaaS & ERD',
      icon: Code,
      badge: 'Docs',
      badgeColor: 'bg-[#BE5A38]/10 text-[#BE5A38]'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E8DFD8] flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-61px)] overflow-y-auto">
      
      {/* Navigation Menu */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase font-extrabold tracking-widest text-[#A8A29E] px-3 py-2">
          Módulos del Salón
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = portalModule === item.id;
          const locked = (item as any).locked;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id.toLowerCase()}`}
              onClick={() => { if (locked) { alert((item as any).lockReason); return; } setPortalModule(item.id); }}
              disabled={!!locked}
              title={locked ? (item as any).lockReason : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                locked ? 'opacity-50 cursor-not-allowed bg-amber-50 text-amber-800 border border-amber-200' :
                isActive
                  ? 'bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white shadow-sm shadow-[#BE5A38]/20'
                  : 'text-[#57534E] hover:bg-[#FAF7F2] hover:text-[#1C1917]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8D5B4C]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Reset Data Demo tool */}
      <div className="pt-4 border-t border-[#F0E8E1] space-y-3">
        <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DFD8] text-left">
          <p className="text-[11px] font-bold text-[#1C1917] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#BE5A38]" />
            Entorno Demo Interactivo
          </p>
          <p className="text-[10px] text-[#78716C] mt-1 leading-snug">
            Puedes crear citas, cobrar tickets con propina, modificar fórmulas y calcular comisiones.
          </p>
        </div>

        <button
          id="btn-reset-demo-data"
          onClick={resetToDemoData}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-[11px] font-semibold text-[#8D5B4C] hover:text-rose-600 bg-white hover:bg-rose-50 border border-[#E8DFD8] rounded-xl transition-colors"
          title="Restaura la base de datos de ejemplo inicial"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Datos Demo</span>
        </button>
      </div>

    </aside>
  );
};
