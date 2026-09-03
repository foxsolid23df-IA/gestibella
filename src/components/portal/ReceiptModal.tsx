import React from 'react';
import {
  X,
  Printer,
  Scissors
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const ReceiptModal: React.FC = () => {
  const { activeReceiptTicket, setActiveReceiptTicket, staffList, receiptConfig } = useSalon();

  if (!activeReceiptTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8] animate-fadeIn text-[#1C1917]">
        
        {/* Close button */}
        <button
          onClick={() => setActiveReceiptTicket(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Thermal Receipt Box */}
        <div
          id="thermal-receipt"
          className="space-y-3 text-center font-mono pt-2"
          style={{
            fontSize: receiptConfig.fontSize === 'xs' ? '10px' : receiptConfig.fontSize === 'sm' ? '11px' : '12px',
            lineHeight: receiptConfig.spacing === 'compact' ? '1.2' : receiptConfig.spacing === 'spacious' ? '1.6' : '1.4'
          }}
        >
          
          {/* Header */}
          <div className="space-y-1 pb-3 border-b border-dashed border-[#A8A29E]">
            {receiptConfig.showLogo && receiptConfig.logoUrl ? (
              <img
                src={receiptConfig.logoUrl}
                alt="Logo"
                className="w-10 h-10 rounded-xl object-cover mx-auto mb-1 border"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-2xl text-white flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: receiptConfig.accentColor }}
              >
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
            )}
            <h3 className="font-serif-luxury font-bold text-base font-sans text-[#1C1917]">
              {receiptConfig.salonName}
            </h3>
            {receiptConfig.salonSlogan && (
              <p className="text-[10px] text-[#78716C] font-sans italic">{receiptConfig.salonSlogan}</p>
            )}
            <p className="text-[10px] text-[#78716C] font-sans">
              {receiptConfig.address}<br />
              Tel: {receiptConfig.phone}
              {receiptConfig.showTaxId && receiptConfig.taxId && <><br />RFC ref: {receiptConfig.taxId} <span className="text-[8px]">(no fiscal)</span></>}
            </p>
            <p className="text-[8px] font-bold tracking-widest text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1 font-sans">TICKET NO FISCAL — SIN VALIDEZ SAT · Factura manual 24h por WhatsApp</p>
          </div>

          {/* Ticket metadata */}
          <div className="text-left text-[11px] space-y-1 pb-3 border-b border-dashed border-[#A8A29E]">
            <div className="flex justify-between">
              <span>FOLIO:</span>
              <strong style={{ color: receiptConfig.accentColor }}>{activeReceiptTicket.ticketNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span>FECHA / HORA:</span>
              <span>{activeReceiptTicket.createdAt}</span>
            </div>
            {receiptConfig.showClientName && (
              <div className="flex justify-between">
                <span>CLIENTA:</span>
                <strong>{activeReceiptTicket.clientName}</strong>
              </div>
            )}
            {receiptConfig.showChairNumber && (
              <div className="flex justify-between">
                <span>UBICACIÓN:</span>
                <span>{activeReceiptTicket.chairNumber || 'Sillón Principal'}</span>
              </div>
            )}
          </div>

          {/* Items breakdown */}
          <div className="text-left space-y-2 py-2 border-b border-dashed border-[#A8A29E]">
            {activeReceiptTicket.items.map((item, idx) => {
              const staff = staffList.find((s) => s.id === item.staffId);
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold text-[#1C1917]">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${item.total.toLocaleString()}</span>
                  </div>
                  {receiptConfig.showStaffName && (
                    <div className="text-[10px] text-[#78716C] flex justify-between">
                      <span>Atendido por {staff ? staff.name : 'Staff'}</span>
                      <span>(${item.unitPrice} c/u)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="text-left space-y-1 py-2 border-b border-dashed border-[#A8A29E] text-[11px]">
            <div className="flex justify-between text-[#78716C]">
              <span>SUBTOTAL:</span>
              <span>${activeReceiptTicket.subtotal.toLocaleString()} MXN</span>
            </div>
            {activeReceiptTicket.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>DESCUENTO:</span>
                <span>-${activeReceiptTicket.discountTotal.toLocaleString()} MXN</span>
              </div>
            )}
            {activeReceiptTicket.depositCredited && activeReceiptTicket.depositCredited > 0 ? (
              <div className="flex justify-between text-blue-800 font-bold">
                <span>ANTICIPO / SEÑA:</span>
                <span>-${activeReceiptTicket.depositCredited.toLocaleString()} MXN</span>
              </div>
            ) : null}
            {activeReceiptTicket.tip > 0 && (
              <div className="flex justify-between" style={{ color: receiptConfig.accentColor }}>
                <span>PROPINA STAFF:</span>
                <span>+${activeReceiptTicket.tip.toLocaleString()} MXN</span>
              </div>
            )}
            <div
              className="flex justify-between text-base font-extrabold text-[#1C1917] pt-1"
              style={{ color: receiptConfig.accentColor }}
            >
              <span>TOTAL:</span>
              <span>${activeReceiptTicket.total.toLocaleString()} MXN</span>
            </div>
          </div>

          {/* Payment method & loyalty bonus */}
          <div className="text-left text-[10px] space-y-1 pb-3 border-b border-dashed border-[#A8A29E]">
            <div className="flex justify-between">
              <span>MÉTODO DE PAGO:</span>
              <strong className="uppercase">{activeReceiptTicket.paymentMethod || 'EFECTIVO'}</strong>
            </div>
            {receiptConfig.showLoyaltyPoints && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>PUNTOS LEALTAD GANADOS:</span>
                <span>+{Math.round(activeReceiptTicket.total * 0.05)} PTS ★</span>
              </div>
            )}
          </div>

          {/* Barcode & Salon Thank You */}
          <div className="pt-2 space-y-2">
            {receiptConfig.showBarcode && (
              <div className="h-8 bg-neutral-900 mx-auto rounded flex items-center justify-center text-white text-[9px] tracking-[0.25em]">
                ||||| | |||| |||| ||| ||||||| |||
              </div>
            )}
            <p className="text-[10px] text-[#78716C] font-sans italic">
              {receiptConfig.customFooterMessage}
            </p>
            <p className="text-[8px] text-[#A8A29E] font-sans">Este comprobante no es CFDI. Solicita tu factura manual en 24h.</p>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-[#E8DFD8] flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            style={{ backgroundColor: receiptConfig.accentColor }}
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket</span>
          </button>
          
          <button
            onClick={() => setActiveReceiptTicket(null)}
            className="px-4 py-2.5 bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] font-bold text-xs rounded-xl border border-[#E8DFD8] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
