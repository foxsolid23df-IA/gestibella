import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Sparkles,
  Scissors,
  Users,
  DollarSign,
  ArrowUpRight,
  Clock,
  Layers,
  Download,
  FileText,
  Building2,
  Package
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { ReportPdfExportModal, ReportType } from './ReportPdfExportModal';

export const ReportsModule: React.FC = () => {
  const { ticketsList, servicesList, selectedBranchId, branches } = useSalon();
  const [timeRange, setTimeRange] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('MONTH');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('EXECUTIVE_ANALYTICS');

  const currentBranchName = selectedBranchId === 'ALL'
    ? 'Consolidado Todas las Sucursales'
    : branches.find((b) => b.id === selectedBranchId)?.name || 'Sucursal Principal';

  const handleOpenPdf = (type: ReportType = 'EXECUTIVE_ANALYTICS') => {
    setSelectedReportType(type);
    setIsPdfModalOpen(true);
  };

  const topServices = [
    { name: 'Balayage & Color Signature', revenue: 42800, count: 28, percentage: 38, color: 'bg-[#BE5A38]' },
    { name: 'Tratamiento Keratina & Botox Capilar', revenue: 26400, count: 22, percentage: 24, color: 'bg-[#D97706]' },
    { name: 'Corte de Dama & Brush Styling', revenue: 18200, count: 35, percentage: 16, color: 'bg-[#2A9D8F]' },
    { name: 'Uñas Acrílicas & Gelish Spa', revenue: 14500, count: 29, percentage: 13, color: 'bg-[#E07A5F]' },
    { name: 'Venta de Retail en Vitrina (Olaplex/Moroccanoil)', revenue: 10200, count: 18, percentage: 9, color: 'bg-[#8D5B4C]' }
  ];

  const occupancyByHour = [
    { hour: '09:00', rate: 45 },
    { hour: '10:00', rate: 75 },
    { hour: '11:00', rate: 95 },
    { hour: '12:00', rate: 100 },
    { hour: '13:00', rate: 90 },
    { hour: '14:00', rate: 60 },
    { hour: '15:00', rate: 70 },
    { hour: '16:00', rate: 85 },
    { hour: '17:00', rate: 95 },
    { hour: '18:00', rate: 90 },
    { hour: '19:00', rate: 65 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Inteligencia de Negocio & Analítica</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Rendimiento & Métricas del Salón
          </h2>
          <p className="text-xs text-[#78716C]">
            Servicios más rentables, ocupación de sillones por hora y evolución del ticket promedio.
          </p>
        </div>

        {/* Actions: Time range toggle + PDF Export buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-[#E8DFD8]">
            {(['TODAY', 'WEEK', 'MONTH', 'YEAR'] as const).map((range) => {
              const labels = { TODAY: 'Hoy', WEEK: 'Esta Semana', MONTH: 'Este Mes', YEAR: 'Año' };
              const isActive = timeRange === range;
              return (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive ? 'bg-[#BE5A38] text-white shadow-xs' : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  {labels[range]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenPdf('EXECUTIVE_ANALYTICS')}
              className="px-3.5 py-2 bg-[#1C1917] hover:bg-[#2D2A26] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Exportar reporte de analítica a PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#BE5A38]" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Executive Growth KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#78716C]">Ticket Promedio por Clienta</span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#1C1917]">$1,180</p>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-[#78716C]">Impulsado por venta cruzada en Ticket en Espera</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#78716C]">Tasa de Ocupación de Sillones</span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-[#BE5A38]">82.6%</p>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +12.1%
            </span>
          </div>
          <p className="text-[11px] text-[#78716C]">Promedio de 6.4 horas activas por sillón</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#78716C]">Tasa de Retención (Recurrencia)</span>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-emerald-700">74.2%</p>
            <span className="text-xs font-extrabold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +25.0%
            </span>
          </div>
          <p className="text-[11px] text-[#78716C]">Gracias a la Tarjeta de Sellos Virtuales</p>
        </div>

      </div>

      {/* 2 Main Visual Analytics Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left (7 cols): Top Services & Revenue Contribution */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-5">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
              Servicios Más Rentables & Facturación
            </h3>
            <p className="text-xs text-[#78716C]">Participación en el volumen de ingresos totales</p>
          </div>

          <div className="space-y-4">
            {topServices.map((srv, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1C1917]">{srv.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#78716C]">{srv.count} realizados</span>
                    <span className="font-extrabold text-[#BE5A38]">${srv.revenue.toLocaleString()} MXN</span>
                  </div>
                </div>

                <div className="w-full h-3 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E8DFD8]">
                  <div
                    className={`h-full ${srv.color} rounded-full transition-all duration-500`}
                    style={{ width: `${srv.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (5 cols): Hourly Occupancy Heatmap Bar */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-5">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
              Ocupación por Horario
            </h3>
            <p className="text-xs text-[#78716C]">Horas pico para optimizar turnos del personal</p>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-44 pt-4">
            {occupancyByHour.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full bg-[#FAF7F2] rounded-t-lg relative flex items-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      item.rate >= 90
                        ? 'bg-[#BE5A38]'
                        : item.rate >= 70
                        ? 'bg-[#D97706]'
                        : 'bg-[#D8C3B5]'
                    }`}
                    style={{ height: `${item.rate}%` }}
                  />
                </div>
                <span className="text-[9px] font-semibold text-[#78716C] -rotate-45 sm:rotate-0 mt-1">
                  {item.hour.split(':')[0]}h
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] font-bold pt-2 border-t border-[#F0E8E1]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BE5A38]" />
              Hora Pico (90-100%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              Ocupación Media (70-89%)
            </span>
          </div>
        </div>

      </div>

      {/* PDF Export Reports Hub Card */}
      <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F5ECE5] rounded-3xl p-6 border border-[#E8DFD8] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#BE5A38] text-white">
                Exportaciones Ejecutivas
              </span>
              <span className="text-xs font-bold text-[#1C1917]">Descarga en PDF Oficial con Membrete y Logotipo</span>
            </div>
            <p className="text-xs text-[#78716C] max-w-2xl">
              Genera documentos formales listos para imprimir o compartir con socios, contadores y gerentes de sucursal. Incluyen el logo oficial configurado en tu salón, RFC, desglose de ingresos y matriz de stock.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenPdf('FINANCIAL_STATEMENT')}
              className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#D8C3B5] text-[#1C1917] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Estado de Cuenta PDF</span>
            </button>

            <button
              onClick={() => handleOpenPdf('INVENTORY_SUMMARY')}
              className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#D8C3B5] text-[#1C1917] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-[#BE5A38]" />
              <span>Inventario Multi-Sede PDF</span>
            </button>

            <button
              onClick={() => handleOpenPdf('EXECUTIVE_ANALYTICS')}
              className="px-4 py-2 bg-[#BE5A38] hover:bg-[#A84E30] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Reporte Completo PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Export Modal */}
      <ReportPdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialReportType={selectedReportType}
      />

    </div>
  );
};
