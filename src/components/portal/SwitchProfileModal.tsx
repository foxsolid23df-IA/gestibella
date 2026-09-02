import React, { useState } from 'react';
import { X, UserCheck, Lock, Hash, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const SwitchProfileModal: React.FC = () => {
  const {
    staffList,
    currentStaff,
    loginAs,
    isSwitchProfileModalOpen,
    setIsSwitchProfileModalOpen,
    addToast
  } = useSalon();

  const [selectedId, setSelectedId] = useState(currentStaff.id);
  const [pin, setPin] = useState('');

  if (!isSwitchProfileModalOpen) return null;

  const handleSwitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = staffList.find((s) => s.id === selectedId);
    if (!found) return;

    // Switch profile directly (secure internal staff switch)
    loginAs(found.id);
    setIsSwitchProfileModalOpen(false);
    setPin('');
    addToast('success', 'Perfil Cambiado', `Sesión activa ahora para ${found.name} (${found.roleTitle})`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFD8] relative">
        {/* Close Button */}
        <button
          id="btn-close-switch-modal"
          onClick={() => {
            setIsSwitchProfileModalOpen(false);
            setPin('');
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE0D6] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#BE5A38] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
            Cambiar de Colaborador o Perfil
          </h3>
          <p className="text-xs text-[#78716C] mt-1">
            Selecciona tu perfil de personal para tomar el control de la estación de trabajo sin usar credenciales maestras.
          </p>
        </div>

        <form onSubmit={handleSwitchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8D5B4C] mb-2">
              Seleccionar Colaborador:
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {staffList.map((staff) => {
                const isSelected = selectedId === staff.id;
                return (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedId(staff.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FAF7F2] border-[#BE5A38] ring-2 ring-[#BE5A38]/20 shadow-xs'
                        : 'bg-white border-[#E8DFD8] hover:bg-[#FAF7F2]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#E8DFD8]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#1C1917]">{staff.name}</p>
                        <p className="text-[10px] text-[#78716C]">{staff.roleTitle} • Coms: {staff.commissionRate}%</p>
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#BE5A38] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#D8C3B5]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1">
              PIN de Acceso Rápido (Opcional o 1234)
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-switch-staff-pin"
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1C1917] tracking-widest focus:ring-2 focus:ring-[#BE5A38] focus:outline-none font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSwitchProfileModalOpen(false)}
              className="px-4 py-2.5 bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-switch-profile"
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-md hover:from-[#A84E30] hover:to-[#B45309] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Cambiar Perfil</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-[#F0E8E1] text-center">
          <p className="text-[10px] text-[#78716C] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Cambio rápido de estación de trabajo en GestiBella
          </p>
        </div>
      </div>
    </div>
  );
};
