import React from 'react';
import {
  Calendar,
  Receipt,
  Users,
  FlaskConical,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Scissors,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const DashboardModule: React.FC = () => {
  const {
    currentStaff,
    appointmentsList,
    ticketsList,
    inventoryList,
    staffList,
    setPortalModule,
    setActiveCheckoutTicket,
    convertAppointmentToOpenTicket
  } = useSalon();

  // Metrics
  const todayStr = '2026-08-24';
  const todayAppointments = appointmentsList.filter((a) => a.date === todayStr);
  const inChairApts = todayAppointments.filter((a) => a.status === 'IN_CHAIR');
  const openHoldTickets = ticketsList.filter((t) => t.status === 'HOLD');
  const paidTicketsToday = ticketsList.filter((t) => t.status === 'PAID');
  
  const totalSalesToday = paidTicketsToday.reduce((sum, t) => sum + t.total, 0);
  const totalProjectedToday = todayAppointments.reduce((sum, a) => sum + a.price, 0);
  const lowStockItems = inventoryList.filter((i) => i.currentStock <= i.minStock);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FAF7F2] via-[#F4EFEA] to-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#E8DFD8] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#BE5A38] border border-[#E8DFD8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turno en Curso • {todayStr}</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            ¡Hola, {currentStaff.name}!
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] max-w-xl">
            Tu salón tiene <strong>{openHoldTickets.length} cuentas en espera</strong> activas y <strong>{todayAppointments.length} citas agendadas</strong> para el día de hoy.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            id="dash-quick-new-apt"
            onClick={() => setPortalModule('AGENDA')}
            className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#8D5B4C] border border-[#D8C3B5] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#BE5A38]" />
            <span>Ver Agenda</span>
          </button>
          
          <button
            id="dash-quick-new-ticket"
            onClick={() => setPortalModule('POS')}
            className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>Abrir Ticket / POS</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Ventas Hoy */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#78716C]">
            <span>Ventas Cobradas Hoy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1C1917]">
            ${totalSalesToday.toLocaleString()} <span className="text-xs font-normal text-[#78716C]">MXN</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {paidTicketsToday.length} tickets liquidados
          </p>
        </div>

        {/* KPI 2: Proyección de Citas Hoy */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#78716C]">
            <span>Proyección por Citas</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1C1917]">
            ${totalProjectedToday.toLocaleString()} <span className="text-xs font-normal text-[#78716C]">MXN</span>
          </p>
          <p className="text-[11px] text-[#78716C]">
            {todayAppointments.length} clientes programados
          </p>
        </div>

        {/* KPI 3: Tickets en Espera Activos */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#78716C]">
            <span>Tickets en Espera</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#BE5A38]">
            {openHoldTickets.length} <span className="text-xs font-normal text-[#78716C]">cuentas abiertas</span>
          </p>
          <p className="text-[11px] text-amber-700 font-semibold">
            ${openHoldTickets.reduce((s, t) => s + t.total, 0).toLocaleString()} acumulados en sillón
          </p>
        </div>

        {/* KPI 4: Alertas de Stock */}
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#78716C]">
            <span>Insumos Bajo Mínimo</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-600">
            {lowStockItems.length} <span className="text-xs font-normal text-[#78716C]">productos</span>
          </p>
          <button
            onClick={() => setPortalModule('INVENTORY_FORMULAS')}
            className="text-[11px] text-[#BE5A38] font-bold hover:underline block"
          >
            Revisar almacén →
          </button>
        </div>

      </div>

      {/* Main 2-Col Layout: Active Hold Tickets + Today's Agenda Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (7 cols): Cuentas Abiertas (Ticket en Espera) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                Tickets en Espera (Cuentas Abiertas)
              </h3>
              <p className="text-xs text-[#78716C]">
                Clientes que están siendo atendidos. Puedes sumar tratamientos extra o cobrar.
              </p>
            </div>
            <button
              onClick={() => setPortalModule('POS')}
              className="text-xs font-bold text-[#BE5A38] hover:text-[#A84E30] flex items-center gap-1"
            >
              <span>Abrir POS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {openHoldTickets.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#E8DFD8] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs text-[#78716C]">No hay tickets en espera en este momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {openHoldTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  id={`card-dash-hold-${ticket.id}`}
                  className="bg-white rounded-3xl p-5 border border-[#E8DFD8] shadow-xs hover:border-[#D8C3B5] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1C1917]">{ticket.clientName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {ticket.chairNumber || 'En Atención'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-0.5 font-mono">
                        {ticket.ticketNumber} • Iniciado a las {ticket.createdAt}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#78716C]">Total Acumulado</p>
                      <p className="text-xl font-extrabold text-[#BE5A38]">${ticket.total.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Items in ticket */}
                  <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DFD8] space-y-1.5 text-xs">
                    {ticket.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex justify-between text-[#44403C]">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-semibold">${item.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPortalModule('POS')}
                      className="flex-1 py-2 px-3 bg-[#FAF7F2] hover:bg-[#F0E8E1] text-[#8D5B4C] text-xs font-bold rounded-xl border border-[#D8C3B5] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Servicios/Retail</span>
                    </button>

                    <button
                      onClick={() => setActiveCheckoutTicket(ticket)}
                      className="flex-1 py-2 px-3 bg-[#BE5A38] hover:bg-[#A84E30] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Proceder al Cobro</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col (5 cols): Today's Schedule & Team */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                Agenda de Hoy ({todayAppointments.length})
              </h3>
              <p className="text-xs text-[#78716C]">Estado de turnos en tiempo real</p>
            </div>
            <button
              onClick={() => setPortalModule('AGENDA')}
              className="text-xs font-bold text-[#BE5A38] hover:text-[#A84E30] flex items-center gap-1"
            >
              <span>Ver Todo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E8DFD8] shadow-xs space-y-3">
            {todayAppointments.map((apt) => {
              const staff = staffList.find((s) => s.id === apt.staffId);
              return (
                <div
                  key={apt.id}
                  className="p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-[#FAF7F2] border-[#E8DFD8]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#BE5A38]">{apt.time}</span>
                      <span className="font-bold text-xs text-[#1C1917]">{apt.clientName}</span>
                    </div>
                    <p className="text-[11px] text-[#78716C]">{apt.serviceName}</p>
                    <p className="text-[10px] text-[#8D5B4C] font-semibold">
                      Con {staff ? staff.name : 'Estilista'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'IN_CHAIR'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {apt.status === 'IN_CHAIR' ? 'En Sillón' : apt.status === 'CONFIRMED' ? 'Confirmada' : apt.status}
                    </span>

                    {apt.status === 'CONFIRMED' && (
                      <button
                        onClick={() => convertAppointmentToOpenTicket(apt.id)}
                        className="block mt-1.5 text-[10px] font-bold text-[#BE5A38] hover:underline"
                      >
                        Pasar a Sillón →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stock Warning Box if low */}
          {lowStockItems.length > 0 && (
            <div className="bg-rose-50 rounded-3xl p-5 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Atención: Insumos Críticos</span>
              </div>
              <ul className="space-y-1 text-xs text-rose-900">
                {lowStockItems.slice(0, 3).map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <strong>{item.currentStock} {item.unit} restantes</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
