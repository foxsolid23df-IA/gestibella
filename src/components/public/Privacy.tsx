import React from 'react';

export const Privacy: React.FC = () => (
  <div className="max-w-3xl mx-auto px-6 py-12 text-sm leading-relaxed text-[#44403C]">
    <h1 className="font-serif-luxury text-3xl font-bold text-[#1C1917]">Aviso de Privacidad — GestiBella</h1>
    <p className="text-xs text-[#A8A29E] mt-1">Última actualización: Septiembre 2026 · Conforme a la LFPDPPP (México)</p>

    <h2 className="font-bold mt-8">1. Responsable</h2>
    <p>GestiBella (operado por el titular del tenant). Datos de contacto del responsable se muestran en el ticket no fiscal y en el contrato de licencia.</p>

    <h2 className="font-bold mt-6">2. Datos que recabamos</h2>
    <ul className="list-disc ml-5 space-y-1">
      <li>Clientes del salón: nombre, teléfono, email, historial de servicios, fórmulas técnicas, alergias/notas, puntos de lealtad.</li>
      <li>Personal: nombre, email, teléfono, comisiones.</li>
      <li>Uso: citas, tickets, gastos operativos.</li>
    </ul>

    <h2 className="font-bold mt-6">3. Finalidades</h2>
    <p>Gestión de agenda, punto de venta, inventario, comisiones y reportes del salón. No vendemos datos. Sub-procesador: Supabase Inc. (hosting DB en sa-east-1) como encargado (art. 21 LFPDPPP).</p>

    <h2 className="font-bold mt-6">4. Derechos ARCO</h2>
    <p>Puedes solicitar acceso, rectificación, cancelación u oposición escribiendo al email del salón titular o al super-admin. Respuesta en máximo 20 días.</p>

    <h2 className="font-bold mt-6">5. Consentimiento</h2>
    <p>Al registrar un cliente en el CRM marcas consentimiento explícito. El salón debe informar este aviso al cliente antes de capturar alergias o fotos de fórmulas.</p>

    <h2 className="font-bold mt-6">6. Tickets no fiscales</h2>
    <p>Los comprobantes emitidos son tickets no fiscales sin validez SAT/CFDI. La factura manual se solicita por WhatsApp y se entrega en 24h por separado.</p>

    <h2 className="font-bold mt-6">7. Contacto</h2>
    <p>Para dudas de privacidad contacta al propietario del salón (owner_email en la licencia) o al soporte GestiBella.</p>
  </div>
);
