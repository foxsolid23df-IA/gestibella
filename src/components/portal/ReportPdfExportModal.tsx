import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  Building2,
  DollarSign,
  Package,
  BarChart3,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSalon } from '../../context/SalonContext';
import {
  generateFinancialStatementPDF,
  generateInventorySummaryPDF,
  generateExecutiveAnalyticsPDF
} from '../../utils/pdfExport';

export type ReportType = 'FINANCIAL_STATEMENT' | 'INVENTORY_SUMMARY' | 'EXECUTIVE_ANALYTICS';

interface ReportPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReportType?: ReportType;
}

export const ReportPdfExportModal: React.FC<ReportPdfExportModalProps> = ({
  isOpen,
  onClose,
  initialReportType = 'FINANCIAL_STATEMENT'
}) => {
  const {
    receiptConfig,
    ticketsList,
    expensesList,
    inventoryList,
    branches,
    selectedBranchId,
    branchTransfers,
    getProductBranchStock,
    addToast
  } = useSalon();

  const [reportType, setReportType] = useState<ReportType>(initialReportType);
  const [branchScope, setBranchScope] = useState<string>(selectedBranchId || 'ALL');
  const [dateRange, setDateRange] = useState<string>('Mes en Curso (Agosto 2026)');
  const [generatedBy, setGeneratedBy] = useState<string>('Gerencia General');
  const [includeLogo, setIncludeLogo] = useState<boolean>(true);
  const [includeSignatures, setIncludeSignatures] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const topServicesData = [
    { name: 'Balayage & Color Signature', revenue: 42800, count: 28, percentage: 38 },
    { name: 'Tratamiento Keratina & Botox Capilar', revenue: 26400, count: 22, percentage: 24 },
    { name: 'Corte de Dama & Brush Styling', revenue: 18200, count: 35, percentage: 16 },
    { name: 'Uñas Acrílicas & Gelish Spa', revenue: 14500, count: 29, percentage: 13 },
    { name: 'Venta de Retail en Vitrina (Olaplex/Moroccanoil)', revenue: 10200, count: 18, percentage: 9 }
  ];

  const handleGeneratePdfDoc = async () => {
    const configToUse = {
      ...receiptConfig,
      showLogo: includeLogo
    };

    if (reportType === 'FINANCIAL_STATEMENT') {
      return await generateFinancialStatementPDF({
        receiptConfig: configToUse,
        ticketsList,
        expensesList,
        branches,
        selectedBranchId: branchScope,
        dateRangeLabel: dateRange,
        generatedBy,
        includeSignatures
      });
    } else if (reportType === 'INVENTORY_SUMMARY') {
      return await generateInventorySummaryPDF({
        receiptConfig: configToUse,
        inventoryList,
        branches,
        branchTransfers,
        getProductBranchStock,
        selectedBranchId: branchScope,
        generatedBy,
        includeSignatures
      });
    } else {
      return await generateExecutiveAnalyticsPDF({
        receiptConfig: configToUse,
        ticketsList,
        branches,
        topServices: topServicesData,
        timeRangeLabel: dateRange,
        generatedBy
      });
    }
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const doc = await handleGeneratePdfDoc();
      const dateTag = new Date().toISOString().split('T')[0];
      const fileNameMap = {
        FINANCIAL_STATEMENT: `GestiBella_Estado_Financiero_${dateTag}.pdf`,
        INVENTORY_SUMMARY: `GestiBella_Resumen_Inventario_Sucursales_${dateTag}.pdf`,
        EXECUTIVE_ANALYTICS: `GestiBella_Reporte_Rendimiento_${dateTag}.pdf`
      };

      doc.save(fileNameMap[reportType]);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#BE5A38', '#D97706', '#1C1917']
        });
      } catch (e) {
        // Confetti fallback
      }

      addToast(
        'success',
        'PDF Descargado Exitosamente',
        'El archivo ha sido generado con el membrete y logotipo de tu negocio.'
      );
      setIsGenerating(false);
      onClose();
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsGenerating(false);
      addToast(
        'error',
        'Error al Generar PDF',
        'Ocurrió un inconveniente al procesar el archivo. Por favor intenta de nuevo.'
      );
    }
  };

  const handlePrintOrPreview = async () => {
    try {
      setIsGenerating(true);
      const doc = await handleGeneratePdfDoc();
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');

      addToast(
        'info',
        'Vista Previa Generada',
        'Se abrió el documento PDF en una pestaña para imprimir o visualizar.'
      );
      setIsGenerating(false);
    } catch (err) {
      console.error('Error opening PDF preview:', err);
      setIsGenerating(false);
      addToast('error', 'Error', 'No se pudo abrir la vista previa del PDF.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8] my-8 max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F0E8E1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-center text-[#BE5A38] shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#BE5A38] text-white uppercase tracking-wider">
                  Exportación Oficial PDF
                </span>
                <span className="text-xs text-[#78716C]">Con Membrete Corporativo</span>
              </div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1917]">
                Descargar Reportes y Estados de Cuenta
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-5 overflow-y-auto pr-1">
          {/* 1. Report Type Selector */}
          <div>
            <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-2">
              1. Selecciona el Tipo de Reporte a Generar
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setReportType('FINANCIAL_STATEMENT')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  reportType === 'FINANCIAL_STATEMENT'
                    ? 'bg-[#FAF7F2] border-[#BE5A38] ring-2 ring-[#BE5A38]/20 shadow-xs'
                    : 'bg-white border-[#E8DFD8] hover:border-[#D8C3B5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  {reportType === 'FINANCIAL_STATEMENT' && (
                    <CheckCircle2 className="w-4 h-4 text-[#BE5A38]" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-[#1C1917]">Estado de Cuenta & Cierre</h4>
                <p className="text-[10px] text-[#78716C] mt-0.5">
                  Ingresos, egresos, desglose de métodos de pago y utilidad neta.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setReportType('INVENTORY_SUMMARY')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  reportType === 'INVENTORY_SUMMARY'
                    ? 'bg-[#FAF7F2] border-[#BE5A38] ring-2 ring-[#BE5A38]/20 shadow-xs'
                    : 'bg-white border-[#E8DFD8] hover:border-[#D8C3B5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  {reportType === 'INVENTORY_SUMMARY' && (
                    <CheckCircle2 className="w-4 h-4 text-[#BE5A38]" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-[#1C1917]">Inventario Multi-Sucursal</h4>
                <p className="text-[10px] text-[#78716C] mt-0.5">
                  Matriz de stock en todas las sedes, valuación al costo y traspasos.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setReportType('EXECUTIVE_ANALYTICS')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  reportType === 'EXECUTIVE_ANALYTICS'
                    ? 'bg-[#FAF7F2] border-[#BE5A38] ring-2 ring-[#BE5A38]/20 shadow-xs'
                    : 'bg-white border-[#E8DFD8] hover:border-[#D8C3B5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  {reportType === 'EXECUTIVE_ANALYTICS' && (
                    <CheckCircle2 className="w-4 h-4 text-[#BE5A38]" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-[#1C1917]">Rendimiento Ejecutivo</h4>
                <p className="text-[10px] text-[#78716C] mt-0.5">
                  Servicios top, ocupación de sillones y retención de clientas.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Branch Scope and Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#44403C] mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#BE5A38]" />
                <span>Sucursal / Sede del Reporte</span>
              </label>
              <select
                value={branchScope}
                onChange={(e) => setBranchScope(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
              >
                <option value="ALL">🌐 Consolidado Global (Todas las Sedes)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#44403C] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#BE5A38]" />
                <span>Período o Rango de Fechas</span>
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
              >
                <option value="Cierre de Hoy (26 de Agosto)">Cierre de Hoy (26 de Agosto)</option>
                <option value="Esta Semana">Esta Semana en Curso</option>
                <option value="Mes en Curso (Agosto 2026)">Mes en Curso (Agosto 2026)</option>
                <option value="Trimestre Q3 2026">Trimestre Q3 2026</option>
                <option value="Histórico Acumulado Anual 2026">Histórico Acumulado Anual 2026</option>
              </select>
            </div>
          </div>

          {/* 3. Business Logo & Branding Preview Banner */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {receiptConfig.logoUrl ? (
                <img
                  src={receiptConfig.logoUrl}
                  alt="Logo del negocio"
                  className="w-12 h-12 rounded-xl object-cover border border-[#E8DFD8] shadow-xs bg-white"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#BE5A38] text-white flex items-center justify-center font-serif-luxury font-bold text-lg">
                  GB
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#1C1917]">
                  {receiptConfig.salonName || 'GestiBella Salon & Spa'}
                </p>
                <p className="text-[10px] text-[#78716C]">
                  RFC: {receiptConfig.taxId || 'GBE240824-XYZ'} • {receiptConfig.address || 'Polanco, CDMX'}
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Logotipo y datos fiscales vinculados automáticamente al PDF</span>
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-[#44403C] cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(e) => setIncludeLogo(e.target.checked)}
                className="w-4 h-4 text-[#BE5A38] rounded focus:ring-[#BE5A38] border-gray-300"
              />
              <span>Incluir Logo</span>
            </label>
          </div>

          {/* 4. Advanced PDF Layout Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 bg-white border border-[#E8DFD8] rounded-xl text-xs font-medium text-[#44403C] cursor-pointer hover:bg-[#FAF7F2]">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="w-4 h-4 text-[#BE5A38] rounded focus:ring-[#BE5A38] border-gray-300"
              />
              <span>Incluir líneas de firma para Gerencia y Auditor</span>
            </label>

            <div className="flex items-center gap-2 p-2 bg-white border border-[#E8DFD8] rounded-xl text-xs">
              <span className="text-[#78716C] font-semibold">Generado por:</span>
              <input
                type="text"
                value={generatedBy}
                onChange={(e) => setGeneratedBy(e.target.value)}
                placeholder="ej. Dirección / Dueño"
                className="flex-1 bg-[#FAF7F2] border border-[#D8C3B5] rounded-lg px-2.5 py-1 text-xs text-[#1C1917] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-[#F0E8E1] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EAE0D6] text-[#78716C] hover:text-[#1C1917] font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handlePrintOrPreview}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-[#FAF7F2] border border-[#D8C3B5] text-[#1C1917] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-[#BE5A38]" />
              <span>Vista Previa / Imprimir</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] hover:from-[#A84E30] hover:to-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
