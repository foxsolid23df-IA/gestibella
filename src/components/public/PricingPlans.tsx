import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Zap,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Clock,
  Coins,
  MessageCircle
} from 'lucide-react';
import { SOFTWARE_PLANS } from '../../data/initialData';
import { useSalon } from '../../context/SalonContext';

const WHATSAPP_URL = 'https://wa.me/526148429914?text=Hola%2C%20quisiera%20cotizar%20un%20plan%20a%20la%20medida%20de%20GestiBella%20para%20mi%20cadena%20de%20salones.';

export const PricingPlans: React.FC = () => {
  const { setIsLoginModalOpen, setIsPortalOpen } = useSalon();
  const [isAnnual, setIsAnnual] = useState(true);

  // ROI Calculator State
  const [stylistCount, setStylistCount] = useState(5);
  const [servicesPerMonth, setServicesPerMonth] = useState(280);
  const [chemicalWasteReduction, setChemicalWasteReduction] = useState(20); // 20% ahorro

  // Calculated Savings
  const hoursSavedInCommissions = Math.round(stylistCount * 3.5); // ~3.5 hrs por estilista al mes en cuentas manuales
  const moneySavedInWaste = Math.round(servicesPerMonth * 35 * (chemicalWasteReduction / 100)); // ~$35 gasto promedio de tinte por servicio
  const extraRevenueUpsell = Math.round(servicesPerMonth * 0.22 * 450); // 22% de tickets aceptan add-on de $450 por ticket en espera

  return (
    <section id="planes" className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8DFD8] text-[#BE5A38] text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5" />
            <span>Precios Transparentes & Sin Comisiones Ocultas</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
            Planes Diseñados para Escalar tu Salón
          </h2>
          <p className="text-[#78716C] text-base sm:text-lg">
            Software de uso exclusivo del personal. Sin cobros por cliente agendado ni límites sorpresa.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center bg-white p-1.5 rounded-full border border-[#E8DFD8] shadow-sm mt-4">
            <button
              id="btn-billing-monthly"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                !isAnnual
                  ? 'bg-[#BE5A38] text-white shadow-sm'
                  : 'text-[#78716C] hover:text-[#292524]'
              }`}
            >
              Pago Mensual
            </button>
            <button
              id="btn-billing-annual"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-[#BE5A38] text-white shadow-sm'
                  : 'text-[#78716C] hover:text-[#292524]'
              }`}
            >
              <span>Pago Anual</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase">
                Ahorra 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 items-stretch">
          {SOFTWARE_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnualMonthly : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                id={`card-${plan.id}`}
                className={`rounded-3xl p-8 transition-all flex flex-col justify-between relative ${
                  plan.isPopular
                    ? 'bg-white border-2 border-[#BE5A38] shadow-xl ring-4 ring-[#BE5A38]/10'
                    : 'bg-white border border-[#E8DFD8] shadow-sm hover:shadow-md'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    El Más Elegido por Salones
                  </div>
                )}

                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#78716C] mt-2 min-h-[36px]">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-6 pb-6 border-b border-[#F0E8E1] flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[#78716C]">$</span>
                    <span className="text-4xl sm:text-5xl font-extrabold text-[#1C1917] tracking-tight">
                      {price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#78716C] font-semibold">
                      MXN / mes
                    </span>
                  </div>

                  <div className="py-4 space-y-1 text-xs">
                    <p className="font-bold text-[#BE5A38]">
                      👥 {plan.maxStaff}
                    </p>
                    <p className="text-[#78716C]">
                      🎧 {plan.supportLevel}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#44403C]">
                        <Check className="w-4 h-4 text-[#BE5A38] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#F0E8E1]">
                  <button
                    id={`btn-plan-${plan.id}`}
                    onClick={() => setIsPortalOpen(true)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] shadow-md shadow-[#BE5A38]/25'
                        : 'bg-[#FAF7F2] text-[#8D5B4C] hover:bg-[#F0E8E1] border border-[#D8C3B5]'
                    }`}
                  >
                    <span>Comenzar Prueba Gratis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-[#A8A29E] text-center mt-2">
                    Sin tarjeta requerida • 14 días de prueba
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Plan / WhatsApp Advisory Banner */}
        <div className="mt-10 bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8DFD8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
              <MessageCircle className="w-6 h-6 fill-emerald-600 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917]">¿Tienes más de 3 sucursales o necesitas migrar tu base de datos?</h4>
              <p className="text-xs text-[#78716C]">Escríbenos por WhatsApp al <strong>+52 614 842 9914</strong> para un plan empresarial con onboarding presencial o remoto.</p>
            </div>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>

        {/* Interactive ROI Calculator */}
        <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD8] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Calculator Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8]">
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculadora de Retorno de Inversión (ROI)</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
                ¿Cuánto tiempo y dinero ahorras con GestiBella?
              </h3>
              <p className="text-sm text-[#78716C]">
                Ajusta las cifras de tu salón y descubre cómo se amortiza el software desde el primer mes:
              </p>

              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#44403C]">Colaboradores (Estilistas / Terapeutas):</span>
                  <span className="text-[#BE5A38]">{stylistCount} profesionales</span>
                </div>
                <input
                  id="slider-stylists"
                  type="range"
                  min={1}
                  max={25}
                  value={stylistCount}
                  onChange={(e) => setStylistCount(Number(e.target.value))}
                  className="w-full accent-[#BE5A38] cursor-pointer"
                />
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#44403C]">Servicios Totales al Mes:</span>
                  <span className="text-[#BE5A38]">{servicesPerMonth} citas</span>
                </div>
                <input
                  id="slider-services"
                  type="range"
                  min={50}
                  max={1200}
                  step={10}
                  value={servicesPerMonth}
                  onChange={(e) => setServicesPerMonth(Number(e.target.value))}
                  className="w-full accent-[#BE5A38] cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#FAF7F2] to-[#F3ECE6] rounded-2xl p-6 sm:p-8 border border-[#E8DFD8] space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8D5B4C]">
                Beneficio Estimado Mensual
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E8DFD8]">
                  <div className="flex items-center gap-2 text-[#BE5A38] mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Tiempo Ahorrado</span>
                  </div>
                  <p className="text-2xl font-extrabold text-[#1C1917]">
                    {hoursSavedInCommissions} hrs/mes
                  </p>
                  <p className="text-[11px] text-[#78716C] mt-0.5">En cálculo de comisiones</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E8DFD8]">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Coins className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Ahorro en Mermas</span>
                  </div>
                  <p className="text-2xl font-extrabold text-emerald-700">
                    ${moneySavedInWaste.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Control de gramaje de tintes</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8DFD8] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1C1917]">Ingresos Extra por "Ticket en Espera":</p>
                  <p className="text-[11px] text-[#78716C]">Ventas cruzadas de tratamientos y retail en sillón</p>
                </div>
                <p className="text-xl font-extrabold text-[#BE5A38]">
                  +${extraRevenueUpsell.toLocaleString()} MXN
                </p>
              </div>

              <button
                id="btn-roi-cta"
                onClick={() => setIsPortalOpen(true)}
                className="w-full py-3 bg-[#BE5A38] hover:bg-[#A84E30] text-white text-xs font-bold rounded-xl transition-colors text-center shadow-sm"
              >
                Comenzar a Optimizar mi Salón Ahora
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
