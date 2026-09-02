import React, { useState } from 'react';
import {
  HeartHandshake,
  Star,
  Gift,
  Search,
  Plus,
  Phone,
  Layers,
  FlaskConical,
  Award
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { ClientProfile } from '../../types';

export const CRMModule: React.FC = () => {
  const {
    clientsList,
    formulasList,
    addStampToClient,
    redeemStampCardReward,
    usePackageSession,
    addClient
  } = useSalon();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clientsList[0]?.id || ''
  );

  // New Client Modal State
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');

  const filteredClients = clientsList.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const selectedClient = clientsList.find((c) => c.id === selectedClientId) || clientsList[0];
  const clientFormulas = formulasList.filter((f) => f.clientId === selectedClient?.id);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;

    addClient({
      name: newClientName,
      phone: newClientPhone || '+52 55 0000 0000',
      email: newClientEmail || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      allergiesOrNotes: newClientNotes
    });

    setIsNewClientModalOpen(false);
    setNewClientName('');
    setNewClientPhone('');
    setNewClientEmail('');
    setNewClientNotes('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Fidelización & CRM</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Expediente 360° de Clientas & Sellos
          </h2>
          <p className="text-xs text-[#78716C]">
            Tarjetas de sellos virtuales, monedero de puntos y billetera de sesiones prepagadas.
          </p>
        </div>

        <button
          id="btn-new-crm-client"
          onClick={() => setIsNewClientModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white hover:from-[#A84E30] hover:to-[#B45309] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Clienta</span>
        </button>
      </div>

      {/* Main 2-Column CRM Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (4 cols): Clients Directory & Search */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#E8DFD8] shadow-xs space-y-4">
          
          <div className="relative">
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#1C1917] focus:ring-1 focus:ring-[#BE5A38] focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  id={`client-item-${client.id}`}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF7F2] border-[#BE5A38] shadow-xs ring-1 ring-[#BE5A38]/30'
                      : 'bg-white border-[#E8DFD8] hover:bg-[#FAF7F2]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#1C1917]">{client.name}</h4>
                    <span className="text-[10px] font-bold text-[#BE5A38] bg-white px-2 py-0.5 rounded-full border border-[#E8DFD8]">
                      {client.loyaltyPoints} Pts
                    </span>
                  </div>

                  <p className="text-[11px] text-[#78716C] mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#8D5B4C]" />
                    <span>{client.phone}</span>
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#8D5B4C] mt-2 pt-2 border-t border-[#F0E8E1]">
                    <span>{client.visitCount} visitas realizadas</span>
                    <strong>${client.totalSpent.toLocaleString()} gastados</strong>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column (8 cols): 360 Client Profile Deep Dive */}
        <div className="lg:col-span-8 space-y-6">
          {selectedClient ? (
            <>
              {/* Profile Card Header */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD8] shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E8E1]">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#BE5A38]/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
                          {selectedClient.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FAF7F2] text-[#BE5A38] border border-[#E8DFD8]">
                          Clienta VIP
                        </span>
                      </div>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {selectedClient.phone} • {selectedClient.email || 'Sin correo registrado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 text-center">
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DFD8] min-w-[90px]">
                      <span className="text-[10px] font-bold text-[#78716C] uppercase">Puntos</span>
                      <p className="text-xl font-extrabold text-[#BE5A38]">{selectedClient.loyaltyPoints}</p>
                    </div>
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DFD8] min-w-[90px]">
                      <span className="text-[10px] font-bold text-[#78716C] uppercase">Visitas</span>
                      <p className="text-xl font-extrabold text-[#1C1917]">{selectedClient.visitCount}</p>
                    </div>
                    <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DFD8] min-w-[90px]">
                      <span className="text-[10px] font-bold text-[#78716C] uppercase">Total Invertido</span>
                      <p className="text-xl font-extrabold text-[#1C1917]">${selectedClient.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Virtual Stamp Card Feature (La Tarjeta de Sellos Virtuales) */}
                <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F4EFEA] rounded-3xl p-6 border-2 border-[#BE5A38]/30 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[11px] font-extrabold text-[#BE5A38] border border-[#E8DFD8]">
                        <Award className="w-3.5 h-3.5" />
                        <span>Tarjeta de Sellos Virtual (6to Servicio de Cortesía)</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1C1917] mt-1">
                        Premio: Tratamiento Capilar Hidratante o Manicura Spa Gratis
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="btn-add-stamp"
                        onClick={() => addStampToClient(selectedClient.id)}
                        className="px-3.5 py-1.5 bg-[#BE5A38] hover:bg-[#A84E30] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Marcar Sello</span>
                      </button>

                      {selectedClient.stampCardCount >= 6 && (
                        <button
                          id="btn-redeem-stamp-reward"
                          onClick={() => redeemStampCardReward(selectedClient.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 animate-bounce cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Canjear Premio</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 6 Stamps Visual Board */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                    {[...Array(6)].map((_, idx) => {
                      const isStamped = idx < selectedClient.stampCardCount;
                      const isLast = idx === 5;

                      return (
                        <div
                          key={idx}
                          className={`h-20 rounded-2xl border flex flex-col items-center justify-center p-2 text-center transition-all ${
                            isStamped
                              ? 'bg-white border-[#BE5A38] shadow-sm text-[#BE5A38]'
                              : 'bg-white/50 border-dashed border-[#D8C3B5] text-[#A8A29E]'
                          }`}
                        >
                          {isStamped ? (
                            <>
                              <Star className="w-6 h-6 fill-[#BE5A38] text-[#BE5A38]" />
                              <span className="text-[10px] font-extrabold mt-1">Sello #{idx + 1}</span>
                            </>
                          ) : isLast ? (
                            <>
                              <Gift className="w-6 h-6 text-[#BE5A38]" />
                              <span className="text-[9px] font-bold text-[#BE5A38] mt-0.5">¡Premio!</span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 rounded-full border border-dashed border-[#A8A29E] flex items-center justify-center text-[10px] font-bold">
                                {idx + 1}
                              </div>
                              <span className="text-[9px] mt-1">Pendiente</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-[#78716C] italic text-right">
                    {selectedClient.stampCardCount} de 6 sellos acumulados.
                  </p>
                </div>

                {/* Pre-paid Multi-Session Packages */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-[#1C1917] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#BE5A38]" />
                    <span>Paquetes de Sesiones Prepagadas ({selectedClient.activePackages.length})</span>
                  </h4>

                  {selectedClient.activePackages.length === 0 ? (
                    <p className="text-xs text-[#A8A29E] italic">Esta clienta no tiene paquetes activos en este momento.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedClient.activePackages.map((pkg, idx) => (
                        <div
                          key={idx}
                          className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex justify-between">
                              <h5 className="font-bold text-xs text-[#1C1917]">{pkg.packageName}</h5>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Activo
                              </span>
                            </div>
                            <p className="text-[11px] text-[#78716C] mt-1">
                              Vence: {pkg.expiryDate}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD8]">
                            <span className="text-xs font-extrabold text-[#BE5A38]">
                              {pkg.totalSessions - pkg.usedSessions} de {pkg.totalSessions} restantes
                            </span>

                            {pkg.usedSessions < pkg.totalSessions && (
                              <button
                                onClick={() => usePackageSession(selectedClient.id, idx)}
                                className="px-3 py-1.5 bg-[#BE5A38] hover:bg-[#A84E30] text-white text-[11px] font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                              >
                                Consumir 1 Sesión
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Technical Color Formulas on Record */}
                <div className="space-y-3 pt-4 border-t border-[#F0E8E1]">
                  <h4 className="font-bold text-sm text-[#1C1917] flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#BE5A38]" />
                    <span>Fórmulas de Colorimetría Registradas ({clientFormulas.length})</span>
                  </h4>

                  {clientFormulas.length === 0 ? (
                    <p className="text-xs text-[#A8A29E] italic">Sin recetas registradas.</p>
                  ) : (
                    <div className="space-y-2">
                      {clientFormulas.map((f) => (
                        <div key={f.id} className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] text-xs">
                          <div className="flex justify-between font-bold text-[#1C1917]">
                            <span>{f.serviceType} (Base: {f.baseNatural})</span>
                            <span className="text-[#8D5B4C]">{f.date}</span>
                          </div>
                          <p className="font-mono text-[11px] text-[#BE5A38] font-semibold mt-1">{f.formulaDetails}</p>
                          {f.notes && <p className="text-[11px] text-[#78716C] mt-1 italic">{f.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes & Allergies */}
                {selectedClient.allergiesOrNotes && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
                    <p className="text-amber-900 font-bold">
                      ⚠️ Observaciones / Alergias: <span className="font-normal">{selectedClient.allergiesOrNotes}</span>
                    </p>
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-[#E8DFD8] text-center">
              <p className="text-xs text-[#78716C]">Selecciona una clienta del menú izquierdo para ver su expediente.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal: New Client */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-[#E8DFD8]">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917] mb-4">
              Registrar Nueva Clienta
            </h3>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#44403C] mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Gabriela Morales"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+52 55..."
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#44403C] mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#44403C] mb-1">Observaciones / Alergias</label>
                <input
                  type="text"
                  placeholder="Ej. Alérgica al amoníaco / cuero cabelludo sensible"
                  value={newClientNotes}
                  onChange={(e) => setNewClientNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="flex-1 py-3 bg-[#FAF7F2] text-[#78716C] font-bold rounded-xl border border-[#E8DFD8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Crear Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
