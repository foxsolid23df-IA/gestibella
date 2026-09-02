import React, { useState } from 'react';
import {
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Sliders,
  Scissors,
  ShoppingBag
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { StaffMember } from '../../types';

export const StaffCommissionsModule: React.FC = () => {
  const {
    staffList,
    ticketsList
  } = useSalon();

  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [tempServiceRate, setTempServiceRate] = useState<number>(45);
  const [tempProductRate, setTempProductRate] = useState<number>(15);
  const [settlementSuccess, setSettlementSuccess] = useState(false);

  // Calculate accrued commissions per staff from paid tickets
  const paidTickets = ticketsList.filter((t) => t.status === 'PAID');

  const staffPerformance = staffList.map((staff) => {
    let serviceSalesTotal = 0;
    let productSalesTotal = 0;
    let tipsTotal = 0;

    paidTickets.forEach((ticket) => {
      ticket.items.forEach((item) => {
        if (item.staffId === staff.id) {
          if (item.type === 'SERVICE') {
            serviceSalesTotal += item.total;
          } else if (item.type === 'PRODUCT') {
            productSalesTotal += item.total;
          }
        }
      });

      // Split tips if this staff served the client
      if (ticket.items.some((i) => i.staffId === staff.id) && ticket.tip > 0) {
        tipsTotal += ticket.tip / (ticket.items.length || 1);
      }
    });

    const serviceCommissionAccrued = (serviceSalesTotal * staff.serviceCommissionRate);
    const productCommissionAccrued = (productSalesTotal * staff.productCommissionRate);
    const totalEarnings = serviceCommissionAccrued + productCommissionAccrued + tipsTotal;

    return {
      staff,
      serviceSalesTotal,
      productSalesTotal,
      serviceCommissionAccrued,
      productCommissionAccrued,
      tipsTotal,
      totalEarnings
    };
  });

  const totalCommissionsAllStaff = staffPerformance.reduce((sum, sp) => sum + sp.totalEarnings, 0);
  const totalSalesAllStaff = staffPerformance.reduce((sum, sp) => sum + sp.serviceSalesTotal + sp.productSalesTotal, 0);

  const handleStartEdit = (staff: StaffMember) => {
    setEditingStaffId(staff.id);
    setTempServiceRate(Math.round(staff.serviceCommissionRate * 100));
    setTempProductRate(Math.round(staff.productCommissionRate * 100));
  };

  const handleSaveRates = (staffId: string) => {
    const target = staffList.find((s) => s.id === staffId);
    if (target) {
      target.serviceCommissionRate = tempServiceRate / 100;
      target.productCommissionRate = tempProductRate / 100;
    }
    setEditingStaffId(null);
  };

  const handleGenerateSettlement = () => {
    setSettlementSuccess(true);
    setTimeout(() => setSettlementSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Recursos Humanos & Nómina</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Liquidación Automática de Comisiones
          </h2>
          <p className="text-xs text-[#78716C]">
            Cálculo transparente en tiempo real por servicios realizados y venta de productos en vitrina.
          </p>
        </div>

        <button
          id="btn-generate-settlement"
          onClick={handleGenerateSettlement}
          className="px-5 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Generar Reporte de Pago / Liquidación</span>
        </button>
      </div>

      {settlementSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>¡Reporte de nómina y comisiones generado exitosamente! Listo para dispersión bancaria.</span>
        </div>
      )}

      {/* 3 Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#78716C]">Ventas Totales Generadas por el Equipo</span>
          <p className="text-3xl font-extrabold text-[#1C1917]">
            ${totalSalesAllStaff.toLocaleString()} <span className="text-xs text-[#78716C]">MXN</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">Servicios + Retail cobrados hoy</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#78716C]">Total Comisiones & Propinas a Dispersar</span>
          <p className="text-3xl font-extrabold text-[#BE5A38]">
            ${totalCommissionsAllStaff.toLocaleString()} <span className="text-xs text-[#78716C]">MXN</span>
          </p>
          <p className="text-[11px] text-[#8D5B4C] font-semibold">Acumulado en tiempo real</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E8DFD8] shadow-xs space-y-1">
          <span className="text-xs font-bold text-[#78716C]">Margen Neto del Salón (Post Comisiones)</span>
          <p className="text-3xl font-extrabold text-emerald-700">
            ${(totalSalesAllStaff - totalCommissionsAllStaff).toLocaleString()} <span className="text-xs text-[#78716C]">MXN</span>
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">
            {totalSalesAllStaff > 0 ? Math.round(((totalSalesAllStaff - totalCommissionsAllStaff) / totalSalesAllStaff) * 100) : 0}% de retención operativa
          </p>
        </div>

      </div>

      {/* Staff Breakdown Cards Table */}
      <div className="space-y-4">
        <h3 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
          Desglose Individual por Colaborador
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {staffPerformance.map(({
            staff,
            serviceSalesTotal,
            productSalesTotal,
            serviceCommissionAccrued,
            productCommissionAccrued,
            tipsTotal,
            totalEarnings
          }) => {
            const isEditing = editingStaffId === staff.id;
            const servicePct = Math.round(staff.serviceCommissionRate * 100);
            const productPct = Math.round(staff.productCommissionRate * 100);

            return (
              <div
                key={staff.id}
                id={`staff-card-${staff.id}`}
                className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-5 flex flex-col justify-between"
              >
                {/* Header Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#BE5A38]/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif-luxury font-bold text-lg text-[#1C1917]">
                          {staff.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8D5B4C] border border-[#E8DFD8]">
                          {staff.role}
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C]">{staff.roleTitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartEdit(staff)}
                    className="p-2 text-[#78716C] hover:text-[#BE5A38] hover:bg-[#FAF7F2] rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title="Ajustar porcentajes de comisión"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Configurar %</span>
                  </button>
                </div>

                {/* Edit Commission Rates Inline Form */}
                {isEditing && (
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D8C3B5] space-y-3 animate-fadeIn">
                    <p className="font-bold text-xs text-[#1C1917]">Ajustar Porcentajes de Comisión:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#78716C] font-semibold mb-1">
                          % Comisión Servicios:
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tempServiceRate}
                          onChange={(e) => setTempServiceRate(Number(e.target.value))}
                          className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3 py-1.5 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#78716C] font-semibold mb-1">
                          % Comisión Retail/Vitrina:
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tempProductRate}
                          onChange={(e) => setTempProductRate(Number(e.target.value))}
                          className="w-full bg-white border border-[#D8C3B5] rounded-xl px-3 py-1.5 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingStaffId(null)}
                        className="px-3 py-1 bg-white text-[#78716C] text-xs font-bold rounded-lg border border-[#E8DFD8] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveRates(staff.id)}
                        className="px-3 py-1 bg-[#BE5A38] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                      >
                        Guardar %
                      </button>
                    </div>
                  </div>
                )}

                {/* Earnings Calculation Breakdown */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] space-y-2.5 text-xs">
                  
                  {/* Row 1: Services */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#44403C]">
                      <Scissors className="w-3.5 h-3.5 text-[#BE5A38]" />
                      <span>Servicios Realizados (${serviceSalesTotal.toLocaleString()} al {servicePct}%):</span>
                    </div>
                    <span className="font-bold text-[#1C1917]">${serviceCommissionAccrued.toLocaleString()} MXN</span>
                  </div>

                  {/* Row 2: Retail Products */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#44403C]">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Venta Retail (${productSalesTotal.toLocaleString()} al {productPct}%):</span>
                    </div>
                    <span className="font-bold text-[#1C1917]">${productCommissionAccrued.toLocaleString()} MXN</span>
                  </div>

                  {/* Row 3: Tips */}
                  {tipsTotal > 0 && (
                    <div className="flex items-center justify-between text-[#8D5B4C]">
                      <span>Propinas recibidas:</span>
                      <span className="font-bold">+${tipsTotal.toLocaleString()} MXN</span>
                    </div>
                  )}

                  {/* Total to Payout */}
                  <div className="pt-2 border-t border-[#E8DFD8] flex items-baseline justify-between">
                    <span className="font-extrabold text-sm text-[#1C1917]">Ganancia Neta Total:</span>
                    <span className="text-xl font-extrabold text-[#BE5A38]">${totalEarnings.toLocaleString()} MXN</span>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between text-xs text-[#78716C] pt-2">
                  <span>Esquema: {servicePct}% Serv / {productPct}% Prod</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Al día
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
