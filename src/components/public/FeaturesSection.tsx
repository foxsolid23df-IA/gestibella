import React, { useState } from 'react';
import {
  Calendar,
  Receipt,
  Package,
  HeartHandshake,
  Users,
  LineChart,
  FlaskConical,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  Wallet,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useSalon, PortalNavModule } from '../../context/SalonContext';

export const FeaturesSection: React.FC = () => {
  const { setIsPortalOpen, setPortalModule } = useSalon();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const features = [
    {
      id: 'agenda',
      portalModule: 'AGENDA' as PortalNavModule,
      icon: Calendar,
      title: '1. Agenda Inteligente & Proyección de Ingresos',
      tagline: 'Vinculada directamente al Punto de Venta para proyectar flujo de caja futuro.',
      description: 'El calendario inteligente de GestiBella no es un simple anotador de horarios. Está estructurado por sillón y especialista, calculando en tiempo real los ingresos esperados del día, semana o mes según las citas agendadas.',
      bullets: [
        'Vistas múltiples: Diaria, Semanal, Mensual y Columnas por Empleado/Sillón.',
        'Conversión instantánea de cita a "Ticket en Espera" con 1 solo clic.',
        'Recordatorios de confirmación automáticos por WhatsApp con respuesta rápida.',
        'Detección de huecos libres para maximizar la ocupación de cabinas.'
      ],
      visualBadge: 'Proyección Financiera Activa',
      accentColor: 'from-[#BE5A38] to-[#E07A5F]'
    },
    {
      id: 'pos',
      portalModule: 'POS' as PortalNavModule,
      icon: Receipt,
      title: '2. Punto de Venta (POS) & "Ticket en Espera"',
      tagline: 'Cuentas abiertas durante la cita para agregar consumos extra y retail sin fricción.',
      description: 'La función estrella para salones: abre la cuenta al recibir al cliente y ve agregando tratamientos en el lavacabezas, bebidas o productos de cuidado en casa antes de cobrarle al salir.',
      bullets: [
        'Función de Ticket en Espera / Cuenta Abierta asignada a sillón.',
        'Cobro dividido: Efectivo, Tarjeta, Transferencia y Puntos de Lealtad.',
        'Venta de Paquetes de Sesiones prepagadas con descuento progresivo.',
        'Emisión e impresión de tickets digitales y desglose de propinas del staff.'
      ],
      visualBadge: 'Ventas Cruzadas +28%',
      accentColor: 'from-[#D97706] to-[#F59E0B]'
    },
    {
      id: 'inventario-formulas',
      portalModule: 'INVENTORY_FORMULAS' as PortalNavModule,
      icon: FlaskConical,
      title: '3. Inventario, Consumo Interno & Fórmulas Técnicas',
      tagline: 'Control exacto de colorimetría y rebaje automático de insumos en cada servicio.',
      description: 'Nunca más pierdas la proporción exacta de tinte de una clienta. Guarda las recetas técnicas de colorimetría (base natural, gramos, volúmenes y tiempo de pose) y descuenta mililitros de oxidante del almacén.',
      bullets: [
        'Expediente técnico de Fórmulas de Colorimetría por cliente con historial.',
        'Descuento automático de stock por consumo interno al finalizar el servicio.',
        'Alertas de máximos y mínimos con semáforo de punto de reorden.',
        'Diferenciación entre productos de consumo interno y productos de venta retail.'
      ],
      visualBadge: '0% Variación en Color',
      accentColor: 'from-[#2A9D8F] to-[#264653]'
    },
    {
      id: 'crm',
      portalModule: 'CRM' as PortalNavModule,
      icon: HeartHandshake,
      title: '4. CRM, Paquetes & Tarjetas de Sellos Virtuales',
      tagline: 'Convierte visitas esporádicas en clientas leales y recurrentes.',
      description: 'Fideliza sin devaluar tu marca con descuentos agresivos. Otorga puntos por cada peso gastado, gestiona tarjetas de sellos virtuales donde la 6ta visita tiene premio y administra membresías prepagadas.',
      bullets: [
        'Perfil 360° del cliente: historial de visitas, total gastado y preferencias.',
        'Tarjeta de Sellos Virtual (ej. acumula 6 visitas y obtén hidratación capilar).',
        'Monedero de Puntos de Lealtad canjeables directamente en el punto de venta.',
        'Billetera de Paquetes de Sesiones con control de saldo restante.'
      ],
      visualBadge: 'Retención de Clientes +45%',
      accentColor: 'from-[#BE5A38] to-[#8D5B4C]'
    },
    {
      id: 'comisiones',
      portalModule: 'STAFF_COMMISSIONS' as PortalNavModule,
      icon: Users,
      title: '5. Recursos Humanos & Comisiones Automáticas',
      tagline: 'Liquida las ganancias de estilistas y terapeutas en 2 segundos sin errores.',
      description: 'Configura porcentajes personalizados de comisión para cada colaborador, diferenciando entre servicios realizados (ej. 45%) y venta de producto en vitrina (ej. 15%). Transparencia total para motivar a tu equipo.',
      bullets: [
        'Cálculo de comisiones automatizado en tiempo real por cada ticket cerrado.',
        'Porcentajes diferenciados: Comisión por Servicio vs Comisión por Retail.',
        'Roles de acceso: Gerente, Estilista/Especialista y Recepción/Caja.',
        'Ranking de productividad y reportes de liquidación descargables.'
      ],
      visualBadge: 'Ahorra 10 hrs/semana en Nómina',
      accentColor: 'from-[#3D5A80] to-[#293241]'
    },
    {
      id: 'finanzas',
      portalModule: 'FINANCES' as PortalNavModule,
      icon: LineChart,
      title: '6. Finanzas, Gastos Operativos & Reportes Gerenciales',
      tagline: 'Claridad financiera total: ingresos, gastos, arqueo de caja y rentabilidad real.',
      description: 'Conoce exactamente la utilidad neta de tu salón tras descontar insumos, comisiones del personal, alquiler y servicios. Toma decisiones estratégicas con dashboards ejecutivos basados en datos.',
      bullets: [
        'Registro categorizado de gastos operativos (Alquiler, Insumos, Nómina, Luz).',
        'Arqueo de caja diario con conciliación de efectivo, tarjetas y transferencias.',
        'Estado de Resultados y Margen de Utilidad Neta en tiempo real.',
        'Métricas clave: Ticket promedio, ocupación de sillones y servicios más rentables.'
      ],
      visualBadge: 'Visión Financiera 360°',
      accentColor: 'from-[#E07A5F] to-[#D97706]'
    }
  ];

  const currentFeature = features[activeFeatureIndex];

  const handleOpenModule = (mod: PortalNavModule) => {
    setIsPortalOpen(true);
    setPortalModule(mod);
  };

  return (
    <section id="caracteristicas" className="py-20 bg-white border-y border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD8] text-[#BE5A38] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Módulos de Alto Rendimiento</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
            Los 6 Pilares Operativos de GestiBella
          </h2>
          <p className="text-[#78716C] text-base sm:text-lg">
            Cada funcionalidad fue construida resolviendo los dolores reales de salones de belleza, barberías y centros de spa.
          </p>
        </div>

        {/* Feature Nav Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-10">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isSelected = activeFeatureIndex === idx;
            return (
              <button
                key={feat.id}
                id={`btn-pillar-${feat.id}`}
                onClick={() => setActiveFeatureIndex(idx)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FAF7F2] border-[#BE5A38] shadow-md ring-2 ring-[#BE5A38]/20'
                    : 'bg-white border-[#E8DFD8] hover:border-[#D8C3B5] hover:bg-[#FAF7F2]/50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#BE5A38] text-white'
                        : 'bg-[#F4EFEA] text-[#8D5B4C]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#A8A29E]">0{idx + 1}</span>
                </div>
                <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#BE5A38]' : 'text-[#44403C]'}`}>
                  {feat.title.split('. ')[1]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Interactive Feature Deep Dive Card */}
        <div className="mt-8 bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#E8DFD8] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#BE5A38] border border-[#E8DFD8]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentFeature.visualBadge}</span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1917]">
                {currentFeature.title}
              </h3>

              <p className="text-sm sm:text-base font-semibold text-[#8D5B4C]">
                {currentFeature.tagline}
              </p>

              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                {currentFeature.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentFeature.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#292524]">
                    <div className="w-5 h-5 rounded-full bg-[#BE5A38]/10 text-[#BE5A38] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  id={`btn-open-module-${currentFeature.id}`}
                  onClick={() => handleOpenModule(currentFeature.portalModule)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#BE5A38] hover:bg-[#A84E30] transition-colors shadow-sm"
                >
                  <span>Abrir este Módulo en ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Visual Graphic */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-[#E8DFD8] shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E8E1]">
                  <div className="flex items-center gap-2">
                    <currentFeature.icon className="w-5 h-5 text-[#BE5A38]" />
                    <span className="font-bold text-sm text-[#1C1917]">Vista en Tiempo Real</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Sincronizado
                  </span>
                </div>

                {/* Dynamic Content based on active tab */}
                {activeFeatureIndex === 0 && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#F3ECE6]">
                      <div className="flex justify-between font-bold text-[#1C1917]">
                        <span>Sillón 1 - Valentina Rossi</span>
                        <span className="text-[#BE5A38]">$2,400</span>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-1">10:00 - 13:00 • Balayage Signature</p>
                    </div>
                    <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#F3ECE6]">
                      <div className="flex justify-between font-bold text-[#1C1917]">
                        <span>Sillón 2 - Sebastián Méndez</span>
                        <span className="text-[#BE5A38]">$650</span>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-1">12:30 - 13:30 • Corte & Styling</p>
                    </div>
                  </div>
                )}

                {activeFeatureIndex === 1 && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>Ticket en Espera: Lucía F.</span>
                        <span>$1,430</span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-1">+ Lifting de Pestañas añadido en sillón</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-xl text-center text-[#78716C]">
                      Cobro con Efectivo, Tarjeta o Puntos de Lealtad
                    </div>
                  </div>
                )}

                {activeFeatureIndex === 2 && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <p className="font-bold text-emerald-950">Bitácora de Colorimetría #402</p>
                      <p className="font-mono text-[11px] text-emerald-800 mt-1">45g 7.1 + 15g 8.3 + 90ml 20Vol</p>
                      <p className="text-[10px] text-emerald-700 mt-0.5">Descuento automático de stock: -45g / -90ml</p>
                    </div>
                  </div>
                )}

                {activeFeatureIndex === 3 && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                      <div className="flex justify-between font-bold text-rose-950">
                        <span>Tarjeta de Sellos: Carolina B.</span>
                        <span className="text-[#BE5A38]">6 de 6 Sellos ★</span>
                      </div>
                      <p className="text-[11px] text-rose-800 mt-1">¡Premio listo! Hidratación capilar de cortesía.</p>
                    </div>
                  </div>
                )}

                {activeFeatureIndex === 4 && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                      <div className="flex justify-between font-bold text-indigo-950">
                        <span>Comisión Valentina (Color)</span>
                        <span className="text-indigo-900">$1,200 (50%)</span>
                      </div>
                      <div className="flex justify-between font-bold text-indigo-950 mt-1">
                        <span>Comisión Retail (Olaplex)</span>
                        <span className="text-indigo-900">$148.50 (15%)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureIndex === 5 && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8]">
                      <div className="flex justify-between font-bold text-[#1C1917]">
                        <span>Ingresos Totales Hoy</span>
                        <span className="text-emerald-600 font-bold">$7,970</span>
                      </div>
                      <div className="flex justify-between text-[#78716C] mt-1">
                        <span>Gastos & Comisiones</span>
                        <span className="text-rose-600">-$3,180</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#BE5A38] pt-1.5 border-t border-[#E8DFD8] mt-1">
                        <span>Margen Neto Real</span>
                        <span>$4,790 (60.1%)</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-[11px] text-[#A8A29E] text-center italic">
                    Optimizando operaciones en salones de México y Latinoamérica.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
