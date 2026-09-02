import React, { useState } from 'react';
import {
  Building2,
  Store,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Globe,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRightLeft,
  ArrowRight,
  Clock,
  Package,
  Download,
  FileText
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { Branch } from '../../types';
import { BranchTransferModal } from './BranchTransferModal';
import { ReportPdfExportModal, ReportType } from './ReportPdfExportModal';

export const MultiBranchModule: React.FC = () => {
  const { branches, selectedBranchId, setSelectedBranchId, branchTransfers, addToast } = useSalon();

  const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');

  // PDF Export Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('EXECUTIVE_ANALYTICS');

  // Transfer Modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferSourceBranchId, setTransferSourceBranchId] = useState<string | undefined>(undefined);

  const handleOpenPdf = (type: ReportType = 'EXECUTIVE_ANALYTICS') => {
    setSelectedReportType(type);
    setIsPdfModalOpen(true);
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchAddress) {
      addToast('error', 'Campos Incompletos', 'Por favor ingresa el nombre y dirección de la nueva sucursal.');
      return;
    }
    addToast('success', 'Sucursal Registrada', `La sucursal "${newBranchName}" ha sido vinculada exitosamente a tu cuenta principal.`);
    setIsNewBranchModalOpen(false);
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
    setNewBranchManager('');
  };

  const handleOpenTransfer = (sourceId?: string) => {
    setTransferSourceBranchId(sourceId);
    setIsTransferModalOpen(true);
  };

  const totalConsolidatedSales = branches.reduce((acc, b) => acc + b.todaySales, 0);
  const totalMonthlyRevenue = branches.reduce((acc, b) => acc + b.monthlyRevenue, 0);
  const totalStaffAcrossBranches = branches.reduce((acc, b) => acc + b.activeStaffCount, 0);
  const totalTransferredUnits = branchTransfers.reduce((acc, t) => acc + t.quantity, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C1917] via-[#2D2A26] to-[#44403C] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#BE5A38]/30 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#BE5A38] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                Multi-Sucursal & Franquicias
              </span>
              <span className="text-xs text-[#D8C3B5]">Panel Ejecutivo Consolidado</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight">
              Control Centralizado de Todas tus Sucursales
            </h1>
            <p className="text-xs sm:text-sm text-[#D8C3B5] mt-1 max-w-2xl">
              Como dueño, administra y supervisa las ventas en tiempo real, ingresos mensuales, personal y traspasos de inventario de todas tus ubicaciones utilizando tu misma cuenta maestra GestiBella Pro.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => handleOpenPdf('EXECUTIVE_ANALYTICS')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
              title="Descargar reporte multi-sucursal y finanzas en PDF"
            >
              <Download className="w-4 h-4 text-[#BE5A38]" />
              <span>Exportar PDF Multi-Sede</span>
            </button>

            <button
              onClick={() => handleOpenTransfer()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#BE5A38]" />
              <span>Traspaso de Inventario</span>
            </button>

            <button
              onClick={() => setIsNewBranchModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] hover:from-[#A84E30] hover:to-[#B45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Vincular Sucursal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Consolidated Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-1">
          <p className="text-[11px] text-[#78716C] font-bold uppercase tracking-wide">Ventas Totales Hoy (Consolidado)</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold font-serif-luxury text-[#1C1917]">
              ${totalConsolidatedSales.toLocaleString()} <span className="text-xs font-sans font-normal text-[#78716C]">MXN</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-[10px] text-[#78716C]">Suma en tiempo real de {branches.length} establecimientos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-1">
          <p className="text-[11px] text-[#78716C] font-bold uppercase tracking-wide">Ingresos Mensuales Globales</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold font-serif-luxury text-[#1C1917]">
              ${totalMonthlyRevenue.toLocaleString()} <span className="text-xs font-sans font-normal text-[#78716C]">MXN</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +22.1%
            </span>
          </div>
          <p className="text-[10px] text-[#78716C]">Facturación acumulada del mes en curso</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-1">
          <p className="text-[11px] text-[#78716C] font-bold uppercase tracking-wide">Sucursales Activas</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold font-serif-luxury text-[#1C1917]">
              {branches.length} <span className="text-xs font-sans font-normal text-[#78716C]">Locales</span>
            </h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              Sincronizadas
            </span>
          </div>
          <p className="text-[10px] text-[#78716C]">Conexión en la nube en tiempo real</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs space-y-1">
          <p className="text-[11px] text-[#78716C] font-bold uppercase tracking-wide">Insumos Reubicados (Red)</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold font-serif-luxury text-[#BE5A38]">
              {totalTransferredUnits} <span className="text-xs font-sans font-normal text-[#78716C]">unidades</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              {branchTransfers.length} traspasos
            </span>
          </div>
          <p className="text-[10px] text-[#78716C]">Logística y balanceo de stock entre sedes</p>
        </div>
      </div>

      {/* Branch Selector Quick Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E8E1]">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
              Selección de Vista y Sucursal Activa
            </h3>
            <p className="text-xs text-[#78716C]">
              Elige qué sucursal deseas operar o selecciona la vista consolidada general para ver el rendimiento completo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBranchId('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBranchId === 'ALL'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] border border-[#E8DFD8]'
              }`}
            >
              🌐 Consolidado Global (Todas)
            </button>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {branches.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <div
                key={branch.id}
                className={`rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FAF7F2] border-[#BE5A38] shadow-md ring-2 ring-[#BE5A38]/20'
                    : 'bg-white border-[#E8DFD8] hover:border-[#D8C3B5] shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                        style={{ backgroundColor: branch.colorTag }}
                      >
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#78716C] tracking-wide uppercase">
                          Cód: {branch.code}
                        </span>
                        <h4 className="font-serif-luxury font-bold text-base text-[#1C1917]">
                          {branch.name}
                        </h4>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                      Activa
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#57534E] py-3 border-y border-[#F0E8E1] my-2">
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#BE5A38] shrink-0" />
                      <span className="truncate">{branch.address}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#BE5A38] shrink-0" />
                      <span>{branch.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#BE5A38] shrink-0" />
                      <span>Gerente: <strong>{branch.managerName}</strong> ({branch.activeStaffCount} estilistas)</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="bg-white/80 p-3 rounded-2xl border border-[#E8DFD8]">
                      <p className="text-[10px] text-[#78716C] font-bold">Ventas Hoy</p>
                      <p className="text-base font-serif-luxury font-bold text-[#BE5A38]">
                        ${branch.todaySales.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-white/80 p-3 rounded-2xl border border-[#E8DFD8]">
                      <p className="text-[10px] text-[#78716C] font-bold">Mes Actual</p>
                      <p className="text-base font-serif-luxury font-bold text-[#1C1917]">
                        ${(branch.monthlyRevenue / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#F0E8E1] space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenTransfer(branch.id)}
                      className="flex-1 py-2 bg-white hover:bg-[#FAF7F2] border border-[#D8C3B5] text-[#1C1917] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title={`Enviar traspaso de insumos desde ${branch.name}`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-[#BE5A38]" />
                      <span>Traspasar Stock</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                        addToast('success', 'Sucursal Seleccionada', `Operando actualmente en ${branch.name}.`);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#BE5A38] text-white shadow-md'
                          : 'bg-[#FAF7F2] hover:bg-[#EAE0D6] text-[#1C1917] border border-[#E8DFD8]'
                      }`}
                    >
                      <span>{isSelected ? '✓ Activa' : 'Entrar'}</span>
                      {!isSelected && <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inter-Branch Recent Transfers Feed */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E8E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] text-[#BE5A38] flex items-center justify-center border border-[#E8DFD8]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                Últimos Traspasos de Insumos entre Sedes
              </h3>
              <p className="text-xs text-[#78716C]">
                Historial de movimientos de inventario transferidos entre tus sucursales con ajuste automático de existencias.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenTransfer()}
            className="px-4 py-2 bg-[#1C1917] hover:bg-[#2D2A26] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#BE5A38]" />
            <span>Nuevo Traspaso</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DFD8]">
              <tr>
                <th className="p-3.5">Folio / Fecha</th>
                <th className="p-3.5">Insumo & Cantidad</th>
                <th className="p-3.5">Origen ➔ Destino</th>
                <th className="p-3.5">Autorizado Por</th>
                <th className="p-3.5">Motivo / Notas</th>
                <th className="p-3.5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E1]">
              {branchTransfers.slice(0, 5).map((trf) => (
                <tr key={trf.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-[#1C1917]">{trf.transferCode}</div>
                    <div className="text-[10px] text-[#78716C] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-[#BE5A38]" />
                      <span>{trf.date}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-[#1C1917]">
                    <div>{trf.productName}</div>
                    <div className="text-[10px] font-mono text-[#BE5A38]">
                      SKU: {trf.productSku} • <strong>{trf.quantity} {trf.unit}</strong>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-[#78716C]">{trf.sourceBranchName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#BE5A38] shrink-0" />
                      <span className="font-bold text-emerald-700">{trf.destinationBranchName}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#57534E]">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{trf.authorizedBy}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#78716C] max-w-xs truncate" title={trf.notes}>
                    {trf.notes || '—'}
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completado</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Branch Architecture Explanation Card */}
      <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E8DFD8] text-xs text-[#57534E] space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#1C1917] text-sm font-serif-luxury">
          <ShieldCheck className="w-5 h-5 text-[#BE5A38]" />
          <span>¿Cómo funciona el control multi-sucursal y traspaso de inventarios en GestiBella Pro?</span>
        </div>
        <p>
          1. <strong>Cuenta Maestra Centralizada:</strong> Con tu correo de Administrador principal, puedes vincular múltiples establecimientos sin pagar suscripciones independientes por cada local.
        </p>
        <p>
          2. <strong>Traspasos Bidireccionales Automáticos:</strong> Al enviar insumos o productos entre salones, el sistema descuenta automáticamente las existencias de la sucursal de origen y las acredita en la de destino con folio de auditoría y trazabilidad.
        </p>
        <p>
          3. <strong>Aislamiento de Cajas y Terminales:</strong> Cada sucursal mantiene su propia caja registradora, folios de tickets térmicos y personal asignado de manera independiente para evitar cruces operativos.
        </p>
        <p>
          4. <strong>Consolidación en Tiempo Real:</strong> El dueño puede cambiar de sucursal con un solo clic o elegir "Consolidado Global" para ver la suma exacta de ventas, ingresos, inventario y rendimiento general desde cualquier dispositivo.
        </p>
      </div>

      {/* Modal: Inter-Branch Product Transfer */}
      <BranchTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        preselectedSourceBranchId={transferSourceBranchId}
      />

      {/* New Branch Modal */}
      {isNewBranchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8] animate-fadeIn">
            <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917] mb-2">
              Vincular Nueva Sucursal
            </h3>
            <p className="text-xs text-[#78716C] mb-6">
              Agrega una nueva ubicación a tu red de salones GestiBella Pro bajo la misma cuenta.
            </p>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#44403C] mb-1">Nombre del Salón / Sucursal</label>
                <input
                  type="text"
                  required
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="ej. GestiBella Satélite"
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#44403C] mb-1">Dirección Completa</label>
                <input
                  type="text"
                  required
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="ej. Blvd. Manuel Ávila Camacho 120"
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newBranchPhone}
                    onChange={(e) => setNewBranchPhone(e.target.value)}
                    placeholder="+52 55 ..."
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Gerente Encargado</label>
                  <input
                    type="text"
                    value={newBranchManager}
                    onChange={(e) => setNewBranchManager(e.target.value)}
                    placeholder="ej. Karla Ramos"
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#F0E8E1]">
                <button
                  type="button"
                  onClick={() => setIsNewBranchModalOpen(false)}
                  className="px-4 py-2.5 bg-[#FAF7F2] text-[#78716C] font-bold text-xs rounded-xl hover:text-[#1C1917] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#BE5A38] hover:bg-[#A84E30] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Vincular Sucursal
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
