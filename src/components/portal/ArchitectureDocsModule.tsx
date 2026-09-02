import React, { useState } from 'react';
import {
  Code,
  Database,
  Layers,
  FileCode2,
  ShieldCheck,
  Server,
  Sparkles,
  Workflow,
  CheckCircle2,
  ListTodo,
  Network
} from 'lucide-react';

export const ArchitectureDocsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ERD' | 'API' | 'BACKLOG' | 'SECURITY'>('ERD');

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold text-[#BE5A38] border border-[#E8DFD8] mb-1.5">
            <Code className="w-3.5 h-3.5" />
            <span>Documentación Técnica & Especificación SaaS</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Arquitectura de Software GestiBella
          </h2>
          <p className="text-xs text-[#78716C]">
            Diagrama Entidad-Relación (PostgreSQL), endpoints RESTful, seguridad multi-inquilino y backlog MVP.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-[#E8DFD8]">
          <button
            onClick={() => setActiveTab('ERD')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ERD' ? 'bg-[#BE5A38] text-white shadow-xs' : 'text-[#78716C]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Modelo ERD (SQL)</span>
          </button>
          <button
            onClick={() => setActiveTab('API')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'API' ? 'bg-[#BE5A38] text-white shadow-xs' : 'text-[#78716C]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>REST API</span>
          </button>
          <button
            onClick={() => setActiveTab('BACKLOG')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'BACKLOG' ? 'bg-[#BE5A38] text-white shadow-xs' : 'text-[#78716C]'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Backlog MVP</span>
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'SECURITY' ? 'bg-[#BE5A38] text-white shadow-xs' : 'text-[#78716C]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seguridad & Roles</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Database ERD Scheme */}
      {activeTab === 'ERD' && (
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-[#E8DFD8] flex items-center gap-3">
            <Database className="w-6 h-6 text-[#BE5A38]" />
            <div>
              <h4 className="font-bold text-sm text-[#1C1917]">PostgreSQL Schema con Aislamiento Multi-Tenant</h4>
              <p className="text-xs text-[#78716C]">
                Todas las tablas incorporan <code className="bg-white px-1.5 py-0.5 rounded text-[#BE5A38] font-bold">salon_id (UUID)</code> como clave de partición e índices para aislamiento seguro de datos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Table 1: salons (Tenants) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E8E1]">
                <span className="font-bold text-sm text-[#BE5A38]">salons (Tenants)</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-bold">Principal</span>
              </div>
              <ul className="space-y-1 text-[#44403C]">
                <li><span className="text-amber-700 font-bold">PK</span> id: UUID</li>
                <li>name: VARCHAR(150)</li>
                <li>slug: VARCHAR(100) UNIQUE</li>
                <li>tier_plan: ENUM (STARTER, PRO, ELITE)</li>
                <li>created_at: TIMESTAMP</li>
              </ul>
            </div>

            {/* Table 2: users / staff */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E8E1]">
                <span className="font-bold text-sm text-[#1C1917]">users / staff</span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-sans font-bold">Auth & RBAC</span>
              </div>
              <ul className="space-y-1 text-[#44403C]">
                <li><span className="text-amber-700 font-bold">PK</span> id: UUID</li>
                <li><span className="text-blue-600 font-bold">FK</span> salon_id → salons(id)</li>
                <li>email: VARCHAR(255) UNIQUE</li>
                <li>role: ENUM (MANAGER, STYLIST, RECEPTIONIST)</li>
                <li>commission_rate_service: NUMERIC(5,2)</li>
                <li>commission_rate_retail: NUMERIC(5,2)</li>
              </ul>
            </div>

            {/* Table 3: appointments */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E8E1]">
                <span className="font-bold text-sm text-[#1C1917]">appointments</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-sans font-bold">Agenda</span>
              </div>
              <ul className="space-y-1 text-[#44403C]">
                <li><span className="text-amber-700 font-bold">PK</span> id: UUID</li>
                <li><span className="text-blue-600 font-bold">FK</span> salon_id → salons(id)</li>
                <li><span className="text-blue-600 font-bold">FK</span> client_id → clients(id)</li>
                <li><span className="text-blue-600 font-bold">FK</span> staff_id → users(id)</li>
                <li>scheduled_start: TIMESTAMP</li>
                <li>status: ENUM (CONFIRMED, IN_CHAIR, COMPLETED)</li>
              </ul>
            </div>

            {/* Table 4: sale_tickets (POS & Hold Tickets) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E8E1]">
                <span className="font-bold text-sm text-[#BE5A38]">sale_tickets</span>
                <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-sans font-bold">Ticket en Espera</span>
              </div>
              <ul className="space-y-1 text-[#44403C]">
                <li><span className="text-amber-700 font-bold">PK</span> id: UUID</li>
                <li><span className="text-blue-600 font-bold">FK</span> salon_id → salons(id)</li>
                <li><span className="text-blue-600 font-bold">FK</span> client_id → clients(id)</li>
                <li>chair_number: VARCHAR(50)</li>
                <li>status: ENUM (HOLD, PAID, CANCELLED)</li>
                <li>subtotal, discount, tip, total: NUMERIC</li>
                <li>payment_method: ENUM (CASH, CARD, TRANSFER)</li>
              </ul>
            </div>

            {/* Table 5: technical_formulas */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E8E1]">
                <span className="font-bold text-sm text-[#1C1917]">technical_formulas</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-sans font-bold">Colorimetría</span>
              </div>
              <ul className="space-y-1 text-[#44403C]">
                <li><span className="text-amber-700 font-bold">PK</span> id: UUID</li>
                <li><span className="text-blue-600 font-bold">FK</span> salon_id → salons(id)</li>
                <li><span className="text-blue-600 font-bold">FK</span> client_id → clients(id)</li>
                <li>base_natural: VARCHAR(100)</li>
                <li>target_color: VARCHAR(100)</li>
                <li>formula_details: TEXT (Gramos + Volúmenes)</li>
                <li>exposure_time_min: INTEGER</li>
              </ul>
            </div>

            {/* Table 6: loyalty_cards */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8DFD8] shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E8E1]">
                <span className="font-bold text-sm text-[#1C1917]">loyalty_stamp_cards</span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-sans font-bold">CRM Sellos</span>
              </div>
              <ul className="space-y-1 text-[#44403C]">
                <li><span className="text-amber-700 font-bold">PK</span> id: UUID</li>
                <li><span className="text-blue-600 font-bold">FK</span> salon_id → salons(id)</li>
                <li><span className="text-blue-600 font-bold">FK</span> client_id → clients(id)</li>
                <li>current_stamps: INTEGER DEFAULT 0</li>
                <li>total_required: INTEGER DEFAULT 6</li>
                <li>reward_description: VARCHAR(255)</li>
                <li>is_redeemed: BOOLEAN DEFAULT FALSE</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: REST API Endpoints */}
      {activeTab === 'API' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
            Endpoints RESTful de la Plataforma
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">GET</span>
                <span className="text-[#1C1917]">/api/v1/agenda/appointments?date=2026-08-24</span>
              </div>
              <span className="text-[11px] text-[#78716C] font-sans">Retorna citas y proyección financiera</span>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">POST</span>
                <span className="text-[#1C1917]">/api/v1/pos/tickets/open-hold</span>
              </div>
              <span className="text-[11px] text-[#78716C] font-sans">Abre un Ticket en Espera asignado a un sillón</span>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">PUT</span>
                <span className="text-[#1C1917]">/api/v1/pos/tickets/:id/add-item</span>
              </div>
              <span className="text-[11px] text-[#78716C] font-sans">Agrega servicios o productos de vitrina a cuenta abierta</span>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">POST</span>
                <span className="text-[#1C1917]">/api/v1/pos/tickets/:id/checkout</span>
              </div>
              <span className="text-[11px] text-[#78716C] font-sans">Cobra ticket, descuenta inventario y acredita comisiones</span>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">POST</span>
                <span className="text-[#1C1917]">/api/v1/crm/stamp-cards/:id/stamp</span>
              </div>
              <span className="text-[11px] text-[#78716C] font-sans">Suma sello a tarjeta virtual y evalúa si otorga premio</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: MVP Product Backlog */}
      {activeTab === 'BACKLOG' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-5">
          <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
            Backlog MVP: Épicas & Criterios de Aceptación
          </h3>

          <div className="space-y-4">
            
            {/* Epic 1 */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1C1917]">Épica 1: Punto de Venta con "Ticket en Espera"</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Completada</span>
              </div>
              <p className="text-[#57534E]">
                <strong>Como:</strong> Gerente o recepcionista del salón.<br />
                <strong>Quiero:</strong> Abrir una cuenta al recibir al cliente e ir agregando servicios o productos de vitrina conforme el estilista los indica.<br />
                <strong>Criterios de Aceptación:</strong> Se permite pausar la cuenta, reasignar a un sillón, cobrar con múltiples métodos de pago y desglosar propinas.
              </p>
            </div>

            {/* Epic 2 */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1C1917]">Épica 2: Fórmulas Técnicas de Colorimetría</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Completada</span>
              </div>
              <p className="text-[#57534E]">
                <strong>Como:</strong> Estilista colorista.<br />
                <strong>Quiero:</strong> Consultar la mezcla exacta que se le aplicó a la clienta en su última visita para mantener consistencia de tono.<br />
                <strong>Criterios de Aceptación:</strong> Guarda base natural, gramos de cada tubo, volúmenes de peróxido y tiempo de pose.
              </p>
            </div>

            {/* Epic 3 */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD8] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1C1917]">Épica 3: Tarjetas de Sellos Virtuales (Fidelización)</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Completada</span>
              </div>
              <p className="text-[#57534E]">
                <strong>Como:</strong> Dueño del salón.<br />
                <strong>Quiero:</strong> Ofrecer un programa de 6 sellos digitales donde la 6ta visita otorgue un premio de tratamiento.<br />
                <strong>Criterios de Aceptación:</strong> Se marca el sello con 1 clic y se muestra animación de canje al llegar a 6.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Security & Multi-Role RBAC */}
      {activeTab === 'SECURITY' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFD8] shadow-xs space-y-5">
          <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
            Matriz de Control de Acceso Basado en Roles (RBAC)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#78716C] uppercase font-bold text-[10px] border-b border-[#E8DFD8]">
                <tr>
                  <th className="p-3.5">Módulo / Permiso</th>
                  <th className="p-3.5">Gerente / Dueño (MANAGER)</th>
                  <th className="p-3.5">Estilista (STYLIST)</th>
                  <th className="p-3.5">Recepción / Caja (RECEPTIONIST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8E1]">
                <tr>
                  <td className="p-3.5 font-bold text-[#1C1917]">Agenda & Citas</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total (Crear/Editar/Borrar)</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Ver & Gestionar citas propias</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C1917]">POS / Cobro de Tickets</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total</td>
                  <td className="p-3.5 text-amber-600 font-bold">Solo agregar a ticket en sillón</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C1917]">Fórmulas de Colorimetría</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total (Crear y consultar)</td>
                  <td className="p-3.5 text-[#A8A29E]">Solo lectura</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C1917]">Comisiones & Nómina</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total (Configurar % y liquidar)</td>
                  <td className="p-3.5 text-amber-600 font-bold">Solo ver comisiones propias</td>
                  <td className="p-3.5 text-rose-600 font-bold">Sin acceso</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#1C1917]">Finanzas & Arqueo de Caja</td>
                  <td className="p-3.5 text-emerald-600 font-bold">Total</td>
                  <td className="p-3.5 text-rose-600 font-bold">Sin acceso</td>
                  <td className="p-3.5 text-amber-600 font-bold">Solo arqueo de turno</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
