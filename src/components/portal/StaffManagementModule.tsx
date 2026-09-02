import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Mail,
  Phone,
  Percent,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  X,
  Save,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import { StaffMember, UserRole } from '../../types';

export const StaffManagementModule: React.FC = () => {
  const { staffList, addStaffMember, updateStaffMember, deleteStaffMember, currentStaff, addToast } = useSalon();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STYLIST');
  const [roleTitle, setRoleTitle] = useState('Estilista Senior');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCommissionRate, setServiceCommissionRate] = useState('40');
  const [productCommissionRate, setProductCommissionRate] = useState('15');
  const [specialtiesStr, setSpecialtiesStr] = useState('Corte, Colorimetría');
  const [colorTag, setColorTag] = useState('#BE5A38');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [isActive, setIsActive] = useState(true);

  // Permissions state
  const [canAccessPOS, setCanAccessPOS] = useState(true);
  const [canAccessFinances, setCanAccessFinances] = useState(false);
  const [canAccessInventory, setCanAccessInventory] = useState(true);
  const [canAccessReports, setCanAccessReports] = useState(false);
  const [canManageStaff, setCanManageStaff] = useState(false);

  const openCreateModal = () => {
    setEditingStaffId(null);
    setName('');
    setRole('STYLIST');
    setRoleTitle('Estilista & Colorista');
    setEmail('');
    setPhone('+52 55 ');
    setServiceCommissionRate('40');
    setProductCommissionRate('15');
    setSpecialtiesStr('Corte, Brushing, Tratamientos');
    setColorTag('#BE5A38');
    setAvatar('https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80');
    setIsActive(true);
    setCanAccessPOS(true);
    setCanAccessFinances(false);
    setCanAccessInventory(true);
    setCanAccessReports(false);
    setCanManageStaff(false);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: StaffMember) => {
    setEditingStaffId(staff.id);
    setName(staff.name);
    setRole(staff.role);
    setRoleTitle(staff.roleTitle);
    setEmail(staff.email);
    setPhone(staff.phone);
    setServiceCommissionRate(String(staff.serviceCommissionRate * 100));
    setProductCommissionRate(String(staff.productCommissionRate * 100));
    setSpecialtiesStr(staff.specialties.join(', '));
    setColorTag(staff.colorTag || '#BE5A38');
    setAvatar(staff.avatar);
    setIsActive(staff.isActive);

    const perms = staff.permissions || {
      canAccessPOS: true,
      canAccessFinances: staff.role === 'ADMIN',
      canAccessInventory: true,
      canAccessReports: staff.role === 'ADMIN' || staff.role === 'MANAGER',
      canManageStaff: staff.role === 'ADMIN'
    };
    setCanAccessPOS(perms.canAccessPOS);
    setCanAccessFinances(perms.canAccessFinances);
    setCanAccessInventory(perms.canAccessInventory);
    setCanAccessReports(perms.canAccessReports);
    setCanManageStaff(perms.canManageStaff);

    setIsModalOpen(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('error', 'Campos Incompletos', 'Por favor ingresa al menos el nombre y correo del colaborador.');
      return;
    }

    const specialties = specialtiesStr.split(',').map((s) => s.trim()).filter(Boolean);
    const sRate = parseFloat(serviceCommissionRate) / 100 || 0.40;
    const pRate = parseFloat(productCommissionRate) / 100 || 0.15;

    const permissions = {
      canAccessPOS,
      canAccessFinances,
      canAccessInventory,
      canAccessReports,
      canManageStaff
    };

    if (editingStaffId) {
      updateStaffMember(editingStaffId, {
        name,
        role,
        roleTitle,
        email,
        phone,
        serviceCommissionRate: sRate,
        productCommissionRate: pRate,
        specialties,
        colorTag,
        avatar,
        isActive,
        permissions
      });
    } else {
      addStaffMember({
        name,
        role,
        roleTitle,
        email,
        phone,
        serviceCommissionRate: sRate,
        productCommissionRate: pRate,
        specialties,
        colorTag,
        avatar,
        isActive,
        permissions
      });
    }

    setIsModalOpen(false);
  };

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'MANAGER':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'STYLIST':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'RECEPTIONIST':
        return 'bg-blue-100 text-blue-900 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C1917] via-[#2D2A26] to-[#44403C] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#BE5A38]/30 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#BE5A38] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                Control de Acceso & Staff
              </span>
              <span className="text-xs text-[#D8C3B5]">GestiBella Pro Security</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight">
              Gestión de Personal & Permisos
            </h1>
            <p className="text-xs sm:text-sm text-[#D8C3B5] mt-1 max-w-2xl">
              Da de alta nuevos colaboradores, edita sus perfiles, configura tasas de comisiones individuales y asigna permisos específicos para el uso de los módulos del sistema.
            </p>
          </div>

          <button
            id="btn-open-add-staff"
            onClick={openCreateModal}
            className="px-5 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold text-xs rounded-2xl shadow-lg hover:from-[#A84E30] hover:to-[#B45309] transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Dar de Alta Colaborador</span>
          </button>
        </div>
      </div>

      {/* Operational Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-bold">
          i
        </div>
        <div>
          <span className="font-bold">Modelo Operativo del Salón:</span> La aplicación GestiBella es operada exclusivamente por el <strong>Administrador</strong> y la <strong>Recepcionista</strong>. Los trabajadores (estilistas) no necesitan cuenta ni acceso a la app; la recepción gestiona la agenda y les asigna e indica sus citas directamente. Este módulo permite registrarlos para calcular sus comisiones y asignarles servicios en el calendario general.
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => {
          const isCurrent = staff.id === currentStaff.id;
          const perms = staff.permissions || {
            canAccessPOS: true,
            canAccessFinances: staff.role === 'ADMIN',
            canAccessInventory: true,
            canAccessReports: staff.role === 'ADMIN' || staff.role === 'MANAGER',
            canManageStaff: staff.role === 'ADMIN'
          };

          return (
            <div
              key={staff.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-sm flex flex-col justify-between ${
                isCurrent ? 'border-[#BE5A38] ring-2 ring-[#BE5A38]/20 bg-gradient-to-b from-[#FAF7F2]/50 to-white' : 'border-[#E8DFD8] hover:shadow-md'
              }`}
            >
              <div>
                {/* Top info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          staff.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}
                        title={staff.isActive ? 'Activo' : 'Inactivo'}
                      />
                    </div>
                    <div>
                      <h3 className="font-serif-luxury text-base font-bold text-[#1C1917] flex items-center gap-1.5">
                        <span>{staff.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-[#BE5A38]/10 text-[#BE5A38] text-[9px] font-bold rounded-md">
                            Sesión Actual
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#78716C]">{staff.roleTitle}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeColor(staff.role)}`}>
                        {staff.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact & Rates */}
                <div className="space-y-2 py-3 border-y border-[#F0E8E1] text-xs text-[#57534E]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#A8A29E]" />
                    <span>{staff.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-semibold">
                    <div className="bg-[#FAF7F2] p-2 rounded-xl text-center border border-[#E8DFD8]">
                      <span className="block text-[10px] text-[#78716C]">Comisión Servicios</span>
                      <span className="text-xs text-[#BE5A38] font-bold">{(staff.serviceCommissionRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="bg-[#FAF7F2] p-2 rounded-xl text-center border border-[#E8DFD8]">
                      <span className="block text-[10px] text-[#78716C]">Comisión Productos</span>
                      <span className="text-xs text-[#D97706] font-bold">{(staff.productCommissionRate * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-3">
                  <p className="text-[10px] uppercase font-bold text-[#8D5B4C] mb-1.5">Especialidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {staff.specialties.map((spec, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#FAF7F2] text-[#44403C] text-[10px] font-medium rounded-lg border border-[#E8DFD8]">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Permissions Summary */}
                <div className="mt-3 pt-3 border-t border-[#F0E8E1]">
                  <p className="text-[10px] uppercase font-bold text-[#8D5B4C] mb-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#BE5A38]" />
                    Permisos en la App:
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-[#57534E]">
                    <span className={perms.canAccessPOS ? 'text-emerald-700 font-semibold flex items-center gap-1' : 'text-gray-400 line-through'}>
                      • POS y Cobros
                    </span>
                    <span className={perms.canAccessFinances ? 'text-emerald-700 font-semibold flex items-center gap-1' : 'text-gray-400 line-through'}>
                      • Finanzas
                    </span>
                    <span className={perms.canAccessInventory ? 'text-emerald-700 font-semibold flex items-center gap-1' : 'text-gray-400 line-through'}>
                      • Inventario
                    </span>
                    <span className={perms.canAccessReports ? 'text-emerald-700 font-semibold flex items-center gap-1' : 'text-gray-400 line-through'}>
                      • Reportes
                    </span>
                    <span className={perms.canManageStaff ? 'text-emerald-700 font-semibold flex items-center gap-1' : 'text-gray-400 line-through'}>
                      • Gestión Personal
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-[#F0E8E1] flex items-center justify-between">
                <span className={`text-[11px] font-semibold flex items-center gap-1 ${staff.isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {staff.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {staff.isActive ? 'Activo en Salón' : 'Inactivo'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    id={`btn-edit-staff-${staff.id}`}
                    onClick={() => openEditModal(staff)}
                    className="p-2 bg-[#FAF7F2] hover:bg-[#EAE0D6] text-[#78716C] hover:text-[#1C1917] rounded-xl transition-colors cursor-pointer"
                    title="Editar Perfil y Permisos"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    id={`btn-delete-staff-${staff.id}`}
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar al colaborador ${staff.name}?`)) {
                        deleteStaffMember(staff.id);
                      }
                    }}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                    title="Eliminar Colaborador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Create / Edit Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFD8] relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
                {editingStaffId ? 'Editar Perfil y Permisos de Colaborador' : 'Alta de Nuevo Colaborador'}
              </h3>
              <p className="text-xs text-[#78716C] mt-1">
                Configura los datos profesionales, comisiones por servicio y accesos permitidos dentro del software GestiBella.
              </p>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej. Mariana Vega"
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Cargo / Puesto Visible</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="ej. Especialista en Colorimetría"
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Rol de Sistema</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none cursor-pointer"
                  >
                    <option value="ADMIN">ADMIN (Acceso Total)</option>
                    <option value="MANAGER">MANAGER (Gerencia)</option>
                    <option value="STYLIST">STYLIST (Estilista)</option>
                    <option value="RECEPTIONIST">RECEPTIONIST (Recepción)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mariana@gestibella.com"
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 55..."
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Comisión por Servicios (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={serviceCommissionRate}
                      onChange={(e) => setServiceCommissionRate(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none font-bold"
                    />
                    <Percent className="w-3.5 h-3.5 text-[#A8A29E] absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">Comisión por Productos Retail (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={productCommissionRate}
                      onChange={(e) => setProductCommissionRate(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none font-bold"
                    />
                    <Percent className="w-3.5 h-3.5 text-[#A8A29E] absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#44403C] mb-1">Especialidades (separadas por coma)</label>
                <input
                  type="text"
                  value={specialtiesStr}
                  onChange={(e) => setSpecialtiesStr(e.target.value)}
                  placeholder="Balayage, Corte, Tratamientos Capilares"
                  className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">URL de Avatar / Foto</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5] focus:ring-[#BE5A38]"
                    />
                    <span className="text-xs font-bold text-[#1C1917]">Colaborador Activo en el Salón</span>
                  </label>
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] space-y-3">
                <p className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5 uppercase tracking-wider text-[#8D5B4C]">
                  <Shield className="w-4 h-4 text-[#BE5A38]" />
                  Asignación de Permisos en la App
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-[#E8DFD8]">
                    <input
                      type="checkbox"
                      checked={canAccessPOS}
                      onChange={(e) => setCanAccessPOS(e.target.checked)}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Acceso a POS y Cobros</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-[#E8DFD8]">
                    <input
                      type="checkbox"
                      checked={canAccessFinances}
                      onChange={(e) => setCanAccessFinances(e.target.checked)}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Acceso a Finanzas & Caja</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-[#E8DFD8]">
                    <input
                      type="checkbox"
                      checked={canAccessInventory}
                      onChange={(e) => setCanAccessInventory(e.target.checked)}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Acceso a Inventario & Fórmulas</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-[#E8DFD8]">
                    <input
                      type="checkbox"
                      checked={canAccessReports}
                      onChange={(e) => setCanAccessReports(e.target.checked)}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Acceso a Reportes y Analítica</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-xl border border-[#E8DFD8] sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={canManageStaff}
                      onChange={(e) => setCanManageStaff(e.target.checked)}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Gestión y Alta de Personal (Admin)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E8E1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-submit-staff-form"
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-md hover:from-[#A84E30] hover:to-[#B45309] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingStaffId ? 'Guardar Cambios' : 'Registrar Colaborador'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
