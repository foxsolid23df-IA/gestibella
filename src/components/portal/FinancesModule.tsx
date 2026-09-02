import React, { useState } from 'react';
import {
  LineChart,
  Plus,
  CreditCard,
  Building,
  FileSpreadsheet,
  Download,
  FileText,
  Building2
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { ExpenseRecord } from '../../types';
import { ReportPdfExportModal, ReportType } from './ReportPdfExportModal';

export const FinancesModule: React.FC = () => {
  const {
    ticketsList,
    expensesList,
    addExpense,
    branches,
    selectedBranchId
  } = useSalon();

  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('FINANCIAL_STATEMENT');

  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(650);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseRecord['category']>('Insumos y Productos');
  const [expenseMethod, setExpenseMethod] = useState('Transferencia Bancaria');
  const [expenseReceipt, setExpenseReceipt] = useState('FAC-9921');

  const handleOpenPdf = (type: ReportType = 'FINANCIAL_STATEMENT') => {
    setSelectedReportType(type);
    setIsPdfModalOpen(true);
  };

  // Calculate financials
  const paidTickets = ticketsList.filter((t) => t.status === 'PAID');
  
  const totalRevenue = paidTickets.reduce((sum, t) => sum + t.total, 0);
  
  const cashRevenue = paidTickets
    .filter((t) => t.paymentMethod === 'EFECTIVO')
    .reduce((sum, t) => sum + t.total, 0);

  const cardRevenue = paidTickets
    .filter((t) => t.paymentMethod === 'TARJETA_CREDITO' || t.paymentMethod === 'TARJETA_DEBITO')
    .reduce((sum, t) => sum + t.total, 0);

  const transferRevenue = paidTickets
    .filter((t) => t.paymentMethod === 'TRANSFERENCIA')
    .reduce((sum, t) => sum + t.total, 0);

  const totalTips = paidTickets.reduce((sum, t) => sum + t.tip, 0);

  // Total operating expenses
  const totalExpenses = expensesList.reduce((sum, e) => sum + e.amount, 0);

  // Estimated team commissions
  const estimatedCommissions = Math.round(totalRevenue * 0.42);

  // Net Profit
  const netProfit = totalRevenue - totalExpenses - estimatedCommissions;
  const netMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc || expenseAmount <= 0) return;

    addExpense({
      concept: expenseDesc,
      amount: Number(expenseAmount),
      category: expenseCategory,
      paymentMethod: expenseMethod,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: expenseReceipt,
      registeredBy: 'Gerencia'
    });

    setIsNewExpenseModalOpen(false);
    setExpenseDesc('');
    setExpenseAmount(650);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <LineChart className="w-3.5 h-3.5" />
            <span>Finanzas & Arqueo</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Control Financiero & Cierre de Caja
          </h2>
          <p className="text-xs text-[#78716C]">
            Conciliación de pagos, registro de egresos operativos y margen neto de rentabilidad.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleOpenPdf('FINANCIAL_STATEMENT')}
            className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F0E8E1] border border-[#D8C3B5] text-[#1C1917] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Descargar estado de cuenta financiero en PDF con membrete y logo"
          >
            <Download className="w-4 h-4 text-[#BE5A38]" />
            <span>Descargar Estado de Cuenta PDF</span>
          </button>

          <button
            id="btn-new-expense"
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Gasto / Egreso</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#78716C]">Ingresos Brutos Cobrados</span>
          <p className="text-2xl font-extrabold text-[#1C1917]">${totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">{paidTickets.length} transacciones</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#78716C]">Gastos Operativos Registrados</span>
          <p className="text-2xl font-extrabold text-rose-600">${totalExpenses.toLocaleString()}</p>
          <p className="text-[11px] text-[#78716C]">{expensesList.length} partidas de egreso</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#78716C]">Comisiones de Personal</span>
          <p className="text-2xl font-extrabold text-[#8D5B4C]">${estimatedCommissions.toLocaleString()}</p>
          <p className="text-[11px] text-[#78716C]">Estimado según ventas</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#78716C]">Utilidad Neta Real</span>
          <p className="text-2xl font-extrabold text-emerald-700">${netProfit.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-bold">Margen: {netMarginPercent}%</p>
        </div>

      </div>

      {/* 2 Main Columns: Arqueo de Caja + Registro de Gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (6 cols): Arqueo de Caja / Cierre Diario */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E8E1]">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                Arqueo & Conciliación de Caja Hoy
              </h3>
              <p className="text-xs text-[#78716C]">Desglose exacto por método de cobro</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Cuadrada
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD8] flex items-center justify-center text-emerald-600 font-bold">
                  $
                </div>
                <div>
                  <p className="font-bold text-[#1C1917]">Efectivo Físico en Gaveta</p>
                  <p className="text-[11px] text-[#78716C]">Cobros directos en caja</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-[#1C1917]">${cashRevenue.toLocaleString()} MXN</span>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD8] flex items-center justify-center text-blue-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1C1917]">Terminal Bancaria (Tarjetas)</p>
                  <p className="text-[11px] text-[#78716C]">Débito, Crédito y Contactless</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-[#1C1917]">${cardRevenue.toLocaleString()} MXN</span>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD8] flex items-center justify-center text-amber-600">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#1C1917]">Transferencias SPEI</p>
                  <p className="text-[11px] text-[#78716C]">Banca móvil verificada</p>
                </div>
              </div>
              <span className="text-base font-extrabold text-[#1C1917]">${transferRevenue.toLocaleString()} MXN</span>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#8D5B4C]">Propinas Recibidas para Staff</p>
                <p className="text-[11px] text-[#78716C]">A repartir según servicios</p>
              </div>
              <span className="text-base font-bold text-[#8D5B4C]">${totalTips.toLocaleString()} MXN</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => handleOpenPdf('FINANCIAL_STATEMENT')}
              className="flex-1 py-3 bg-[#FAF7F2] hover:bg-[#F0E8E1] text-[#8D5B4C] font-bold text-xs rounded-xl border border-[#D8C3B5] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#BE5A38]" />
              <span>Imprimir Corte de Caja Diario (Z-Report)</span>
            </button>

            <button
              onClick={() => handleOpenPdf('INVENTORY_SUMMARY')}
              className="px-3.5 py-3 bg-white hover:bg-[#FAF7F2] text-[#1C1917] font-bold text-xs rounded-xl border border-[#D8C3B5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="Descargar auditoría de inventario en PDF"
            >
              <FileText className="w-4 h-4 text-[#BE5A38]" />
              <span>Inventario</span>
            </button>
          </div>
        </div>

        {/* Right Col (6 cols): Registro de Gastos y Egresos */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E8E1]">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                Gastos Operativos del Salón
              </h3>
              <p className="text-xs text-[#78716C]">Alquiler, Insumos, Servicios y Mantenimiento</p>
            </div>

            <button
              onClick={() => setIsNewExpenseModalOpen(true)}
              className="text-xs font-bold text-[#BE5A38] hover:text-[#A84E30] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Gasto</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {expensesList.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1C1917]">{exp.concept}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#8D5B4C] border border-[#E8DFD8]">
                      {exp.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-0.5">
                    {exp.date} • Pagado con {exp.paymentMethod} • {exp.receiptNumber || 'Sin factura'}
                  </p>
                </div>

                <span className="font-extrabold text-sm text-rose-600">
                  -${exp.amount.toLocaleString()} MXN
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Modal: New Expense */}
      {isNewExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8]">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917] mb-4">
              Registrar Gasto del Salón
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] mb-1">Concepto del Gasto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Compra de toallas y batas lavandería"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Monto ($ MXN)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Categoría</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                  >
                    <option value="Insumos y Productos">Insumos y Productos</option>
                    <option value="Alquiler y Local">Alquiler y Local</option>
                    <option value="Servicios Básicos">Servicios Básicos (Luz, Agua, Wifi)</option>
                    <option value="Nómina y Comisiones">Nómina y Comisiones</option>
                    <option value="Marketing y Publicidad">Marketing y Publicidad</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Otros">Otros Gastos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Método de Pago</label>
                  <select
                    value={expenseMethod}
                    onChange={(e) => setExpenseMethod(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                  >
                    <option value="Efectivo de Caja">Efectivo de Caja</option>
                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                    <option value="Tarjeta de Débito/Crédito">Tarjeta de Débito/Crédito</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">No. Factura / Folio</label>
                  <input
                    type="text"
                    value={expenseReceipt}
                    onChange={(e) => setExpenseReceipt(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewExpenseModalOpen(false)}
                  className="flex-1 py-3 bg-[#FAF7F2] text-[#78716C] font-bold rounded-xl border border-[#E8DFD8] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      <ReportPdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialReportType={selectedReportType}
      />

    </div>
  );
};
