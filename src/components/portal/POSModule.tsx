import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  User,
  Scissors,
  ShoppingBag,
  Sparkles,
  DollarSign,
  CreditCard,
  Layers,
  ArrowRight,
  Printer,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { SaleTicket, TicketItem } from '../../types';

export const POSModule: React.FC = () => {
  const {
    ticketsList,
    servicesList,
    inventoryList,
    staffList,
    clientsList,
    createOpenTicket,
    addItemToTicket,
    removeItemFromTicket,
    setActiveCheckoutTicket,
    setActiveReceiptTicket
  } = useSalon();

  // Selected open ticket to edit
  const openHoldTickets = ticketsList.filter((t) => t.status === 'HOLD');
  const paidTickets = ticketsList.filter((t) => t.status === 'PAID');
  
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    openHoldTickets[0]?.id || ''
  );
  
  const [activeCatalogTab, setActiveCatalogTab] = useState<'SERVICES' | 'RETAIL'>('SERVICES');
  const [selectedStaffForService, setSelectedStaffForService] = useState(staffList[0]?.id || 'staff-1');

  // New Ticket Quick Form
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newChairNumber, setNewChairNumber] = useState('Sillón 1');

  // Currently viewing ticket
  const currentTicket = ticketsList.find((t) => t.id === selectedTicketId) || openHoldTickets[0];

  const handleCreateNewOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    const existingClient = clientsList.find((c) => c.name.toLowerCase() === newClientName.toLowerCase());
    const clientId = existingClient ? existingClient.id : clientsList[0]?.id || 'cli-1';

    const newTicket = createOpenTicket(clientId, newChairNumber);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketModalOpen(false);
    setNewClientName('');
  };

  const handleAddService = (serviceId: string) => {
    if (!currentTicket) return;
    const service = servicesList.find((s) => s.id === serviceId);
    const staff = staffList.find((st) => st.id === selectedStaffForService) || staffList[0];
    if (!service) return;

    const item: Omit<TicketItem, 'id'> = {
      type: 'SERVICE',
      itemId: service.id,
      name: service.name,
      quantity: 1,
      unitPrice: service.price,
      discount: 0,
      total: service.price,
      staffId: staff.id
    };

    addItemToTicket(currentTicket.id, item);
  };

  const handleAddRetail = (inventoryId: string) => {
    if (!currentTicket) return;
    const itemInv = inventoryList.find((i) => i.id === inventoryId);
    const staff = staffList.find((st) => st.id === selectedStaffForService) || staffList[0];
    if (!itemInv || !itemInv.retailPrice) return;

    const item: Omit<TicketItem, 'id'> = {
      type: 'PRODUCT',
      itemId: itemInv.id,
      name: itemInv.name,
      quantity: 1,
      unitPrice: itemInv.retailPrice,
      discount: 0,
      total: itemInv.retailPrice,
      staffId: staff.id
    };

    addItemToTicket(currentTicket.id, item);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Active Tabs Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <Receipt className="w-3.5 h-3.5" />
            <span>Punto de Venta & Ticket en Espera</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Caja & Cuentas Abiertas
          </h2>
          <p className="text-xs text-[#78716C]">
            Agrega consumos y productos de vitrina durante la cita antes del cobro final.
          </p>
        </div>

        <button
          id="btn-open-new-ticket-modal"
          onClick={() => setIsNewTicketModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Abrir Nueva Cuenta (Sillón)</span>
        </button>
      </div>

      {/* Selector of Open Hold Tickets */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-[#8D5B4C] shrink-0">
          Cuentas en Espera ({openHoldTickets.length}):
        </span>

        {openHoldTickets.map((t) => {
          const isSelected = currentTicket?.id === t.id;
          return (
            <button
              key={t.id}
              id={`tab-ticket-${t.id}`}
              onClick={() => setSelectedTicketId(t.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#BE5A38] text-white border-[#BE5A38] shadow-xs'
                  : 'bg-white text-[#44403C] border-[#E8DFD8] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{t.clientName} ({t.chairNumber || 'Sillón'})</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#BE5A38]'}`}>
                ${t.total.toLocaleString()}
              </span>
            </button>
          );
        })}

        {openHoldTickets.length === 0 && (
          <span className="text-xs text-[#A8A29E] italic">
            No hay cuentas abiertas. Abre una nueva o pasa una cita a sillón.
          </span>
        )}
      </div>

      {/* POS Working Grid: Left Catalog + Right Live Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Catalog (Services / Retail) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E8DFD8] shadow-xs space-y-4">
            
            {/* Tab switch + Stylist selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0E8E1]">
              <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DFD8]">
                <button
                  id="tab-catalog-services"
                  onClick={() => setActiveCatalogTab('SERVICES')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeCatalogTab === 'SERVICES'
                      ? 'bg-white text-[#BE5A38] shadow-xs'
                      : 'text-[#78716C]'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Servicios de Salón</span>
                </button>
                <button
                  id="tab-catalog-retail"
                  onClick={() => setActiveCatalogTab('RETAIL')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    activeCatalogTab === 'RETAIL'
                      ? 'bg-white text-[#BE5A38] shadow-xs'
                      : 'text-[#78716C]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Productos Retail (Vitrina)</span>
                </button>
              </div>

              {/* Performing Stylist */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#78716C]">Atendido por:</span>
                <select
                  value={selectedStaffForService}
                  onChange={(e) => setSelectedStaffForService(e.target.value)}
                  className="bg-[#FAF7F2] text-xs font-bold text-[#1C1917] border border-[#D8C3B5] rounded-xl px-2.5 py-1 focus:outline-none"
                >
                  {staffList.filter((s) => s.role !== 'RECEPTIONIST').map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.roleTitle})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            {activeCatalogTab === 'SERVICES' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {servicesList.map((srv) => (
                  <div
                    key={srv.id}
                    id={`srv-btn-${srv.id}`}
                    onClick={() => handleAddService(srv.id)}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] hover:border-[#BE5A38] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-[#1C1917] group-hover:text-[#BE5A38] transition-colors">
                          {srv.name}
                        </h4>
                        <span className="text-[10px] font-bold text-[#8D5B4C] bg-white px-2 py-0.5 rounded-full border border-[#E8DFD8]">
                          {srv.durationMinutes} min
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-1">{srv.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8DFD8]">
                      <span className="font-extrabold text-sm text-[#1C1917]">
                        ${srv.price.toLocaleString()} MXN
                      </span>
                      <span className="text-xs font-bold text-[#BE5A38] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Retail Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {inventoryList
                  .filter((item) => item.isRetail && item.retailPrice)
                  .map((prod) => (
                    <div
                      key={prod.id}
                      id={`prod-btn-${prod.id}`}
                      onClick={() => handleAddRetail(prod.id)}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD8] hover:border-[#BE5A38] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-[#1C1917] group-hover:text-[#BE5A38] transition-colors">
                            {prod.name}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              prod.currentStock <= prod.minStock
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            Stock: {prod.currentStock}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C] mt-1">{prod.category} • SKU: {prod.sku}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8DFD8]">
                        <span className="font-extrabold text-sm text-[#1C1917]">
                          ${prod.retailPrice?.toLocaleString()} MXN
                        </span>
                        <span className="text-xs font-bold text-[#BE5A38] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

          </div>
        </div>

        {/* Right Column (5 cols): Active Hold Ticket Details */}
        <div className="lg:col-span-5 space-y-4">
          {currentTicket ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-[#BE5A38]/30 shadow-md space-y-4">
              
              {/* Ticket Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E8E1]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury font-bold text-lg text-[#1C1917]">
                      {currentTicket.clientName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {currentTicket.chairNumber || 'En Atención'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] font-mono mt-0.5">
                    {currentTicket.ticketNumber} • {currentTicket.createdAt}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FAF7F2] text-[#BE5A38] border border-[#E8DFD8]">
                  Ticket en Espera
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 min-h-[160px] max-h-[300px] overflow-y-auto pr-1">
                {currentTicket.items.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#A8A29E]">
                    Esta cuenta aún no tiene consumos. Agrega un servicio o producto de la lista izquierda.
                  </div>
                ) : (
                  currentTicket.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1C1917]">{item.name}</span>
                          <span className="text-[10px] text-[#8D5B4C] font-semibold">
                            ({item.staffName ? item.staffName.split(' ')[0] : 'Staff'})
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C]">
                          {item.quantity} x ${item.unitPrice.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1C1917]">${item.total.toLocaleString()}</span>
                        <button
                          onClick={() => removeItemFromTicket(currentTicket.id, item.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Financial Calculation summary */}
              <div className="pt-3 border-t border-[#E8DFD8] space-y-1.5 text-xs text-[#57534E]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${currentTicket.subtotal.toLocaleString()}</span>
                </div>
                {currentTicket.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Descuento aplicado:</span>
                    <span>-${currentTicket.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {currentTicket.tipAmount > 0 && (
                  <div className="flex justify-between text-[#8D5B4C]">
                    <span>Propina del personal:</span>
                    <span>+${currentTicket.tipAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline font-extrabold text-lg text-[#1C1917] pt-2 border-t border-[#E8DFD8]">
                  <span>Total a Pagar:</span>
                  <span className="text-2xl text-[#BE5A38]">${currentTicket.total.toLocaleString()} MXN</span>
                </div>
              </div>

              {/* Action: Proceed to Checkout */}
              <button
                id="btn-pos-proceed-checkout"
                disabled={currentTicket.items.length === 0}
                onClick={() => setActiveCheckoutTicket(currentTicket)}
                className="w-full py-3.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] hover:from-[#A84E30] hover:to-[#B45309] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>Proceder al Cobro y Facturación</span>
              </button>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#E8DFD8] text-center space-y-3">
              <p className="text-xs text-[#78716C]">Selecciona un ticket en espera o abre uno nuevo para comenzar.</p>
            </div>
          )}

          {/* Recently Paid Tickets list */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8DFD8] shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-[#1C1917] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tickets Cobrados Hoy ({paidTickets.length})</span>
            </h4>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {paidTickets.map((pt) => (
                <div
                  key={pt.id}
                  className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD8] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#1C1917]">{pt.clientName}</span>
                    <p className="text-[10px] text-[#78716C]">
                      {pt.ticketNumber} • Pagado con {pt.paymentMethod}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-emerald-700">${pt.total.toLocaleString()}</span>
                    <button
                      onClick={() => setActiveReceiptTicket(pt)}
                      className="p-1.5 text-[#8D5B4C] hover:text-[#BE5A38] hover:bg-white rounded-lg transition-colors"
                      title="Imprimir ticket"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Open New Ticket */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8]">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917] mb-4">
              Abrir Cuenta en Sillón (Ticket en Espera)
            </h3>

            <form onSubmit={handleCreateNewOpenTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] mb-1">Nombre de la Clienta / Cliente</label>
                <input
                  id="input-pos-new-client"
                  type="text"
                  required
                  placeholder="Ej. Valeria Montes"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">Sillón / Cabina de Atención</label>
                <select
                  id="select-pos-new-chair"
                  value={newChairNumber}
                  onChange={(e) => setNewChairNumber(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                >
                  <option value="Sillón 1">Sillón 1 (Principal)</option>
                  <option value="Sillón 2">Sillón 2 (Corte & Peinado)</option>
                  <option value="Sillón 3">Sillón 3 (Colorimetría)</option>
                  <option value="Cabina Spa 1">Cabina Spa 1 (Tratamientos)</option>
                  <option value="Lavacabezas">Lavacabezas</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="flex-1 py-3 bg-[#FAF7F2] text-[#78716C] font-bold rounded-xl border border-[#E8DFD8]"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-create-ticket"
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold rounded-xl shadow-md"
                >
                  Abrir Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
