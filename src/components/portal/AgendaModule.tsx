import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Phone,
  MessageCircle,
  Scissors,
  CheckCircle,
  Play,
  Filter,
  Receipt,
  DollarSign,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  ShieldCheck,
  Zap,
  CreditCard
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { AppointmentStatus } from '../../types';
import { downloadIcsFile, DEFAULT_SALON_INFO } from '../../utils/calendarUtils';

export const AgendaModule: React.FC = () => {
  const {
    appointmentsList,
    staffList,
    servicesList,
    clientsList,
    addAppointment,
    updateAppointmentStatus,
    convertAppointmentToOpenTicket,
    sendAppointmentReminder,
    setPortalModule,
    addToast
  } = useSalon();

  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'STAFF_COLUMNS' | 'LIST'>('STAFF_COLUMNS');
  const [isNewAptModalOpen, setIsNewAptModalOpen] = useState(false);

  // Form State for new appointment
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newStaffId, setNewStaffId] = useState(staffList[0]?.id || 'staff-1');
  const [newServiceId, setNewServiceId] = useState(servicesList[0]?.id || 'srv-1');
  const [newDate, setNewDate] = useState('2026-08-24');
  const [newTime, setNewTime] = useState('11:00');
  const [newNotes, setNewNotes] = useState('');

  const filteredAppointments = appointmentsList.filter((apt) => {
    const matchDate = apt.date === selectedDate;
    const matchStaff = selectedStaffFilter === 'ALL' || apt.staffId === selectedStaffFilter;
    return matchDate && matchStaff;
  });

  const projectedRevenue = filteredAppointments.reduce((sum, a) => sum + a.price, 0);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const service = servicesList.find((s) => s.id === newServiceId);
    if (!newClientName || !service) return;

    // Check if client exists or create fallback ID
    const existingClient = clientsList.find((c) => c.name.toLowerCase() === newClientName.toLowerCase());
    const clientId = existingClient ? existingClient.id : `cli-${Date.now()}`;

    addAppointment({
      clientName: newClientName,
      clientPhone: newClientPhone || '+52 55 0000 0000',
      clientId,
      staffId: newStaffId,
      serviceId: service.id,
      serviceName: service.name,
      date: newDate,
      time: newTime,
      durationMinutes: service.durationMinutes,
      price: service.price,
      status: 'CONFIRMED',
      notes: newNotes,
      notificationSent: false
    });

    setIsNewAptModalOpen(false);
    setNewClientName('');
    setNewClientPhone('');
    setNewNotes('');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'IN_CHAIR':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">En Sillón / Atención</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Confirmada</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">Completada</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Cancelada</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Anti No-Show Strategy Banner */}
      <div className="bg-gradient-to-r from-[#FAF7F2] to-amber-50/50 p-4 rounded-3xl border border-[#E8DFD8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#BE5A38] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1C1917]">Protección Anti Inasistencias Activa</h4>
            <p className="text-[11px] text-[#78716C]">Inyección de .ics a celulares, anticipos del 30% y lista de espera automatizada.</p>
          </div>
        </div>
        <button
          onClick={() => setPortalModule('ANTI_NOSHOW')}
          className="px-4 py-2 bg-white text-[#BE5A38] border border-[#E8DFD8] hover:bg-[#FAF7F2] rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Ver Módulo Anti No-Show</span>
        </button>
      </div>

      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Agenda Inteligente del Salón</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Control de Citas & Sillones
          </h2>
          <p className="text-xs text-[#78716C]">
            Citas vinculadas a <strong>Tickets en Espera</strong> y proyecciones de caja en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker Buttons */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-[#E8DFD8]">
            <button
              onClick={() => setSelectedDate('2026-08-24')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === '2026-08-24' ? 'bg-[#BE5A38] text-white shadow-xs' : 'text-[#78716C]'
              }`}
            >
              Hoy (24 Ago)
            </button>
            <button
              onClick={() => setSelectedDate('2026-08-25')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === '2026-08-25' ? 'bg-[#BE5A38] text-white shadow-xs' : 'text-[#78716C]'
              }`}
            >
              Mañana (25 Ago)
            </button>
          </div>

          {/* New Appointment CTA */}
          <button
            id="btn-agenda-new-apt"
            onClick={() => setIsNewAptModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Filter & Metric Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8]">
        
        {/* Filter by Stylist */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8D5B4C]" />
          <span className="text-xs font-bold text-[#44403C]">Filtrar Especialista:</span>
          <select
            id="filter-agenda-staff"
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="bg-white border border-[#D8C3B5] rounded-xl px-3 py-1.5 text-xs text-[#1C1917] focus:ring-1 focus:ring-[#BE5A38] focus:outline-none"
          >
            <option value="ALL">Todos los Colaboradores ({staffList.length})</option>
            {staffList.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.roleTitle})
              </option>
            ))}
          </select>
        </div>

        {/* Projections & View Mode */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="text-right">
            <span className="text-[11px] text-[#78716C]">Proyección del Día: </span>
            <strong className="text-sm font-extrabold text-[#BE5A38]">
              ${projectedRevenue.toLocaleString()} MXN
            </strong>
          </div>

          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E8DFD8]">
            <button
              onClick={() => setViewMode('STAFF_COLUMNS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                viewMode === 'STAFF_COLUMNS' ? 'bg-[#FAF7F2] text-[#BE5A38]' : 'text-[#78716C]'
              }`}
            >
              Por Sillón / Staff
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                viewMode === 'LIST' ? 'bg-[#FAF7F2] text-[#BE5A38]' : 'text-[#78716C]'
              }`}
            >
              Lista Cronológica
            </button>
          </div>
        </div>

      </div>

      {/* Main View: By Staff Columns */}
      {viewMode === 'STAFF_COLUMNS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(selectedStaffFilter === 'ALL'
            ? staffList.filter((s) => s.role !== 'RECEPTIONIST')
            : staffList.filter((s) => s.id === selectedStaffFilter)
          ).map((staff) => {
            const staffApts = filteredAppointments.filter((a) => a.staffId === staff.id);
            const staffTotal = staffApts.reduce((sum, a) => sum + a.price, 0);

            return (
              <div
                key={staff.id}
                className="bg-white rounded-3xl border border-[#E8DFD8] shadow-xs flex flex-col justify-between overflow-hidden"
              >
                {/* Column Header */}
                <div
                  className="p-4 border-b border-[#E8DFD8] flex items-center justify-between"
                  style={{ borderTop: `4px solid ${staff.colorTag}` }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E8DFD8]"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#1C1917]">{staff.name}</h4>
                      <p className="text-[10px] text-[#78716C]">{staff.roleTitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#BE5A38]">${staffTotal.toLocaleString()}</span>
                </div>

                {/* Column Body: Appointments */}
                <div className="p-4 space-y-3 flex-1 min-h-[300px] bg-[#FAF7F2]/40">
                  {staffApts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-[#A8A29E]">
                      <Clock className="w-6 h-6 mb-2 text-[#D8C3B5]" />
                      <span>Sin citas programadas para esta fecha.</span>
                    </div>
                  ) : (
                    staffApts.map((apt) => (
                      <div
                        key={apt.id}
                        id={`apt-card-${apt.id}`}
                        className={`bg-white rounded-2xl p-3.5 border shadow-xs space-y-2.5 transition-all ${
                          apt.status === 'IN_CHAIR'
                            ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                            : 'border-[#E8DFD8] hover:border-[#D8C3B5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#BE5A38] bg-[#FAF7F2] px-2 py-0.5 rounded-md">
                            {apt.time} ({apt.durationMinutes} min)
                          </span>
                          {getStatusBadge(apt.status)}
                        </div>

                        <div>
                          <p className="font-bold text-xs text-[#1C1917]">{apt.clientName}</p>
                          <p className="text-[11px] text-[#57534E] font-medium">{apt.serviceName}</p>
                          {apt.notes && (
                            <p className="text-[10px] text-[#78716C] italic mt-1">"{apt.notes}"</p>
                          )}
                        </div>

                        {/* Badges: Deposit & Upsell */}
                        <div className="flex flex-wrap gap-1">
                          {apt.depositPaid ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>Anticipo ${apt.depositAmount} Abonado</span>
                            </span>
                          ) : apt.depositRequired ? (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <CreditCard className="w-2.5 h-2.5" />
                              <span>Seña ${apt.depositAmount} Pendiente</span>
                            </span>
                          ) : null}

                          {apt.upsellAccepted && (
                            <span className="px-2 py-0.5 bg-rose-50 text-[#BE5A38] text-[10px] font-bold rounded-md flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>+ Up-Selling ({apt.upsellItemName})</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F0E8E1]">
                          <span className="font-bold text-[#1C1917]">${apt.price.toLocaleString()}</span>
                          
                          <div className="flex items-center gap-1">
                            {/* Download .ics Button */}
                            <button
                              onClick={() => {
                                downloadIcsFile(apt, DEFAULT_SALON_INFO, staff.name);
                                addToast('success', 'Archivo .ICS Creado', `Calendario descargado para ${apt.clientName}`);
                              }}
                              className="p-1.5 rounded-lg text-[10px] font-bold text-[#78716C] hover:text-[#BE5A38] bg-[#FAF7F2] transition-colors cursor-pointer"
                              title="Descargar archivo .ics para el calendario del cliente"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            {/* WhatsApp Reminder status */}
                            <button
                              onClick={() => sendAppointmentReminder(apt.id)}
                              className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                apt.notificationSent
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'text-[#78716C] hover:text-[#BE5A38] bg-[#FAF7F2]'
                              }`}
                              title="Enviar recordatorio por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{apt.notificationSent ? '24h OK' : 'Recordar'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Direct Turn into Open Tab / Hold Ticket */}
                        {apt.status === 'CONFIRMED' && (
                          <button
                            id={`btn-start-chair-${apt.id}`}
                            onClick={() => convertAppointmentToOpenTicket(apt.id)}
                            className="w-full py-2 bg-[#BE5A38] hover:bg-[#A84E30] text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Iniciar Atención (Ticket en Espera)</span>
                          </button>
                        )}

                        {apt.status === 'IN_CHAIR' && (
                          <button
                            onClick={() => convertAppointmentToOpenTicket(apt.id)}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Ver Cuenta Abierta en POS</span>
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Quick Add */}
                <div className="p-3 bg-white border-t border-[#E8DFD8] text-center">
                  <button
                    onClick={() => {
                      setNewStaffId(staff.id);
                      setIsNewAptModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#8D5B4C] hover:text-[#BE5A38] flex items-center justify-center gap-1 mx-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agendar con {staff.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-white rounded-3xl border border-[#E8DFD8] p-5 shadow-xs divide-y divide-[#F0E8E1]">
          {filteredAppointments.map((apt) => (
            <div key={apt.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 text-center font-mono font-bold text-xs text-[#BE5A38] bg-[#FAF7F2] p-2 rounded-xl border border-[#E8DFD8]">
                  {apt.time}
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1C1917]">{apt.clientName}</p>
                  <p className="text-[11px] text-[#78716C]">{apt.serviceName} • {apt.durationMinutes} min</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {getStatusBadge(apt.status)}
                <span className="font-bold text-xs text-[#1C1917]">${apt.price.toLocaleString()}</span>
                {apt.status === 'CONFIRMED' && (
                  <button
                    onClick={() => convertAppointmentToOpenTicket(apt.id)}
                    className="px-3 py-1.5 bg-[#BE5A38] text-white text-xs font-bold rounded-xl"
                  >
                    Abrir Ticket
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Appointment Modal */}
      {isNewAptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8]">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917] mb-4">
              Agendar Nueva Cita
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] mb-1">Nombre de la Clienta</label>
                <input
                  id="input-new-apt-client"
                  type="text"
                  required
                  placeholder="Ej. Sofía Álvarez"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">WhatsApp / Teléfono</label>
                  <input
                    id="input-new-apt-phone"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Servicio Solicitado</label>
                  <select
                    id="select-new-apt-service"
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} (${srv.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Especialista</label>
                  <select
                    id="select-new-apt-staff"
                    value={newStaffId}
                    onChange={(e) => setNewStaffId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  >
                    {staffList.filter((s) => s.role !== 'RECEPTIONIST').map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Fecha</label>
                  <input
                    id="input-new-apt-date"
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Hora</label>
                  <input
                    id="input-new-apt-time"
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">Notas u Observaciones Técnicas</label>
                <input
                  id="input-new-apt-notes"
                  type="text"
                  placeholder="Ej. Balayage en cabello virgen, traer foto de referencia"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewAptModalOpen(false)}
                  className="flex-1 py-3 bg-[#FAF7F2] text-[#78716C] font-bold rounded-xl border border-[#E8DFD8]"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-create-apt"
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold rounded-xl shadow-md"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
