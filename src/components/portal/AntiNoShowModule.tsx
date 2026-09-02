import React, { useState } from 'react';
import {
  Calendar,
  Download,
  CalendarCheck,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Users,
  Bell,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Settings,
  Send,
  Smartphone,
  CreditCard,
  Building,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { downloadIcsFile, generateGoogleCalendarUrl, DEFAULT_SALON_INFO } from '../../utils/calendarUtils';
import { Appointment } from '../../types';

export const AntiNoShowModule: React.FC = () => {
  const {
    appointmentsList,
    waitlistEntries,
    upsellItemsList,
    antiNoShowSettings,
    updateAntiNoShowSettings,
    recordAppointmentDeposit,
    toggleAppointmentUpsell,
    cancelAppointmentAndTriggerWaitlist,
    notifyWaitlistClient,
    bookWaitlistToAppointment,
    addToWaitlist,
    removeWaitlistEntry,
    convertAppointmentToOpenTicket,
    staffList,
    servicesList,
    addToast
  } = useSalon();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CALENDAR_ICS' | 'DEPOSITS' | 'UPSELL' | 'WAITLIST' | 'SETTINGS'>('OVERVIEW');

  // Interactive Simulator States
  const [selectedAptId, setSelectedAptId] = useState<string>(appointmentsList[0]?.id || '');
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [newWaitlistName, setNewWaitlistName] = useState('');
  const [newWaitlistPhone, setNewWaitlistPhone] = useState('');
  const [newWaitlistServiceId, setNewWaitlistServiceId] = useState(servicesList[0]?.id || '');
  const [newWaitlistStaffId, setNewWaitlistStaffId] = useState('ANY');
  const [newWaitlistDate, setNewWaitlistDate] = useState('2026-08-25');
  const [newWaitlistTimeRange, setNewWaitlistTimeRange] = useState('Tarde (15:00 - 18:00)');
  const [newWaitlistNotes, setNewWaitlistNotes] = useState('');

  // Selected Appointment for simulator
  const selectedApt = appointmentsList.find((a) => a.id === selectedAptId) || appointmentsList[0];
  const selectedStaff = staffList.find((s) => s.id === selectedApt?.staffId);

  // Stats calculation
  const totalAppointments = appointmentsList.length;
  const confirmedWithDeposit = appointmentsList.filter((a) => a.depositPaid).length;
  const totalDepositAmount = appointmentsList.filter((a) => a.depositPaid).reduce((sum, a) => sum + (a.depositAmount || 0), 0);
  const upsellAcceptedCount = appointmentsList.filter((a) => a.upsellAccepted).length;
  const activeWaitlistCount = waitlistEntries.filter((w) => w.status === 'WAITING').length;

  const handleCreateWaitlistEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaitlistName.trim() || !newWaitlistPhone.trim()) return;

    const srv = servicesList.find((s) => s.id === newWaitlistServiceId);

    addToWaitlist({
      clientName: newWaitlistName,
      clientPhone: newWaitlistPhone,
      serviceId: newWaitlistServiceId,
      serviceName: srv ? srv.name : 'Servicio Especial',
      preferredStaffId: newWaitlistStaffId,
      preferredDate: newWaitlistDate,
      preferredTimeRange: newWaitlistTimeRange,
      notes: newWaitlistNotes
    });

    setNewWaitlistName('');
    setNewWaitlistPhone('');
    setNewWaitlistNotes('');
    setWaitlistModalOpen(false);
  };

  const handleSimulateCancellation = (aptId: string) => {
    const res = cancelAppointmentAndTriggerWaitlist(aptId);
    if (res.waitlistMatches.length > 0) {
      addToast(
        'success',
        '⚡ Automatización Ejecutada',
        `Se contactó inmediatamente a ${res.waitlistMatches[0].clientName} para tomar el espacio de ${res.freedSlot}.`
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistema Anti No-Show & Retención Psicológica</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Centro de Automatización Anti Inasistencias
          </h2>
          <p className="text-sm text-[#78716C] mt-1 max-w-2xl">
            Herramientas diseñadas para comprometer la asistencia del cliente, inyectar citas en el calendario nativo de sus teléfonos, asegurar anticipos y monetizar recordatorios.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            id="btn-open-waitlist-modal"
            onClick={() => setWaitlistModalOpen(true)}
            className="px-4 py-2.5 bg-[#BE5A38] text-white text-xs font-bold rounded-2xl shadow-sm hover:bg-[#A84E30] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Clienta en Espera</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716C] font-medium">Tasa de No-Show Actual</p>
            <p className="text-2xl font-extrabold text-[#1C1917]">1.8%</p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Reducción del -92%
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716C] font-medium">Anticipos Custodiados</p>
            <p className="text-2xl font-extrabold text-[#1C1917]">${totalDepositAmount.toLocaleString()} MXN</p>
            <p className="text-[11px] text-[#78716C] font-medium">{confirmedWithDeposit} citas blindadas con seña</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#BE5A38] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716C] font-medium">Up-Selling en Recordatorio</p>
            <p className="text-2xl font-extrabold text-[#BE5A38]">{upsellAcceptedCount} Aceptados</p>
            <p className="text-[11px] text-emerald-600 font-bold">+28% ticket promedio</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716C] font-medium">Lista de Espera Activa</p>
            <p className="text-2xl font-extrabold text-[#1C1917]">{activeWaitlistCount} Clientas</p>
            <p className="text-[11px] text-blue-600 font-medium">Auto-dispatch al cancelar</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DFD8] pb-1 overflow-x-auto">
        <button
          id="tab-overview"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#1C1917] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:bg-[#FAF7F2] border border-[#E8DFD8]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Estrategia Integral (4 Pilares)</span>
        </button>

        <button
          id="tab-calendar-ics"
          onClick={() => setActiveTab('CALENDAR_ICS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'CALENDAR_ICS'
              ? 'bg-[#BE5A38] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:bg-[#FAF7F2] border border-[#E8DFD8]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>1. Botón "Añadir a mi Calendario" (.ics)</span>
        </button>

        <button
          id="tab-deposits"
          onClick={() => setActiveTab('DEPOSITS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'DEPOSITS'
              ? 'bg-[#BE5A38] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:bg-[#FAF7F2] border border-[#E8DFD8]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>2. Depósitos & Cobro Anticipado</span>
        </button>

        <button
          id="tab-upsell"
          onClick={() => setActiveTab('UPSELL')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'UPSELL'
              ? 'bg-[#BE5A38] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:bg-[#FAF7F2] border border-[#E8DFD8]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>3. Up-Selling en Recordatorio (24h)</span>
        </button>

        <button
          id="tab-waitlist"
          onClick={() => setActiveTab('WAITLIST')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'WAITLIST'
              ? 'bg-[#BE5A38] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:bg-[#FAF7F2] border border-[#E8DFD8]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. Lista de Espera Automatizada</span>
          {activeWaitlistCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 text-[10px] font-bold flex items-center justify-center">
              {activeWaitlistCount}
            </span>
          )}
        </button>

        <button
          id="tab-settings"
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'SETTINGS'
              ? 'bg-[#BE5A38] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:bg-[#FAF7F2] border border-[#E8DFD8]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuración de Políticas</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pilar 1 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4 hover:border-[#BE5A38]/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full">
                  Pilar 1: Dispositivo Nativo
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                Botón "Añadir a mi Calendario" (.ics)
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Al enviar la confirmación por WhatsApp o correo, se genera un archivo <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[#BE5A38] font-bold">.ics</code> compatible con Apple Calendar, Google Calendar y Outlook. Esto inyecta el evento en el teléfono del cliente activando notificaciones nativas con alarma de 24h y 1h antes.
              </p>
              <div className="pt-2 border-t border-[#F0E8E1] flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Efecto:</span>
                <span className="font-bold text-emerald-600">Alarma sonora en iPhone / Android</span>
              </div>
              <button
                onClick={() => setActiveTab('CALENDAR_ICS')}
                className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#F0E8E1] text-[#1C1917] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Probar Generador de .ics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4 hover:border-[#BE5A38]/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-full">
                  Pilar 2: Compromiso Económico
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                Depósitos y Cobro Anticipado (30%)
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Para servicios de alto valor (como Balayage, Alisados con Keratina o Extensiones), el sistema calcula y solicita un anticipo del 30%. Si hay dinero de por medio, el compromiso psicológico se multiplica y la inasistencia cae a niveles cercanos a cero.
              </p>
              <div className="pt-2 border-t border-[#F0E8E1] flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Integración:</span>
                <span className="font-bold text-[#BE5A38]">Abono automático en POS</span>
              </div>
              <button
                onClick={() => setActiveTab('DEPOSITS')}
                className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#F0E8E1] text-[#1C1917] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver Control de Anticipos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4 hover:border-[#BE5A38]/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#BE5A38] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-rose-50 text-[#BE5A38] text-[11px] font-bold rounded-full">
                  Pilar 3: Up-Selling Extendido
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                Manejo del Ticket en Espera en el Recordatorio
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                En el mensaje de recordatorio de 24 horas, el sistema sugiere un servicio complementario express (ej. Hidratación Olaplex o Exfoliación). Si el cliente responde "SI", se inyecta automáticamente como ítem al Ticket en Espera de su cita en el POS.
              </p>
              <div className="pt-2 border-t border-[#F0E8E1] flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Impacto:</span>
                <span className="font-bold text-emerald-600">Monetiza el mensaje de recordatorio</span>
              </div>
              <button
                onClick={() => setActiveTab('UPSELL')}
                className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#F0E8E1] text-[#1C1917] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Configurar Catálogo de Up-Selling</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pilar 4 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4 hover:border-[#BE5A38]/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-[11px] font-bold rounded-full">
                  Pilar 4: Cero Huecos en Agenda
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                Lista de Espera Automatizada (Waitlist)
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Si un cliente cancela su cita con 24h de anticipación, el motor inteligente busca al instante a las clientas en lista de espera que coincidan con la fecha y especialista, enviando una alerta prioritaria para reocupar el sillón en minutos.
              </p>
              <div className="pt-2 border-t border-[#F0E8E1] flex justify-between items-center text-xs">
                <span className="text-[#78716C]">Automatización:</span>
                <span className="font-bold text-purple-700">Reocupación express sin llamadas manuales</span>
              </div>
              <button
                onClick={() => setActiveTab('WAITLIST')}
                className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#F0E8E1] text-[#1C1917] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Administrar Lista de Espera</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: CALENDAR .ICS */}
      {activeTab === 'CALENDAR_ICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#BE5A38]">
              <CalendarCheck className="w-4 h-4" />
              <span>Simulador de Descarga & Sincronización .ICS</span>
            </div>
            
            <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
              Inyección de Cita en Teléfono del Cliente
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#44403C] mb-1">
                Selecciona una Cita Agendada:
              </label>
              <select
                id="select-appointment-ics"
                value={selectedAptId}
                onChange={(e) => setSelectedAptId(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-xs text-[#1C1917] font-semibold focus:outline-none"
              >
                {appointmentsList.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.clientName} — {apt.serviceName} ({apt.date} {apt.time})
                  </option>
                ))}
              </select>
            </div>

            {selectedApt && (
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Cliente:</span>
                  <span className="font-bold text-[#1C1917]">{selectedApt.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Teléfono:</span>
                  <span className="font-medium text-[#1C1917]">{selectedApt.clientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Servicio:</span>
                  <span className="font-bold text-[#BE5A38]">{selectedApt.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Especialista:</span>
                  <span className="font-medium text-[#1C1917]">{selectedStaff?.name || 'Staff'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Horario:</span>
                  <span className="font-bold text-[#1C1917]">{selectedApt.date} a las {selectedApt.time} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Duración:</span>
                  <span className="font-medium text-[#1C1917]">{selectedApt.durationMinutes} minutos</span>
                </div>
              </div>
            )}

            {/* Direct Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                id="btn-download-ics"
                onClick={() => {
                  if (selectedApt) {
                    downloadIcsFile(selectedApt, DEFAULT_SALON_INFO, selectedStaff?.name);
                    addToast('success', 'Archivo .ics Generado', `Descargado archivo de calendario para ${selectedApt.clientName} con recordatorio de 24h.`);
                  }
                }}
                className="w-full py-3 bg-[#BE5A38] text-white text-xs font-bold rounded-2xl shadow-sm hover:bg-[#A84E30] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Archivo .ICS Real (RFC 5545)</span>
              </button>

              <a
                id="link-google-calendar"
                href={selectedApt ? generateGoogleCalendarUrl(selectedApt, DEFAULT_SALON_INFO, selectedStaff?.name) : '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-white text-[#1C1917] border border-[#E8DFD8] text-xs font-bold rounded-2xl hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-2 text-center"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>Abrir en Google Calendar Web</span>
              </a>
            </div>
          </div>

          {/* Smartphone Simulator Preview */}
          <div className="lg:col-span-7 bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8DFD8] flex flex-col items-center justify-center">
            <div className="max-w-sm w-full bg-white rounded-3xl p-5 shadow-lg border border-[#E8DFD8] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0E8E1] pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#BE5A38]" />
                  <span className="text-xs font-bold text-[#1C1917]">Notificación en iPhone / Android</span>
                </div>
                <span className="text-[10px] text-[#78716C]">Ahora</span>
              </div>

              {/* Notification bubble */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#BE5A38]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Calendario de Dispositivo</span>
                </div>
                <p className="text-xs font-bold text-[#1C1917]">
                  Recordatorio: Mañana tienes tu cita en GestiBella
                </p>
                <p className="text-[11px] text-[#57534E]">
                  {selectedApt?.serviceName} a las {selectedApt?.time} hrs con {selectedStaff?.name}. Ubicación: {DEFAULT_SALON_INFO.address}.
                </p>
              </div>

              {/* ICS Attachment Card */}
              <div className="border border-blue-200 bg-blue-50/60 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ICS
                  </div>
                  <div>
                    <p className="font-bold text-[#1C1917]">Cita_GestiBella.ics</p>
                    <p className="text-[10px] text-blue-700">1 Evento con 2 Alarmas automáticas</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded-lg">
                  Sincronizado
                </span>
              </div>

              <div className="text-[11px] text-[#78716C] bg-white p-3 rounded-xl border border-dashed border-[#E8DFD8]">
                <p className="font-semibold text-[#1C1917] mb-1">¿Por qué reduce los no-shows al 1.8%?</p>
                A diferencia de un mensaje de texto que se olvida, el archivo .ics inyecta la cita en el reloj y pantalla de bloqueo del cliente con una alarma que no depende de que abra WhatsApp.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEPOSITS */}
      {activeTab === 'DEPOSITS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                  Citas con Depósito y Cobro Anticipado Requerido
                </h3>
                <p className="text-xs text-[#78716C]">
                  El sistema cobra un 30% en servicios mayores a ${antiNoShowSettings.minimumServicePriceForDeposit.toLocaleString()} MXN (Balayage, Keratinas, Spa).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  Cobro Anticipado: {antiNoShowSettings.depositPercentage}%
                </span>
              </div>
            </div>

            {/* Appointments Table with Deposit Actions */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFD8] text-[#78716C] font-bold">
                    <th className="py-3 px-3">Cliente</th>
                    <th className="py-3 px-3">Servicio</th>
                    <th className="py-3 px-3">Fecha y Hora</th>
                    <th className="py-3 px-3">Precio Total</th>
                    <th className="py-3 px-3">Anticipo (30%)</th>
                    <th className="py-3 px-3">Estado Anticipo</th>
                    <th className="py-3 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8E1]">
                  {appointmentsList.map((apt) => {
                    const depositAmt = apt.depositAmount || Math.round((apt.price * 30) / 100);
                    return (
                      <tr key={apt.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3 px-3 font-bold text-[#1C1917]">
                          {apt.clientName}
                          <p className="text-[10px] font-normal text-[#78716C]">{apt.clientPhone}</p>
                        </td>
                        <td className="py-3 px-3 text-[#44403C] font-semibold">{apt.serviceName}</td>
                        <td className="py-3 px-3 text-[#57534E]">{apt.date} {apt.time}</td>
                        <td className="py-3 px-3 font-bold text-[#1C1917]">${apt.price.toLocaleString()}</td>
                        <td className="py-3 px-3 font-bold text-[#BE5A38]">${depositAmt.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          {apt.depositPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Abonado ({apt.depositPaymentMethod || 'SPEI'})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                              <Clock className="w-3 h-3" />
                              <span>Pendiente de Pago</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {apt.depositPaid ? (
                            <button
                              onClick={() => convertAppointmentToOpenTicket(apt.id)}
                              className="px-3 py-1.5 bg-[#FAF7F2] text-[#1C1917] border border-[#E8DFD8] rounded-xl hover:bg-white text-[11px] font-bold cursor-pointer"
                            >
                              Ver en POS (Ticket)
                            </button>
                          ) : (
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => recordAppointmentDeposit(apt.id, depositAmt, 'TRANSFERENCIA')}
                                className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-[11px] font-bold shadow-xs cursor-pointer"
                              >
                                Marcar SPEI
                              </button>
                              <button
                                onClick={() => recordAppointmentDeposit(apt.id, depositAmt, 'TARJETA_CREDITO')}
                                className="px-2.5 py-1.5 bg-[#BE5A38] text-white rounded-xl hover:bg-[#A84E30] text-[11px] font-bold shadow-xs cursor-pointer"
                              >
                                Cobrar Link
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UP-SELLING EN RECORDATORIO */}
      {activeTab === 'UPSELL' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#BE5A38] text-[11px] font-bold border border-rose-200 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Monetización de Recordatorios (24h)</span>
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                  Catálogo de Servicios Rápidos para Up-Selling
                </h3>
                <p className="text-xs text-[#78716C]">
                  Al enviar el recordatorio, el sistema sugiere estos servicios de alta conversión. Al confirmar con "SI", se cargan automáticamente a la cuenta del cliente.
                </p>
              </div>
            </div>

            {/* Upsell catalog cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upsellItemsList.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#BE5A38] border border-[#E8DFD8]">
                        {item.category} • {item.durationMinutes} min
                      </span>
                      <span className="text-base font-extrabold text-[#1C1917]">${item.price} MXN</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1C1917] mt-2">{item.name}</h4>
                    <p className="text-xs text-[#57534E] mt-1">{item.description}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E8DFD8] text-[11px] text-[#44403C] italic">
                    "{item.popularPrompt}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Upsell Simulator for 24h Reminder */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4">
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
              Simulador de Interacción de WhatsApp de 24 Horas
            </h3>
            <p className="text-xs text-[#78716C]">
              Observa cómo la clienta recibe la propuesta y cómo se añade al Ticket en Espera al responder afirmativamente:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* WhatsApp chat box */}
              <div className="bg-[#EFEAE2] p-4 rounded-3xl border border-[#D9D3CA] space-y-3 font-sans">
                <div className="flex items-center gap-2 border-b border-[#D9D3CA] pb-2 text-xs font-bold text-emerald-900">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>WhatsApp Business — GestiBella</span>
                </div>

                {/* Bot Message */}
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-xs text-xs space-y-1.5 max-w-[85%]">
                  <p className="font-bold text-[#1C1917]">GestiBella Salón:</p>
                  <p className="text-[#374151]">
                    Hola {selectedApt?.clientName || 'Mariana'} ✨ Te recordamos que vienes mañana para tu {selectedApt?.serviceName || 'Corte'} a las {selectedApt?.time || '10:00'} hrs con {selectedStaff?.name || 'Valentina'}.
                  </p>
                  <p className="text-[#BE5A38] font-bold pt-1">
                    ¿Te gustaría agregar una Hidratación Molecular Exprés con Olaplex por solo $280 extra? Responde SI para incluirla.
                  </p>
                  <span className="text-[10px] text-gray-400 block text-right">10:00 AM</span>
                </div>

                {/* Client Response */}
                <div className="ml-auto bg-[#D9FDD3] p-3 rounded-2xl rounded-tr-none shadow-xs text-xs space-y-1 max-w-[70%] text-right">
                  <p className="text-[#111827] font-semibold">
                    {selectedApt?.upsellAccepted ? '¡SI, por favor agréguenla!' : 'Pendiente de respuesta'}
                  </p>
                  <span className="text-[10px] text-emerald-700">10:02 AM • Leído ✓✓</span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="space-y-4">
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] text-xs space-y-2">
                  <p className="font-bold text-[#1C1917]">Cita Seleccionada: {selectedApt?.clientName}</p>
                  <p className="text-[#57534E]">
                    Estado de Up-Selling: {selectedApt?.upsellAccepted ? (
                      <span className="font-bold text-emerald-600">✓ Aceptado (+${selectedApt.upsellItemPrice} {selectedApt.upsellItemName})</span>
                    ) : (
                      <span className="text-[#78716C]">Sin servicio adicional aún</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    id="btn-toggle-upsell"
                    onClick={() => selectedApt && toggleAppointmentUpsell(selectedApt.id, 'up-1')}
                    className="flex-1 py-3 bg-[#BE5A38] text-white text-xs font-bold rounded-2xl shadow-sm hover:bg-[#A84E30] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{selectedApt?.upsellAccepted ? 'Remover Up-Selling' : 'Simular Respuesta "SI" del Cliente'}</span>
                  </button>

                  <button
                    onClick={() => selectedApt && convertAppointmentToOpenTicket(selectedApt.id)}
                    className="px-4 py-3 bg-white text-[#1C1917] border border-[#E8DFD8] text-xs font-bold rounded-2xl hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  >
                    Abrir Cuenta POS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WAITLIST */}
      {activeTab === 'WAITLIST' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Reocupación de Cancelaciones</span>
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                  Cola Inteligente de Lista de Espera (Smart Waitlist)
                </h3>
                <p className="text-xs text-[#78716C]">
                  Si un cliente cancela, el sistema busca coincidencias por servicio y estilista para despachar avisos por WhatsApp en menos de 3 segundos.
                </p>
              </div>

              <button
                onClick={() => setWaitlistModalOpen(true)}
                className="px-4 py-2.5 bg-[#BE5A38] text-white text-xs font-bold rounded-2xl shadow-sm hover:bg-[#A84E30] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Clienta</span>
              </button>
            </div>

            {/* Waitlist Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFD8] text-[#78716C] font-bold">
                    <th className="py-3 px-3">Clienta</th>
                    <th className="py-3 px-3">Servicio Solicitado</th>
                    <th className="py-3 px-3">Estilista Preferido</th>
                    <th className="py-3 px-3">Fecha & Rango Deseado</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-3">Notas</th>
                    <th className="py-3 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8E1]">
                  {waitlistEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#78716C]">
                        No hay clientas en lista de espera actualmente.
                      </td>
                    </tr>
                  ) : (
                    waitlistEntries.map((entry) => {
                      const staff = staffList.find((s) => s.id === entry.preferredStaffId);
                      return (
                        <tr key={entry.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3 px-3 font-bold text-[#1C1917]">
                            {entry.clientName}
                            <p className="text-[10px] font-normal text-[#78716C]">{entry.clientPhone}</p>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#BE5A38]">{entry.serviceName}</td>
                          <td className="py-3 px-3 text-[#44403C]">
                            {entry.preferredStaffId === 'ANY' ? (
                              <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-bold text-gray-700">Cualquiera disponible</span>
                            ) : (
                              staff?.name || 'Staff'
                            )}
                          </td>
                          <td className="py-3 px-3 text-[#57534E]">
                            {entry.preferredDate} ({entry.preferredTimeRange})
                          </td>
                          <td className="py-3 px-3">
                            {entry.status === 'WAITING' && (
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[10px]">
                                En Espera
                              </span>
                            )}
                            {entry.status === 'NOTIFIED' && (
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-[10px] flex items-center gap-1 w-fit">
                                <Send className="w-2.5 h-2.5" /> Notificada ({entry.lastNotifiedAt})
                              </span>
                            )}
                            {entry.status === 'BOOKED' && (
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                                ✓ Cita Asignada
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-[#78716C] text-[11px] max-w-xs truncate">
                            {entry.notes || '—'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex gap-1.5">
                              {entry.status !== 'BOOKED' && (
                                <>
                                  <button
                                    onClick={() => notifyWaitlistClient(entry.id)}
                                    title="Notificar por WhatsApp"
                                    className="p-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 cursor-pointer"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => bookWaitlistToAppointment(entry.id, entry.preferredDate || '2026-08-25', '16:00', entry.preferredStaffId === 'ANY' ? 'staff-1' : entry.preferredStaffId)}
                                    title="Asignar Cita Directa"
                                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-[11px] cursor-pointer"
                                  >
                                    Agendar
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => removeWaitlistEntry(entry.id)}
                                title="Eliminar"
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cancellation & Auto-Dispatch Live Simulator */}
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8DFD8] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#BE5A38]">
              <Zap className="w-4 h-4" />
              <span>Simulador de Cancelación & Reocupación Automática</span>
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
              Simular Cancelación de Cita con 24 Horas de Anticipación
            </h4>
            <p className="text-xs text-[#57534E]">
              Elige una cita para cancelarla y comprueba cómo el sistema detecta de inmediato a las candidatas de la lista de espera y despacha el aviso prioritario:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {appointmentsList
                .filter((a) => a.status === 'CONFIRMED' || a.status === 'IN_CHAIR')
                .slice(0, 3)
                .map((apt) => (
                  <div key={apt.id} className="bg-white p-4 rounded-2xl border border-[#E8DFD8] flex flex-col justify-between space-y-3">
                    <div>
                      <p className="font-bold text-xs text-[#1C1917]">{apt.clientName}</p>
                      <p className="text-[11px] text-[#BE5A38] font-semibold">{apt.serviceName}</p>
                      <p className="text-[10px] text-[#78716C]">{apt.date} a las {apt.time} hrs</p>
                    </div>
                    <button
                      onClick={() => handleSimulateCancellation(apt.id)}
                      className="w-full py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Cancelar Cita & Disparar Waitlist</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-6 max-w-3xl">
          <div className="border-b border-[#F0E8E1] pb-3">
            <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
              Parámetros Globales del Módulo Anti Inasistencias
            </h3>
            <p className="text-xs text-[#78716C]">
              Ajusta las políticas automáticas del salón para anticipos, calendarios y recordatorios.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8]">
              <div>
                <p className="font-bold text-[#1C1917]">Exigir Anticipo / Depósito Obligatorio</p>
                <p className="text-[#78716C]">Solicita porcentaje de seña al agendar servicios de alto costo.</p>
              </div>
              <input
                type="checkbox"
                checked={antiNoShowSettings.depositsEnabled}
                onChange={(e) => updateAntiNoShowSettings({ depositsEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#BE5A38] rounded cursor-pointer"
              />
            </div>

            {/* Percentage & Min Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#44403C] mb-1">Porcentaje de Anticipo (%):</label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={antiNoShowSettings.depositPercentage}
                  onChange={(e) => updateAntiNoShowSettings({ depositPercentage: Number(e.target.value) })}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">Monto Mínimo de Servicio ($ MXN):</label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={antiNoShowSettings.minimumServicePriceForDeposit}
                  onChange={(e) => updateAntiNoShowSettings({ minimumServicePriceForDeposit: Number(e.target.value) })}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917]"
                />
              </div>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8]">
              <div>
                <p className="font-bold text-[#1C1917]">Generar Archivo .ICS de Calendario</p>
                <p className="text-[#78716C]">Adjuntar archivo iCalendar en confirmaciones de WhatsApp y correo.</p>
              </div>
              <input
                type="checkbox"
                checked={antiNoShowSettings.icsCalendarAttachmentEnabled}
                onChange={(e) => updateAntiNoShowSettings({ icsCalendarAttachmentEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#BE5A38] rounded cursor-pointer"
              />
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8]">
              <div>
                <p className="font-bold text-[#1C1917]">Disparo Automático de Lista de Espera</p>
                <p className="text-[#78716C]">Notificar en tiempo real al cancelar una cita con 24h de antelación.</p>
              </div>
              <input
                type="checkbox"
                checked={antiNoShowSettings.automatedWaitlistTriggerEnabled}
                onChange={(e) => updateAntiNoShowSettings({ automatedWaitlistTriggerEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#BE5A38] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Waitlist Entry */}
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-[#E8DFD8] shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#F0E8E1] pb-3">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
                Añadir Clienta a Lista de Espera
              </h3>
              <button
                onClick={() => setWaitlistModalOpen(false)}
                className="p-1 text-[#78716C] hover:text-[#1C1917] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWaitlistEntry} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Alejandra Morales Solís"
                  value={newWaitlistName}
                  onChange={(e) => setNewWaitlistName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-[#1C1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">Teléfono / WhatsApp:</label>
                <input
                  type="tel"
                  required
                  placeholder="+52 55 1234 5678"
                  value={newWaitlistPhone}
                  onChange={(e) => setNewWaitlistPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-[#1C1917] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Servicio de Interés:</label>
                  <select
                    value={newWaitlistServiceId}
                    onChange={(e) => setNewWaitlistServiceId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-[#1C1917] font-semibold focus:outline-none"
                  >
                    {servicesList.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} (${srv.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Especialista Preferido:</label>
                  <select
                    value={newWaitlistStaffId}
                    onChange={(e) => setNewWaitlistStaffId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-[#1C1917] font-semibold focus:outline-none"
                  >
                    <option value="ANY">Cualquiera disponible</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Fecha Preferida:</label>
                  <input
                    type="date"
                    value={newWaitlistDate}
                    onChange={(e) => setNewWaitlistDate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-[#1C1917] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Horario Preferido:</label>
                  <select
                    value={newWaitlistTimeRange}
                    onChange={(e) => setNewWaitlistTimeRange(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-[#1C1917] focus:outline-none"
                  >
                    <option value="Mañana (10:00 - 14:00)">Mañana (10:00 - 14:00)</option>
                    <option value="Tarde (15:00 - 18:00)">Tarde (15:00 - 18:00)</option>
                    <option value="Noche (18:00 - 20:00)">Noche (18:00 - 20:00)</option>
                    <option value="Cualquier horario">Cualquier horario</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">Notas de Urgencia:</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Tiene un evento el sábado, avisar de inmediato si se cancela."
                  value={newWaitlistNotes}
                  onChange={(e) => setNewWaitlistNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DFD8] rounded-xl px-3 py-2 text-[#1C1917] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWaitlistModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#FAF7F2] text-[#78716C] font-bold rounded-xl border border-[#E8DFD8] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#BE5A38] text-white font-bold rounded-xl shadow-sm hover:bg-[#A84E30] cursor-pointer"
                >
                  Guardar en Espera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
