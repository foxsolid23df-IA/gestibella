import React, { useState } from 'react';
import {
  ArrowRightLeft,
  X,
  Building2,
  Package,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Boxes,
  HelpCircle
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

interface BranchTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
  preselectedSourceBranchId?: string;
}

export const BranchTransferModal: React.FC<BranchTransferModalProps> = ({
  isOpen,
  onClose,
  preselectedProductId,
  preselectedSourceBranchId
}) => {
  const {
    branches,
    inventoryList,
    currentStaff,
    transferProductBetweenBranches,
    getProductBranchStock,
    addToast
  } = useSalon();

  const [sourceBranchId, setSourceBranchId] = useState<string>(
    preselectedSourceBranchId || branches[0]?.id || 'branch-1'
  );
  const [destinationBranchId, setDestinationBranchId] = useState<string>(
    branches.find((b) => b.id !== (preselectedSourceBranchId || branches[0]?.id))?.id || branches[1]?.id || 'branch-2'
  );
  const [productId, setProductId] = useState<string>(
    preselectedProductId || inventoryList[0]?.id || 'inv-1'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const selectedProduct = inventoryList.find((i) => i.id === productId);
  const sourceBranch = branches.find((b) => b.id === sourceBranchId);
  const destinationBranch = branches.find((b) => b.id === destinationBranchId);

  const currentSourceStock = selectedProduct ? getProductBranchStock(selectedProduct.id, sourceBranchId) : 0;
  const currentDestStock = selectedProduct ? getProductBranchStock(selectedProduct.id, destinationBranchId) : 0;

  const isInvalidSameBranch = sourceBranchId === destinationBranchId;
  const isExceedingStock = quantity > currentSourceStock;
  const isInvalidQuantity = quantity <= 0 || isNaN(quantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isInvalidSameBranch) {
      addToast('error', 'Sucursales Inválidas', 'La sucursal de origen y destino deben ser distintas.');
      return;
    }

    if (isExceedingStock) {
      addToast('error', 'Stock Insuficiente', `La sucursal de origen solo tiene ${currentSourceStock} unidades.`);
      return;
    }

    if (isInvalidQuantity) {
      addToast('error', 'Cantidad Inválida', 'Ingresa una cantidad válida mayor a 0.');
      return;
    }

    const success = transferProductBetweenBranches({
      sourceBranchId,
      destinationBranchId,
      productId,
      quantity,
      notes: notes.trim() || 'Traspaso rutinario de inventario entre sedes autorizadas.',
      authorizedBy: `${currentStaff.name} (${currentStaff.roleTitle})`
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8] animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE0D6] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BE5A38] to-[#D97706] text-white flex items-center justify-center shadow-md">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#BE5A38]/10 text-[#BE5A38] text-[10px] font-bold uppercase rounded-full tracking-wider">
                Logística de Red
              </span>
              <span className="text-xs text-[#78716C]">Sincronización Automática</span>
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
              Traspaso de Insumos entre Sucursales
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#78716C] mb-6">
          Transfiere productos o insumos técnicos entre locales registrados. El sistema rebaja automáticamente el inventario de salida y suma las existencias en la sede receptora.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Branch Selectors: Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8]">
            {/* Source Branch */}
            <div>
              <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#BE5A38]" />
                <span>1. Sucursal de Origen (Salida)</span>
              </label>
              <select
                value={sourceBranchId}
                onChange={(e) => setSourceBranchId(e.target.value)}
                className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3 py-2 text-xs text-[#1C1917] font-semibold focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-[#78716C] mt-1">
                Gerente: {sourceBranch?.managerName}
              </div>
            </div>

            {/* Destination Branch */}
            <div>
              <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Sucursal de Destino (Entrada)</span>
              </label>
              <select
                value={destinationBranchId}
                onChange={(e) => setDestinationBranchId(e.target.value)}
                className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-[#1C1917] font-semibold focus:ring-2 focus:outline-none ${
                  isInvalidSameBranch
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                    : 'border-[#D8C3B5] focus:ring-[#BE5A38]'
                }`}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.id === sourceBranchId}>
                    {b.name} ({b.code}) {b.id === sourceBranchId ? '(Origen actual)' : ''}
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-[#78716C] mt-1">
                Gerente: {destinationBranch?.managerName}
              </div>
            </div>
          </div>

          {isInvalidSameBranch && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Por favor elige una sucursal de destino diferente a la de origen.</span>
            </div>
          )}

          {/* Product Selection */}
          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1.5 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#BE5A38]" />
              <span>Producto / Insumo a Traspasar</span>
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] font-semibold focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
            >
              {inventoryList.map((item) => {
                const stockInOrigin = getProductBranchStock(item.id, sourceBranchId);
                return (
                  <option key={item.id} value={item.id}>
                    {item.name} [{item.sku}] — Disp. en Origen: {stockInOrigin} {item.unit}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Product Live Inventory Preview Card */}
          {selectedProduct && (
            <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F5ECE5] p-4 rounded-2xl border border-[#E8DFD8] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BE5A38] bg-[#BE5A38]/10 px-2 py-0.5 rounded-full">
                    {selectedProduct.category}
                  </span>
                  <p className="font-bold text-[#1C1917] mt-1 text-sm">{selectedProduct.name}</p>
                  <p className="text-[10px] text-[#78716C] font-mono">
                    SKU: {selectedProduct.sku} • Marca: {selectedProduct.brand} • Unidad: {selectedProduct.unit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#78716C] uppercase font-bold">Stock Red Total</span>
                  <p className="font-bold text-base text-[#1C1917]">
                    {selectedProduct.currentStock} {selectedProduct.unit}
                  </p>
                </div>
              </div>

              {/* Live stock comparison before & after */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E8DFD8]">
                {/* Source Stock calculation */}
                <div className="bg-white p-3 rounded-xl border border-[#E8DFD8]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#78716C]">Origen ({sourceBranch?.code})</span>
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" /> Salida
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs text-[#78716C]">Actual: {currentSourceStock}</span>
                    <span className="font-bold text-sm text-[#1C1917]">
                      ➔ {Math.max(0, currentSourceStock - (isInvalidQuantity ? 0 : quantity))} {selectedProduct.unit}
                    </span>
                  </div>
                </div>

                {/* Destination Stock calculation */}
                <div className="bg-white p-3 rounded-xl border border-[#E8DFD8]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#78716C]">Destino ({destinationBranch?.code})</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Entrada
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs text-[#78716C]">Actual: {currentDestStock}</span>
                    <span className="font-bold text-sm text-emerald-700">
                      ➔ {currentDestStock + (isInvalidQuantity ? 0 : quantity)} {selectedProduct.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#44403C] mb-1">
                Cantidad a Traspasar
              </label>
              <input
                type="number"
                min="1"
                max={currentSourceStock || 1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2 text-xs font-bold text-[#1C1917] focus:ring-2 focus:outline-none ${
                  isExceedingStock
                    ? 'border-red-400 focus:ring-red-400 bg-red-50'
                    : 'border-[#D8C3B5] focus:ring-[#BE5A38]'
                }`}
              />
              <span className="text-[10px] text-[#78716C] mt-1 block">
                Máx disponible: {currentSourceStock} {selectedProduct?.unit}
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#44403C] mb-1">
                Motivo / Justificación del Movimiento
              </label>
              <input
                type="text"
                placeholder="ej. Reabastecimiento de tintes para balayage de fin de semana"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
              />
            </div>
          </div>

          {isExceedingStock && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                La cantidad ingresada ({quantity}) excede el stock disponible en {sourceBranch?.name} ({currentSourceStock} {selectedProduct?.unit}).
              </span>
            </div>
          )}

          {/* Authorization signature footer info */}
          <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-3 border-t border-[#F0E8E1]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Autorizado por: <strong>{currentStaff.name}</strong> ({currentStaff.roleTitle})</span>
            </div>
            <div className="text-[10px] font-mono">
              Folio Auto-Generado
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#FAF7F2] text-[#78716C] font-bold text-xs rounded-xl hover:text-[#1C1917] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isInvalidSameBranch || isExceedingStock || isInvalidQuantity || currentSourceStock === 0}
              className="px-5 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] hover:from-[#A84E30] hover:to-[#B45309] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Confirmar y Ejecutar Traspaso</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
