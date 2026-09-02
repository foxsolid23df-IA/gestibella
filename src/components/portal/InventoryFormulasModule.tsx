import React, { useState } from 'react';
import {
  FlaskConical,
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Filter,
  User,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Layers,
  ArrowRightLeft,
  Building2,
  Boxes,
  Clock,
  ShieldCheck,
  Store,
  Download,
  FileText
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { TechnicalFormula, InventoryItem } from '../../types';
import { BranchTransferModal } from './BranchTransferModal';
import { ReportPdfExportModal } from './ReportPdfExportModal';

export const InventoryFormulasModule: React.FC = () => {
  const {
    inventoryList,
    formulasList,
    clientsList,
    staffList,
    branches,
    selectedBranchId,
    branchTransfers,
    addTechnicalFormula,
    updateStock,
    addInventoryItem,
    getProductBranchStock
  } = useSalon();

  const [activeSubTab, setActiveSubTab] = useState<'INVENTORY' | 'TRANSFERS' | 'FORMULAS'>('INVENTORY');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Inter-Branch Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferPreselectedProductId, setTransferPreselectedProductId] = useState<string | undefined>(undefined);
  const [transferPreselectedSourceBranchId, setTransferPreselectedSourceBranchId] = useState<string | undefined>(undefined);

  // New Formula Modal State
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [formulaClientId, setFormulaClientId] = useState(clientsList[0]?.id || 'cli-1');
  const [formulaBaseNatural, setFormulaBaseNatural] = useState('4.0 Castaño Medio');
  const [formulaTargetColor, setFormulaTargetColor] = useState('8.31 Rubio Claro Dorado Ceniza');
  const [formulaDetails, setFormulaDetails] = useState('45g 8.31 + 15g 8.1 + 90ml Revelador 20 Vol');
  const [formulaNotes, setFormulaNotes] = useState('Cabello fino con tendencia a reflejos cobrizos.');
  const [formulaStaffId, setFormulaStaffId] = useState(staffList[0]?.id || 'staff-1');

  // New Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Tintes');
  const [newItemStock, setNewItemStock] = useState(10);
  const [newItemMinStock, setNewItemMinStock] = useState(3);
  const [newItemUnit, setNewItemUnit] = useState('Tubos 60g');
  const [newItemCost, setNewItemCost] = useState(85);
  const [newItemRetail, setNewItemRetail] = useState<number | undefined>(undefined);
  const [newItemIsRetail, setNewItemIsRetail] = useState(false);

  // Filter inventory
  const filteredInventory = inventoryList.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // Filter transfers
  const filteredTransfers = branchTransfers.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.transferCode.toLowerCase().includes(term) ||
      t.productName.toLowerCase().includes(term) ||
      t.productSku.toLowerCase().includes(term) ||
      t.sourceBranchName.toLowerCase().includes(term) ||
      t.destinationBranchName.toLowerCase().includes(term)
    );
  });

  // Filter formulas
  const filteredFormulas = formulasList.filter((f) => {
    return (
      f.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.formulaDetails.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenTransfer = (productId?: string, sourceBranchId?: string) => {
    setTransferPreselectedProductId(productId);
    setTransferPreselectedSourceBranchId(sourceBranchId);
    setIsTransferModalOpen(true);
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clientsList.find((c) => c.id === formulaClientId);
    const staff = staffList.find((s) => s.id === formulaStaffId);
    if (!client || !staff) return;

    const newFormula: Omit<TechnicalFormula, 'id'> = {
      clientId: client.id,
      clientName: client.name,
      date: new Date().toISOString().split('T')[0],
      staffId: staff.id,
      staffName: staff.name,
      serviceType: 'Colorimetría / Balayage',
      baseNatural: formulaBaseNatural,
      porosity: 'Media',
      formulaDetails: `${formulaDetails} (Tono deseado: ${formulaTargetColor})`,
      exposureTimeMinutes: 35,
      notes: formulaNotes
    };

    addTechnicalFormula(newFormula);
    setIsFormulaModalOpen(false);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemSku) return;

    const initialBranchStock: Record<string, number> = {
      'branch-1': Math.round(Number(newItemStock) * 0.6),
      'branch-2': Math.round(Number(newItemStock) * 0.25),
      'branch-3': Math.max(0, Number(newItemStock) - Math.round(Number(newItemStock) * 0.6) - Math.round(Number(newItemStock) * 0.25))
    };

    const newItem: Omit<InventoryItem, 'id'> = {
      name: newItemName,
      sku: newItemSku,
      brand: "L'Oréal Professionnel",
      category: newItemCategory,
      currentStock: Number(newItemStock),
      minStock: Number(newItemMinStock),
      maxStock: Number(newItemMinStock) * 3,
      unit: newItemUnit,
      costPrice: Number(newItemCost),
      retailPrice: newItemIsRetail ? Number(newItemRetail || newItemCost * 2) : undefined,
      isRetail: newItemIsRetail,
      location: 'Bodega Principal',
      branchStock: initialBranchStock
    };

    addInventoryItem(newItem);
    setIsItemModalOpen(false);
    setNewItemName('');
    setNewItemSku('');
  };

  const totalTransferredUnits = branchTransfers.reduce((acc, t) => acc + t.quantity, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Almacén, Traspasos & Fórmulas Técnicas</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Inventario & Traspasos entre Sedes
          </h2>
          <p className="text-xs text-[#78716C]">
            Control de insumos, traspasos automáticos entre sucursales y bitácora de colorimetría.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F0E8E1] border border-[#D8C3B5] text-[#1C1917] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Exportar auditoría y matriz de inventario multi-sucursal a PDF con logo"
          >
            <Download className="w-4 h-4 text-[#BE5A38]" />
            <span>Exportar Inventario PDF</span>
          </button>

          <button
            onClick={() => handleOpenTransfer()}
            className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#2D2A26] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#BE5A38]" />
            <span>Traspaso entre Sucursales</span>
          </button>

          {activeSubTab === 'FORMULAS' ? (
            <button
              id="btn-new-formula"
              onClick={() => setIsFormulaModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Fórmula Técnica</span>
            </button>
          ) : (
            <button
              id="btn-new-inventory-item"
              onClick={() => setIsItemModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Insumo</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtabs Selector: INVENTARIO vs TRASPASOS vs FÓRMULAS */}
      <div className="bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E8DFD8] flex flex-col lg:flex-row items-center justify-between gap-3">
        
        <div className="flex gap-1.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveSubTab('INVENTORY')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'INVENTORY'
                ? 'bg-[#BE5A38] text-white shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stock & Insumos ({inventoryList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('TRANSFERS')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'TRANSFERS'
                ? 'bg-[#BE5A38] text-white shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Traspasos entre Sucursales ({branchTransfers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('FORMULAS')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'FORMULAS'
                ? 'bg-[#BE5A38] text-white shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Recetas de Colorimetría ({formulasList.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'INVENTORY'
                ? 'Buscar insumo o SKU...'
                : activeSubTab === 'TRANSFERS'
                ? 'Buscar folio, producto o sede...'
                : 'Buscar clienta o fórmula...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#D8C3B5] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-[#1C1917] focus:ring-1 focus:ring-[#BE5A38] focus:outline-none"
          />
        </div>

      </div>

      {/* Main Content Area */}
      {activeSubTab === 'INVENTORY' ? (
        /* Inventory Table View */
        <div className="bg-white rounded-3xl border border-[#E8DFD8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DFD8]">
                <tr>
                  <th className="p-4">SKU / Insumo</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Tipo de Uso</th>
                  <th className="p-4">Costo / Venta</th>
                  <th className="p-4">Stock Total Red</th>
                  <th className="p-4 text-center">Ajuste (+/-)</th>
                  <th className="p-4 text-center">Traspaso Rápido</th>
                  <th className="p-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8E1]">
                {filteredInventory.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-4 font-semibold text-[#1C1917]">
                        <div className="font-bold">{item.name}</div>
                        <div className="text-[10px] font-mono text-[#8D5B4C]">SKU: {item.sku} • {item.unit}</div>
                      </td>
                      <td className="p-4 text-[#57534E]">{item.category}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8D5B4C] border border-[#E8DFD8]">
                            Consumo Interno
                          </span>
                          {item.isRetail && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                              Venta Vitrina
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-[#1C1917] font-semibold">Costo: ${item.costPrice}</div>
                        {item.retailPrice && (
                          <div className="text-[#BE5A38] font-bold text-[11px]">Venta: ${item.retailPrice}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-sm ${isLow ? 'text-rose-600' : 'text-[#1C1917]'}`}>
                            {item.currentStock} {item.unit}
                          </span>
                          <span className="text-[10px] text-[#78716C]">(Mín: {item.minStock})</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => updateStock(item.id, item.currentStock - 1)}
                            className="w-7 h-7 bg-[#FAF7F2] hover:bg-rose-50 text-[#8D5B4C] hover:text-rose-600 rounded-lg font-bold flex items-center justify-center border border-[#D8C3B5] transition-colors cursor-pointer"
                            title="Restar 1 unidad"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => updateStock(item.id, item.currentStock + 1)}
                            className="w-7 h-7 bg-[#FAF7F2] hover:bg-emerald-50 text-[#8D5B4C] hover:text-emerald-600 rounded-lg font-bold flex items-center justify-center border border-[#D8C3B5] transition-colors cursor-pointer"
                            title="Sumar 1 unidad"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => updateStock(item.id, item.currentStock + 5)}
                            className="px-2 h-7 bg-[#FAF7F2] hover:bg-emerald-50 text-[10px] text-[#8D5B4C] hover:text-emerald-600 rounded-lg font-bold flex items-center justify-center border border-[#D8C3B5] transition-colors cursor-pointer"
                            title="Sumar 5 unidades"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleOpenTransfer(item.id)}
                          className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE0D6] border border-[#D8C3B5] text-[#1C1917] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                          title="Traspasar existencias a otra sucursal"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5 text-[#BE5A38]" />
                          <span>Traspasar</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Stock Crítico</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Disponible</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'TRANSFERS' ? (
        /* Transfers Management & Multi-Branch Matrix View */
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
              <p className="text-[11px] text-[#78716C] font-bold uppercase">Traspasos Registrados</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl font-bold font-serif-luxury text-[#1C1917]">
                  {branchTransfers.length}
                </h3>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizados
                </span>
              </div>
              <p className="text-[10px] text-[#78716C] mt-1">Historial total de movimientos de red</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
              <p className="text-[11px] text-[#78716C] font-bold uppercase">Unidades Reubicadas</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl font-bold font-serif-luxury text-[#BE5A38]">
                  {totalTransferredUnits}
                </h3>
                <span className="text-xs font-bold text-[#BE5A38]">Insumos</span>
              </div>
              <p className="text-[10px] text-[#78716C] mt-1">Total transferido entre sucursales</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
              <p className="text-[11px] text-[#78716C] font-bold uppercase">Sucursales Conectadas</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl font-bold font-serif-luxury text-[#1C1917]">
                  {branches.length} Sedes
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  En línea
                </span>
              </div>
              <p className="text-[10px] text-[#78716C] mt-1">Inventarios interconectados</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs">
              <p className="text-[11px] text-[#78716C] font-bold uppercase">Tiempo de Sincronización</p>
              <div className="flex items-baseline justify-between mt-1">
                <h3 className="text-2xl font-bold font-serif-luxury text-[#1C1917]">
                  0.0 s
                </h3>
                <span className="text-xs font-bold text-emerald-600">Inmediato</span>
              </div>
              <p className="text-[10px] text-[#78716C] mt-1">Ajuste bidireccional automático</p>
            </div>
          </div>

          {/* Inter-Branch Inventory Stock Matrix */}
          <div className="bg-white rounded-3xl border border-[#E8DFD8] shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                  Matriz de Existencias por Sucursal
                </h3>
                <p className="text-xs text-[#78716C]">
                  Visualiza en paralelo el stock disponible de cada insumo en cada sede y transfiere existencias con un clic.
                </p>
              </div>

              <button
                onClick={() => handleOpenTransfer()}
                className="px-4 py-2 bg-gradient-to-r from-[#BE5A38] to-[#D97706] hover:from-[#A84E30] hover:to-[#B45309] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Traspaso</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DFD8]">
                  <tr>
                    <th className="p-3.5">Insumo / SKU</th>
                    {branches.map((b) => (
                      <th key={b.id} className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.colorTag }} />
                          <span>{b.code}</span>
                        </div>
                      </th>
                    ))}
                    <th className="p-3.5 text-center">Stock Total Red</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8E1]">
                  {filteredInventory.map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="p-3.5 font-semibold text-[#1C1917]">
                          <div className="font-bold">{item.name}</div>
                          <div className="text-[10px] font-mono text-[#8D5B4C]">SKU: {item.sku} • {item.unit}</div>
                        </td>
                        {branches.map((b) => {
                          const stockInBranch = getProductBranchStock(item.id, b.id);
                          const isLowInBranch = stockInBranch <= 2;
                          return (
                            <td key={b.id} className="p-3.5 text-center">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-xl font-extrabold text-xs ${
                                  stockInBranch === 0
                                    ? 'bg-rose-100 text-rose-700'
                                    : isLowInBranch
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-[#FAF7F2] text-[#1C1917] border border-[#E8DFD8]'
                                }`}
                              >
                                {stockInBranch}
                              </span>
                            </td>
                          );
                        })}
                        <td className="p-3.5 text-center font-extrabold text-sm text-[#BE5A38]">
                          {item.currentStock} {item.unit}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenTransfer(item.id)}
                            className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE0D6] border border-[#D8C3B5] text-[#1C1917] rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-[#BE5A38]" />
                            <span>Mover</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Trail & Transfers History Table */}
          <div className="bg-white rounded-3xl border border-[#E8DFD8] shadow-xs p-6 space-y-4">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
                Historial & Bitácora de Traspasos
              </h3>
              <p className="text-xs text-[#78716C]">
                Registro inmutable de movimientos entre almacenes con autorización, folio y fecha exacta.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#78716C] uppercase font-bold text-[10px] tracking-wider border-b border-[#E8DFD8]">
                  <tr>
                    <th className="p-3.5">Folio / Fecha</th>
                    <th className="p-3.5">Producto & Cantidad</th>
                    <th className="p-3.5">Ruta de Traspaso</th>
                    <th className="p-3.5">Autorizado Por</th>
                    <th className="p-3.5">Motivo / Notas</th>
                    <th className="p-3.5 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8E1]">
                  {filteredTransfers.map((trf) => (
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
        </div>
      ) : (
        /* Technical Formulas Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFormulas.map((form) => (
            <div
              key={form.id}
              id={`formula-card-${form.id}`}
              className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-4 hover:border-[#BE5A38] transition-all"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E8E1]">
                <div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#BE5A38]" />
                    <h3 className="font-bold text-sm text-[#1C1917]">{form.clientName}</h3>
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-0.5">
                    {form.serviceType} • Registrado el {form.date}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8D5B4C] border border-[#E8DFD8]">
                  Por {form.staffName}
                </span>
              </div>

              {/* Technical Colorimetry Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8DFD8]">
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] uppercase">Base Natural:</span>
                  <p className="font-semibold text-[#1C1917]">{form.baseNatural}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] uppercase">Porosidad:</span>
                  <p className="font-semibold text-[#BE5A38]">{form.porosity}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] uppercase">Tiempo de Pose:</span>
                  <p className="font-semibold text-[#1C1917]">{form.exposureTimeMinutes} min</p>
                </div>
              </div>

              {/* Exact Grams & Formula recipe */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#1C1917] flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-[#BE5A38]" />
                  Receta Exacta de Mezcla:
                </span>
                <div className="p-3 bg-white rounded-xl border border-[#D8C3B5] font-mono text-[11px] text-[#BE5A38] font-bold">
                  {form.formulaDetails}
                </div>
              </div>

              {form.notes && (
                <p className="text-[11px] text-[#78716C] italic">
                  <strong>Observaciones:</strong> {form.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Inter-Branch Product Transfer */}
      <BranchTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        preselectedProductId={transferPreselectedProductId}
        preselectedSourceBranchId={transferPreselectedSourceBranchId}
      />

      {/* Modal: New Formula */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8] max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917] mb-4">
              Registrar Nueva Fórmula de Colorimetría
            </h3>

            <form onSubmit={handleSaveFormula} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Clienta</label>
                  <select
                    id="select-formula-client"
                    value={formulaClientId}
                    onChange={(e) => setFormulaClientId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  >
                    {clientsList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Colorista / Estilista</label>
                  <select
                    id="select-formula-staff"
                    value={formulaStaffId}
                    onChange={(e) => setFormulaStaffId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  >
                    {staffList.filter((s) => s.role !== 'RECEPTIONIST').map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Base Natural Inicial</label>
                  <input
                    type="text"
                    required
                    value={formulaBaseNatural}
                    onChange={(e) => setFormulaBaseNatural(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Tono Objetivo</label>
                  <input
                    type="text"
                    required
                    value={formulaTargetColor}
                    onChange={(e) => setFormulaTargetColor(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">
                  Receta Exacta (Gramaje + Tinte + Oxidante)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej. 40g 7.1 + 20g 7.3 + 90ml Oxidante 20 Vol"
                  value={formulaDetails}
                  onChange={(e) => setFormulaDetails(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl p-3 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">Notas y Reacciones Capilares</label>
                <input
                  type="text"
                  placeholder="Ej. Buena absorción en medios y puntas."
                  value={formulaNotes}
                  onChange={(e) => setFormulaNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="flex-1 py-3 bg-[#FAF7F2] text-[#78716C] font-bold rounded-xl border border-[#E8DFD8] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Guardar Fórmula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Inventory Item */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8] max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917] mb-4">
              Registrar Insumo en Almacén
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] mb-1">Nombre del Insumo / Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tinte Igora 6.0 Rubio Oscuro"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Código SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. TINT-6-0"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Categoría</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="Tintes">Tintes</option>
                    <option value="Tratamientos">Tratamientos</option>
                    <option value="Shampoo & Cuidado">Shampoo & Cuidado</option>
                    <option value="Químicos & Peróxidos">Químicos & Peróxidos</option>
                    <option value="Insumos Desechables">Insumos Desechables</option>
                    <option value="Retail Venta">Retail Venta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Costo ($ MXN)</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemIsRetail}
                    onChange={(e) => setNewItemIsRetail(e.target.checked)}
                    className="rounded text-[#BE5A38] focus:ring-[#BE5A38]"
                  />
                  <span>Disponible para venta directa en vitrina a clientes (Retail)</span>
                </label>
              </div>

              {newItemIsRetail && (
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Precio de Venta al Público ($ MXN)</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Ej. 180"
                    value={newItemRetail || ''}
                    onChange={(e) => setNewItemRetail(Number(e.target.value))}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="flex-1 py-3 bg-[#FAF7F2] text-[#78716C] font-bold rounded-xl border border-[#E8DFD8] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Guardar en Almacén
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
        initialReportType="INVENTORY_SUMMARY"
      />

    </div>
  );
};
