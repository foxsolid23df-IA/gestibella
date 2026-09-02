import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Receipt,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  Scissors,
  Users,
  ShieldCheck,
  Zap,
  Play,
  MessageCircle
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

const WHATSAPP_URL = 'https://wa.me/526148429914?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20sobre%20GestiBella%20SaaS%20para%20mi%20negocio%20de%20belleza.';

export const Hero: React.FC = () => {
  const { setIsLoginModalOpen, setIsPortalOpen, setPortalModule } = useSalon();
  const [activeTabPreview, setActiveTabPreview] = useState<'ticket' | 'agenda' | 'formula'>('ticket');

  const handleOpenERP = () => {
    setIsPortalOpen(true);
  };

  return (
    <section id="inicio" className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Warm Ambient Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#BE5A38]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BE5A38]/10 border border-[#BE5A38]/20 text-[#BE5A38] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Software Exclusivo para Salones, Barberías y Spas</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1917] leading-[1.15] tracking-tight">
              Control total de tu salón con{' '}
              <span className="bg-gradient-to-r from-[#BE5A38] via-[#D97706] to-[#BE5A38] bg-clip-text text-transparent italic">
                Agenda, POS y Fórmulas
              </span>{' '}
              en perfecta armonía.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#57534E] leading-relaxed max-w-2xl">
              Diseñado con rigor para las operaciones diarias de belleza. Gestiona citas enlazadas a proyecciones de venta, cuentas abiertas con <strong>Ticket en Espera</strong>, fórmulas exactas de colorimetría y cálculo automático de comisiones para tu personal.
            </p>

            {/* Highlight Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#44403C]">
                <CheckCircle2 className="w-4 h-4 text-[#BE5A38] shrink-0" />
                <span>Ticket en espera durante la cita</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#44403C]">
                <CheckCircle2 className="w-4 h-4 text-[#BE5A38] shrink-0" />
                <span>Expediente técnico con fórmulas</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#44403C]">
                <CheckCircle2 className="w-4 h-4 text-[#BE5A38] shrink-0" />
                <span>Cálculo de comisiones en segundos</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-[#44403C]">
                <CheckCircle2 className="w-4 h-4 text-[#BE5A38] shrink-0" />
                <span>Uso exclusivo del staff (sin portal cliente)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                id="btn-hero-open-erp"
                onClick={handleOpenERP}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#BE5A38] to-[#D97706] hover:from-[#A84E30] hover:to-[#B45309] shadow-lg shadow-[#BE5A38]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Entrar al Portal del Salón</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                id="btn-hero-whatsapp"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-base font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                <span>Solicitar Info por WhatsApp</span>
              </a>

              <button
                id="btn-hero-login"
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold text-[#8D5B4C] bg-white hover:bg-[#F4EFEA] border border-[#D8C3B5] shadow-sm transition-all"
              >
                <Users className="w-4 h-4 text-[#BE5A38]" />
                <span>Personal</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 border-t border-[#E8DFD8] grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-extrabold text-[#BE5A38]">+850</p>
                <p className="text-xs text-[#78716C] font-medium">Salones y spas activos</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1C1917]">100%</p>
                <p className="text-xs text-[#78716C] font-medium">Comisiones exactas</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#D97706]">-25%</p>
                <p className="text-xs text-[#78716C] font-medium">Menos mermas de tinte</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live App Mockup Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#E8DFD8] relative">
              {/* Top Mockup Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E8E1]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E07A5F]" />
                  <div className="w-3 h-3 rounded-full bg-[#F4A261]" />
                  <div className="w-3 h-3 rounded-full bg-[#E76F51]" />
                  <span className="ml-2 text-xs font-bold text-[#78716C]">GestiBella ERP v2.4</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-emerald-100 text-emerald-800 uppercase">
                  Online
                </span>
              </div>

              {/* Interactive Tabs inside Mockup */}
              <div className="flex gap-1.5 p-1 bg-[#FAF7F2] rounded-xl my-4 border border-[#E8DFD8]">
                <button
                  id="tab-preview-ticket"
                  onClick={() => setActiveTabPreview('ticket')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTabPreview === 'ticket'
                      ? 'bg-white text-[#BE5A38] shadow-sm'
                      : 'text-[#78716C] hover:text-[#292524]'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Ticket Espera</span>
                </button>
                <button
                  id="tab-preview-agenda"
                  onClick={() => setActiveTabPreview('agenda')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTabPreview === 'agenda'
                      ? 'bg-white text-[#BE5A38] shadow-sm'
                      : 'text-[#78716C] hover:text-[#292524]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agenda Hoy</span>
                </button>
                <button
                  id="tab-preview-formula"
                  onClick={() => setActiveTabPreview('formula')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTabPreview === 'formula'
                      ? 'bg-white text-[#BE5A38] shadow-sm'
                      : 'text-[#78716C] hover:text-[#292524]'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Fórmula Color</span>
                </button>
              </div>

              {/* Mockup Dynamic Content */}
              {activeTabPreview === 'ticket' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#FDFBF7] p-3 rounded-xl border border-[#F3ECE6]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917]">Mariana Garza</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                          En Sillón #1
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78716C]">Estilista: Valentina Rossi</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#BE5A38]">TKT-2026-089</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-dashed border-[#E8DFD8]">
                      <span className="text-[#44403C]">1x Balayage Signature</span>
                      <span className="font-semibold text-[#1C1917]">$2,400</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed border-[#E8DFD8] text-[#BE5A38] font-medium">
                      <span>+ 1x Olaplex No.4 & 5 (Agregado en sillón)</span>
                      <span>$990</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm font-bold">
                      <span>Total en Espera:</span>
                      <span className="text-[#BE5A38]">$3,390</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={handleOpenERP}
                      className="flex-1 py-2 text-xs font-bold text-white bg-[#BE5A38] rounded-xl hover:bg-[#A84E30] transition-colors"
                    >
                      Cobrar en POS
                    </button>
                  </div>
                </div>
              )}

              {activeTabPreview === 'agenda' && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#78716C] pb-1">
                    <span className="font-bold text-[#1C1917]">Hoy, 4 Citas Programadas</span>
                    <span className="text-[#2A9D8F] font-bold">Proyección: $4,520</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-950">10:00 - Mariana Garza</p>
                      <p className="text-[11px] text-emerald-800">Balayage Signature (Valentina R.)</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-200 text-emerald-900 rounded-full">
                      En Sillón
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#292524]">14:00 - Carolina Benítez</p>
                      <p className="text-[11px] text-[#78716C]">Manicura Spa Rusa (Camila M.)</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                      Confirmada
                    </span>
                  </div>
                </div>
              )}

              {activeTabPreview === 'formula' && (
                <div className="space-y-2 text-xs bg-[#FDFBF7] p-3 rounded-2xl border border-[#EFE5DC]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#BE5A38]">Expediente de Colorimetría</span>
                    <span className="text-[10px] text-[#78716C]">15 Jul 2026</span>
                  </div>
                  <p className="text-[#1C1917] font-semibold text-xs">Fórmula: Balayage Rubio Manteca</p>
                  <p className="text-[11px] text-[#57534E] font-mono bg-white p-2 rounded-lg border border-[#E8DFD8]">
                    Decoloración Wella Blondor + 20 Vol (1:2) + Olaplex #1. Matiz: 45g Igora 9-1 + 15g 8-4 + 6 Vol (18 min).
                  </p>
                  <p className="text-[10px] text-[#78716C] italic">Aclaró nivel 9 sin reflejos cobrizos.</p>
                </div>
              )}

              {/* Footer inside mockup */}
              <div className="mt-4 pt-3 border-t border-[#F0E8E1] flex items-center justify-between text-[11px] text-[#78716C]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2A9D8F]" />
                  Aislamiento Multi-tenant Seguro
                </span>
                <span className="font-bold text-[#BE5A38] cursor-pointer hover:underline" onClick={handleOpenERP}>
                  Abrir Demo Completa →
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
