import React, { useState } from 'react';
import {
  X,
  Receipt,
  CreditCard,
  Banknote,
  Building,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { SaleTicket } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    activeCheckoutTicket,
    setActiveCheckoutTicket,
    checkoutTicket,
    clientsList
  } = useSalon();

  if (!activeCheckoutTicket) return null;

  const client = clientsList.find((c) => c.id === activeCheckoutTicket.clientId);

  const [paymentMethod, setPaymentMethod] = useState<NonNullable<SaleTicket['paymentMethod']>>('TARJETA_CREDITO');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [customTip, setCustomTip] = useState<number>(0);
  const [cashGiven, setCashGiven] = useState<number>(activeCheckoutTicket.subtotal);
  const [redeemPoints, setRedeemPoints] = useState<number>(0);

  // Calculations
  const subtotal = activeCheckoutTicket.subtotal;
  const depositCredited = activeCheckoutTicket.depositCredited || 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100) + redeemPoints;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tipAmount = customTip > 0 ? customTip : Math.round((taxableSubtotal * tipPercent) / 100);
  const finalTotal = Math.max(0, taxableSubtotal + tipAmount - depositCredited);
  const changeDue = Math.max(0, cashGiven - finalTotal);

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    checkoutTicket(
      activeCheckoutTicket.id,
      paymentMethod,
      tipAmount,
      cashGiven,
      redeemPoints
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8] my-8 animate-fadeIn">
        
        {/* Close button */}
        <button
          id="btn-close-checkout"
          onClick={() => setActiveCheckoutTicket(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-[#F0E8E1] space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FAF7F2] text-[11px] font-bold text-[#BE5A38] border border-[#E8DFD8]">
            <Receipt className="w-3.5 h-3.5" />
            <span>Liquidación de Ticket en Espera</span>
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
            Cobro de Cuenta: {activeCheckoutTicket.clientName}
          </h3>
          <p className="text-xs text-[#78716C]">
            Folio {activeCheckoutTicket.ticketNumber} • {activeCheckoutTicket.chairNumber || 'Sillón'}
          </p>
        </div>

        <form onSubmit={handleConfirmCheckout} className="space-y-5 pt-4 text-xs">
          
          {/* Items Summary list */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] space-y-2 max-h-36 overflow-y-auto pr-1">
            {activeCheckoutTicket.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[#44403C]">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold text-[#1C1917]">${item.total.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-bold text-[#44403C] mb-2">Método de Pago:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                id="method-card"
                onClick={() => setPaymentMethod('TARJETA_CREDITO')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'TARJETA_CREDITO'
                    ? 'bg-[#BE5A38] text-white border-[#BE5A38] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#57534E] border-[#E8DFD8] hover:bg-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="font-bold text-[11px]">Tarjeta Bancaria</span>
              </button>

              <button
                type="button"
                id="method-cash"
                onClick={() => setPaymentMethod('EFECTIVO')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'EFECTIVO'
                    ? 'bg-[#BE5A38] text-white border-[#BE5A38] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#57534E] border-[#E8DFD8] hover:bg-white'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span className="font-bold text-[11px]">Efectivo</span>
              </button>

              <button
                type="button"
                id="method-transfer"
                onClick={() => setPaymentMethod('TRANSFERENCIA')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'TRANSFERENCIA'
                    ? 'bg-[#BE5A38] text-white border-[#BE5A38] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#57534E] border-[#E8DFD8] hover:bg-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span className="font-bold text-[11px]">Transferencia</span>
              </button>

              <button
                type="button"
                id="method-points"
                onClick={() => setPaymentMethod('PUNTOS')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'PUNTOS'
                    ? 'bg-[#BE5A38] text-white border-[#BE5A38] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#57534E] border-[#E8DFD8] hover:bg-white'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span className="font-bold text-[11px]">Puntos Lealtad</span>
              </button>
            </div>
          </div>

          {/* Cash Change Calculator (when CASH is selected) */}
          {paymentMethod === 'EFECTIVO' && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 grid grid-cols-2 gap-4 animate-fadeIn">
              <div>
                <label className="block font-bold text-amber-900 mb-1">Efectivo Recibido ($ MXN):</label>
                <input
                  type="number"
                  min={finalTotal}
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 font-bold text-sm text-[#1C1917] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-amber-900 mb-1">Cambio a Entregar:</label>
                <p className="text-xl font-extrabold text-amber-900 mt-1.5">
                  ${changeDue.toLocaleString()} MXN
                </p>
              </div>
            </div>
          )}

          {/* Points Redemption (if client has points) */}
          {client && client.loyaltyPoints > 0 && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-950">Puntos de Lealtad Disponibles: {client.loyaltyPoints} pts</p>
                <p className="text-[10px] text-emerald-800">Equivalente a ${client.loyaltyPoints} MXN de saldo a favor</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={Math.min(client.loyaltyPoints, subtotal)}
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(Number(e.target.value))}
                  className="w-20 bg-white border border-emerald-300 rounded-xl px-2 py-1 text-xs font-bold text-emerald-950 text-right"
                />
                <span className="text-[11px] font-bold text-emerald-900">pts</span>
              </div>
            </div>
          )}

          {/* Discounts & Tips Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Discount */}
            <div>
              <label className="block font-bold text-[#44403C] mb-1">Descuento Promocional:</label>
              <div className="flex gap-1">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                      discountPercent === pct
                        ? 'bg-[#BE5A38] text-white border-[#BE5A38]'
                        : 'bg-[#FAF7F2] text-[#78716C] border-[#E8DFD8]'
                    }`}
                  >
                    {pct === 0 ? '0%' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div>
              <label className="block font-bold text-[#44403C] mb-1">Propina para el Staff:</label>
              <div className="flex gap-1">
                {[0, 10, 15, 20].map((tip) => (
                  <button
                    key={tip}
                    type="button"
                    onClick={() => {
                      setTipPercent(tip);
                      setCustomTip(0);
                    }}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                      tipPercent === tip && customTip === 0
                        ? 'bg-[#8D5B4C] text-white border-[#8D5B4C]'
                        : 'bg-[#FAF7F2] text-[#78716C] border-[#E8DFD8]'
                    }`}
                  >
                    {tip === 0 ? '0%' : `${tip}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Final Financial Breakdown */}
          <div className="pt-3 border-t border-[#E8DFD8] space-y-1.5 text-xs text-[#57534E]">
            <div className="flex justify-between">
              <span>Subtotal Servicios & Retail:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Descuento & Puntos aplicados:</span>
                <span>-${discountAmount.toLocaleString()}</span>
              </div>
            )}
            {depositCredited > 0 && (
              <div className="flex justify-between text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
                <span>Anticipo / Seña Pagada en Cita:</span>
                <span>-${depositCredited.toLocaleString()} MXN</span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="flex justify-between text-[#8D5B4C] font-semibold">
                <span>Propina del personal:</span>
                <span>+${tipAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-[#E8DFD8]">
              <span className="font-extrabold text-base text-[#1C1917]">Monto Final a Cobrar:</span>
              <span className="text-3xl font-extrabold text-[#BE5A38]">${finalTotal.toLocaleString()} MXN</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setActiveCheckoutTicket(null)}
              className="flex-1 py-3.5 bg-[#FAF7F2] text-[#78716C] font-bold rounded-2xl border border-[#E8DFD8] cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-confirm-payment"
              type="submit"
              className="flex-1 py-3.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold rounded-2xl shadow-lg hover:from-[#A84E30] hover:to-[#B45309] flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Pago & Cerrar Cuenta</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
