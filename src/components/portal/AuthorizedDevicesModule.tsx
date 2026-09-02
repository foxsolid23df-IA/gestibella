import React, { useState } from 'react';
import {
  ShieldAlert,
  Laptop,
  Smartphone,
  Tablet,
  Trash2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe,
  Monitor,
  UserCheck
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const AuthorizedDevicesModule: React.FC = () => {
  const { activeSessions, revokeSession, terminateOtherSessions, addToast } = useSalon();

  const handleRevoke = (id: string, name: string) => {
    revokeSession(id);
    addToast('warning', 'Dispositivo Revocado', `Se ha cerrado la sesión y revocado el acceso a "${name}".`);
  };

  const handleTerminateOthers = () => {
    terminateOtherSessions();
    addToast('success', 'Sesiones Cerradas', 'Se han cerrado todas las sesiones remotas y dispositivos externos por seguridad.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C1917] via-[#2D2A26] to-[#44403C] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#BE5A38]/30 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                Seguridad SaaS • Single Session
              </span>
              <span className="text-xs text-[#D8C3B5]">Protección Anti-Compartidos</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight">
              Dispositivos Autorizados & Control de Sesiones
            </h1>
            <p className="text-xs sm:text-sm text-[#D8C3B5] mt-1 max-w-2xl">
              Monitorea en tiempo real qué computadoras, tablets o terminales de recepción operan bajo tu licencia de GestiBella Pro. Revoca accesos o evita que compartan la cuenta en otros negocios.
            </p>
          </div>

          <button
            onClick={handleTerminateOthers}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Cerrar Todas las Demás Sesiones</span>
          </button>
        </div>
      </div>

      {/* Security Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-[#78716C] font-bold">Estado de Licencia</p>
            <h4 className="text-sm font-bold text-[#1C1917]">Protegida (Single Tenant)</h4>
            <p className="text-[10px] text-emerald-700 mt-0.5">Sin duplicidad de franquicia</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#BE5A38] flex items-center justify-center shrink-0 border border-[#E8DFD8]">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-[#78716C] font-bold">Terminales Activas</p>
            <h4 className="text-sm font-bold text-[#1C1917]">{activeSessions.length} Dispositivos Conectados</h4>
            <p className="text-[10px] text-[#78716C] mt-0.5">Límite permitido por plan Pro</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-[#78716C] font-bold">Alerta Anti-Fraude</p>
            <h4 className="text-sm font-bold text-[#1C1917]">Activa (2FA / IP Check)</h4>
            <p className="text-[10px] text-amber-700 mt-0.5">Detecta inicios remotos</p>
          </div>
        </div>
      </div>

      {/* Sessions List Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD8] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E8E1]">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
              Sesiones Activas y Registradas en GestiBella
            </h3>
            <p className="text-xs text-[#78716C]">
              Si reconoces un dispositivo desconocido que inició sesión con tus credenciales, revócalo inmediatamente.
            </p>
          </div>
          <span className="px-3 py-1 bg-[#FAF7F2] text-[#78716C] text-xs font-bold rounded-xl border border-[#E8DFD8]">
            ID Salón: #GB-9842-PRO
          </span>
        </div>

        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                session.isCurrent
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-[#FAF7F2] border-[#E8DFD8]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    session.deviceType === 'Desktop'
                      ? 'bg-blue-100 text-blue-800'
                      : session.deviceType === 'Tablet'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {session.deviceType === 'Desktop' ? (
                    <Laptop className="w-5 h-5" />
                  ) : session.deviceType === 'Tablet' ? (
                    <Tablet className="w-5 h-5" />
                  ) : (
                    <Smartphone className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#1C1917]">{session.deviceName}</h4>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
                        Esta Sesión (Actual)
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-neutral-200 text-[#44403C] text-[10px] font-bold rounded-full">
                      Rol: {session.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#BE5A38]" />
                      IP: {session.ipAddress} ({session.location})
                    </span>
                    <span>•</span>
                    <span>Navegador: {session.browser}</span>
                    <span>•</span>
                    <span>Última actividad: {session.lastActive}</span>
                  </div>
                </div>
              </div>

              {!session.isCurrent ? (
                <button
                  onClick={() => handleRevoke(session.id, session.deviceName)}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revocar Acceso</span>
                </button>
              ) : (
                <div className="px-3.5 py-2 bg-emerald-100/80 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Seguro & Verificado</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Anti-fraud policy card */}
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8DFD8] text-xs text-[#57534E] space-y-2">
          <div className="font-bold text-[#BE5A38] flex items-center gap-1.5 text-sm">
            <Lock className="w-4 h-4" />
            <span>Política Estricta Anti-Compartidos de GestiBella SaaS</span>
          </div>
          <p>
            Para garantizar la sostenibilidad y seguridad de la plataforma, cada licencia de GestiBella Pro está limitada a operar en las terminales autorizadas de un único establecimiento. Si se detecta un intento de compartir la contraseña con múltiples negocios externos, el sistema invalidará el token y requerirá autorización del Administrador principal.
          </p>
        </div>
      </div>
    </div>
  );
};
