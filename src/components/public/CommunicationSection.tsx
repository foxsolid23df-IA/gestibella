import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Send,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

const WHATSAPP_NUMBER = '526148429914';
const WHATSAPP_FORMATTED = '+52 614 842 9914';

export const CommunicationSection: React.FC = () => {
  const { addToast } = useSalon();
  
  // Contact Form State
  const [salonName, setSalonName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [salonCity, setSalonCity] = useState('');
  const [staffSize, setStaffSize] = useState('3-8');
  const [sentSuccess, setSentSuccess] = useState(false);

  // WhatsApp Simulator Chat
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    {
      sender: 'bot',
      text: '¡Hola! Bienvenido al canal oficial de atención de GestiBella 🌸 ¿Te gustaría recibir información de planes o agendar una demo guiada de 15 min?',
      time: '12:00'
    }
  ]);

  const handleOpenWhatsApp = (customText?: string) => {
    const textToSend = customText || `¡Hola! Me comunico desde la web de GestiBella para solicitar información sobre el software SaaS para mi salón/spa.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // FAQs Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Por qué los clientes finales no tienen acceso a este portal?',
      a: 'GestiBella está diseñado exclusivamente como un software ERP de operación interna para el equipo del salón (recepción, estilistas, gerencia). La agenda, el registro de fórmulas secretas de colorimetría y las comisiones son operadas directamente por tu personal para garantizar máxima privacidad y control de flujo.'
    },
    {
      q: '¿Cómo funciona exactamente la función de "Ticket en Espera"?',
      a: 'Cuando una clienta llega al salón, el recepcionista o estilista abre su ticket. Durante el servicio, si la clienta pide un tratamiento capilar express en el lavacabezas o compra un shampoo de vitrina, el personal añade los ítems a la cuenta abierta. Al terminar, se cobra todo en un solo ticket.'
    },
    {
      q: '¿Puedo cambiar las fórmulas de colorimetría desde mi celular o tablet?',
      a: '¡Sí! GestiBella es 100% responsive en tablets, iPad y smartphones. Tus coloristas pueden llevar una tablet al área técnica para registrar los gramos exactos y consultar el histórico de fórmulas de cada clienta.'
    },
    {
      q: '¿Cómo se calculan las comisiones de mi personal?',
      a: 'Puedes asignar a cada empleado un porcentaje para servicios (ej. 45%) y un porcentaje para venta de retail (ej. 15%). El sistema calcula automáticamente la ganancia en tiempo real cada vez que se liquida un ticket.'
    },
    {
      q: '¿Cómo contacto a un asesor comercial para cotizaciones especiales?',
      a: 'Puedes escribirnos directamente a nuestro WhatsApp oficial +52 614 842 9914 para recibir atención personalizada, cotizaciones multi-sucursal y demostraciones guiadas por videollamada.'
    }
  ];

  const handleSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName || !contactName || !contactPhone) {
      addToast('warning', 'Campos Incompletos', 'Por favor llena los datos principales de tu salón.');
      return;
    }
    setSentSuccess(true);
    addToast('success', 'Solicitud Recibida', 'Un asesor especialista se comunicará contigo vía WhatsApp en menos de 10 minutos.');
  };

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: nowTime }]);
    setChatMessage('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `¡Excelente consulta! Para darte respuesta inmediata y enviarte precios en PDF, haz clic en el botón verde de abajo para continuar por WhatsApp directo (+52 614 842 9914).`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 800);
  };

  return (
    <section id="comunicacion" className="py-20 bg-white border-b border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD8] text-[#BE5A38] text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comunicación Directa & Soporte</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
            Estamos Listos para Atenderte
          </h2>
          <p className="text-[#78716C] text-base sm:text-lg">
            Habla con un asesor directamente por WhatsApp, solicita una sesión personalizada de onboarding o resuelve tus dudas operativas.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-14">
          
          {/* Left Column: WhatsApp Simulator & Contact Channels */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Live WhatsApp Bot Simulator Card */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E8DFD8] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                    <MessageCircle className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1C1917]">WhatsApp Asesoría GestiBella</h4>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {WHATSAPP_FORMATTED} • En línea
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                  Respuesta Inmediata
                </span>
              </div>

              {/* Chat Messages Body */}
              <div className="h-48 overflow-y-auto space-y-3 p-3 my-3 bg-[#EDE5DD]/40 rounded-2xl">
                {chatMessages.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#BE5A38] text-white rounded-br-none'
                          : 'bg-white text-[#292524] rounded-bl-none border border-[#E8DFD8]'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          msg.sender === 'user' ? 'text-white/70' : 'text-[#78716C]'
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 mb-3">
                <input
                  id="input-chat-whatsapp"
                  type="text"
                  placeholder="Escribe tu duda sobre GestiBella..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 bg-white border border-[#D8C3B5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#BE5A38]"
                />
                <button
                  id="btn-send-whatsapp-chat"
                  onClick={handleSendChatMessage}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct WhatsApp Callout Button */}
              <button
                onClick={() => handleOpenWhatsApp()}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chatear por WhatsApp al {WHATSAPP_FORMATTED}</span>
              </button>
            </div>

            {/* Direct Info Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20GestiBella%2C%20quisiera%20solicitar%20informaci%C3%B3n%20sobre%20el%20SaaS`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#FAF7F2] hover:bg-emerald-50/60 rounded-2xl border border-[#E8DFD8] hover:border-emerald-300 flex items-center gap-3 transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 border border-[#E8DFD8] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-[#78716C] font-semibold">WhatsApp Oficial</p>
                  <p className="text-xs font-bold text-emerald-800 group-hover:text-emerald-900">{WHATSAPP_FORMATTED}</p>
                </div>
              </a>

              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#BE5A38] flex items-center justify-center shrink-0 border border-[#E8DFD8]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-[#78716C] font-semibold">Correo de Soporte</p>
                  <p className="text-xs font-bold text-[#1C1917]">contacto@gestibella.com</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Demo Request Form */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#E8DFD8] shadow-sm">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
                Solicitar Demostración Guiada
              </h3>
              <p className="text-xs text-[#78716C] mt-1 mb-6">
                Te mostraremos en 15 min cómo cargar tus estilistas, configurar comisiones y usar el Ticket en Espera.
              </p>

              {sentSuccess ? (
                <div className="p-6 bg-white rounded-2xl border border-emerald-300 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-base text-[#1C1917]">¡Solicitud Enviada con Éxito!</h4>
                  <p className="text-xs text-[#57534E]">
                    Un especialista en salones se pondrá en contacto al <strong>{contactPhone}</strong> para agendar tu sesión.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => handleOpenWhatsApp(`Hola GestiBella, soy ${contactName} de ${salonName}. Acabo de solicitar la demo y me gustaría agendar la hora.`)}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Abrir WhatsApp Ahora</span>
                    </button>
                    <button
                      onClick={() => setSentSuccess(false)}
                      className="px-4 py-2.5 text-xs font-bold text-[#BE5A38] bg-[#FAF7F2] hover:bg-[#F0E8E1] rounded-xl border border-[#E8DFD8]"
                    >
                      Enviar otra consulta
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendForm} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Nombre de tu Salón / Spa / Barbería
                    </label>
                    <input
                      id="form-salon-name"
                      type="text"
                      required
                      placeholder="Ej. Studio Bella & Spa Polanco"
                      value={salonName}
                      onChange={(e) => setSalonName(e.target.value)}
                      className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        Tu Nombre (Dueño/Gerente)
                      </label>
                      <input
                        id="form-contact-name"
                        type="text"
                        required
                        placeholder="Ej. Valentina Rossi"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        WhatsApp de Contacto
                      </label>
                      <input
                        id="form-contact-phone"
                        type="tel"
                        required
                        placeholder="+52 614 123 4567"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        Ciudad / País
                      </label>
                      <input
                        id="form-city"
                        type="text"
                        placeholder="Ej. Chihuahua / CDMX / Monterrey"
                        value={salonCity}
                        onChange={(e) => setSalonCity(e.target.value)}
                        className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#44403C] mb-1">
                        Número de Colaboradores
                      </label>
                      <select
                        id="form-staff-size"
                        value={staffSize}
                        onChange={(e) => setStaffSize(e.target.value)}
                        className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                      >
                        <option value="1-2">1 a 2 profesionales</option>
                        <option value="3-8">3 a 8 profesionales (Salón Pro)</option>
                        <option value="9-20">9 a 20 profesionales</option>
                        <option value="20+">Cadena / Más de 20</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="btn-submit-demo-form"
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-md hover:from-[#A84E30] hover:to-[#B45309] transition-all cursor-pointer mt-2"
                  >
                    Solicitar Demo VIP & Contacto Inmediato
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-[#78716C] flex items-center justify-center gap-1.5">
                      <span>¿Prefieres atención inmediata?</span>
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp()}
                        className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        <span>Escríbenos al {WHATSAPP_FORMATTED}</span>
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="mt-20 max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-2 mb-8">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Preguntas Frecuentes de Salones
            </h3>
            <p className="text-xs text-[#78716C]">
              Todo lo que necesitas saber antes de implementar GestiBella en tu negocio.
            </p>
          </div>

          {faqs.map((faq, fIdx) => {
            const isOpen = openFaq === fIdx;
            return (
              <div
                key={fIdx}
                className="bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#1C1917] hover:text-[#BE5A38] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#BE5A38] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-[#78716C] transition-transform ${
                      isOpen ? 'rotate-180 text-[#BE5A38]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#57534E] leading-relaxed border-t border-[#E8DFD8]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

