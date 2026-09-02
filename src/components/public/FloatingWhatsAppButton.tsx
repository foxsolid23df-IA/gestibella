import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WHATSAPP_PHONE = '526148429914';
const FORMATTED_PHONE = '+52 614 842 9914';

export const FloatingWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleOpenWhatsApp = (messageText?: string) => {
    const textToSend = messageText || customMsg || '¡Hola! Me gustaría solicitar información sobre GestiBella SaaS para mi salón/spa.';
    const encodedText = encodeURIComponent(textToSend);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const quickQuestions = [
    'Hola, quiero cotizar un plan para mi salón de belleza 💇‍♀️',
    'Hola, me gustaría agendar una demo guiada de GestiBella 📅',
    'Hola, tengo varias sucursales y quiero información multi-sede 🏢',
    'Hola, ¿cómo funciona el control de inventario y fórmulas? 🧪'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Box Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#E8DFD8] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Asesoría GestiBella SaaS</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span>En línea</span> • <span>Respuesta rápida</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100">
              <span>WhatsApp Directo:</span>
              <span className="font-mono font-bold text-white bg-emerald-800/60 px-2 py-0.5 rounded-md">
                {FORMATTED_PHONE}
              </span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#FAF7F2] max-h-80 overflow-y-auto space-y-3">
            {/* Agent Greeting Bubble */}
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                GB
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#E8DFD8] shadow-2xs text-xs text-[#292524] space-y-1.5">
                <p className="font-medium">
                  ¡Hola! 👋 Gracias por tu interés en <strong>GestiBella</strong>.
                </p>
                <p className="text-[#57534E]">
                  Estamos en línea para resolver tus dudas sobre planes, comisiones, agendas y migración para tu salón.
                </p>
                <span className="text-[9px] text-[#A8A29E] block text-right">Hace 1 min</span>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8D5B4C]">
                Preguntas frecuentes de salones:
              </p>
              <div className="space-y-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenWhatsApp(q)}
                    className="w-full text-left text-[11px] bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-[#E8DFD8] p-2.5 rounded-xl transition-all text-[#44403C] hover:text-emerald-800 font-medium flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <span>{q}</span>
                    <Send className="w-3 h-3 text-[#A8A29E] group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input & Direct Action Footer */}
          <div className="p-3 bg-white border-t border-[#E8DFD8] space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOpenWhatsApp()}
                placeholder="Escribe tu mensaje personalizado..."
                className="flex-1 bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={() => handleOpenWhatsApp()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                title="Enviar por WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => handleOpenWhatsApp()}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Solicitar Informes por WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="btn-floating-whatsapp"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
        title="Solicitar información de GestiBella por WhatsApp"
      >
        {/* Pulse Ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-emerald-700"></span>
        </span>

        <div className="w-6 h-6 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-white" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-[10px] uppercase font-extrabold tracking-wider leading-none text-emerald-100">
            ¿Dudas del SaaS?
          </span>
          <span className="block text-xs font-bold leading-tight">
            WhatsApp Asesoría
          </span>
        </div>
      </button>
    </div>
  );
};
