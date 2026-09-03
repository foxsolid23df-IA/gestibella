import React from 'react';

export const Terms: React.FC = () => (
  <div className="max-w-3xl mx-auto px-6 py-12 text-sm leading-relaxed text-[#44403C]">
    <h1 className="font-serif-luxury text-3xl font-bold text-[#1C1917]">Términos y Condiciones — GestiBella</h1>
    <p className="text-xs text-[#A8A29E] mt-1">Vigente desde Septiembre 2026</p>

    <h2 className="font-bold mt-8">1. Servicio</h2>
    <p>GestiBella es software de gestión para salones (agenda, POS, inventario, comisiones) en modalidad SaaS multi-tenant. El acceso requiere licencia vigente por tiempo (mensual/anual) generada por el super-admin.</p>

    <h2 className="font-bold mt-6">2. Planes y límites</h2>
    <ul className="list-disc ml-5">
      <li><b>Starter:</b> 3 staff, 1 sucursal, 150 clientes</li>
      <li><b>Pro:</b> 10 staff, 3 sucursales, clientes ilimitados</li>
      <li><b>Elite:</b> ilimitado</li>
    </ul>
    <p className="mt-2">Superado el límite, el sistema rechaza altas hasta renovar/actualizar plan.</p>

    <h2 className="font-bold mt-6">3. Vigencia y pago</h2>
    <p>Licencia por tiempo con <code>expires_at</code>. Vencida → modo solo lectura. Cobro 100% manual por transferencia/SPEI; renovación vía super-admin (+1m/+12m). Sin reembolsos prorrateados salvo falla imputable a GestiBella.</p>

    <h2 className="font-bold mt-6">4. Tickets y facturación</h2>
    <p>Los comprobantes son <b>tickets no fiscales sin validez SAT/CFDI</b>. No sustituyen factura electrónica. Si requieres CFDI, solicita factura manual 24h por WhatsApp con tus datos fiscales.</p>

    <h2 className="font-bold mt-6">5. Uso aceptable</h2>
    <p>Prohibido revender el acceso, intentar aislar datos de otro tenant, o usar la plataforma para spam. El super-admin puede suspender cuentas con uso abusivo.</p>

    <h2 className="font-bold mt-6">6. Disponibilidad</h2>
    <p>Objetivo 99% en Vercel Hobby + Supabase Free. Backups diarios. Soporte vía WhatsApp.</p>

    <h2 className="font-bold mt-6">7. Contacto</h2>
    <p>Soporte: WhatsApp del super-admin. Jurisdicción: México.</p>
  </div>
);
