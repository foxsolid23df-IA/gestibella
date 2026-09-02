import React, { useState } from 'react';
import {
  Printer,
  Settings,
  Sliders,
  Type,
  Palette,
  Layout,
  Image as ImageIcon,
  Check,
  Save,
  RotateCcw,
  Scissors,
  Receipt,
  FileText,
  Smartphone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useSalon } from '../../context/SalonContext';

export const PrinterSettingsModule: React.FC = () => {
  const { receiptConfig, updateReceiptConfig, addToast } = useSalon();

  const [form, setForm] = useState(receiptConfig);
  const [activeTab, setActiveTab] = useState<'printer' | 'design' | 'content'>('printer');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReceiptConfig(form);
    addToast('success', 'Configuración Guardada', 'Los ajustes de la impresora térmica y el diseño del ticket se han actualizado correctamente.');
  };

  const handleReset = () => {
    const defaultCfg = {
      salonName: 'GestiBella Salon & Spa',
      salonSlogan: 'Alta Peluquería & Estética',
      address: 'Av. Presidente Masaryk 360, Polanco, CDMX',
      phone: '+52 55 5540 8890',
      taxId: 'GBE240824-XYZ',
      logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
      printerName: 'Epson TM-T20III Thermal POS',
      printerConnection: 'USB' as const,
      paperWidth: '80mm' as const,
      fontSize: 'xs' as const,
      accentColor: '#BE5A38',
      showLogo: true,
      showTaxId: true,
      showStaffName: true,
      showClientName: true,
      showChairNumber: true,
      showLoyaltyPoints: true,
      showBarcode: true,
      customFooterMessage: '¡Gracias por consentirte con nosotros! Visítanos de nuevo y acumula sellos para tu tratamiento gratis.',
      autoCutter: true,
      spacing: 'normal' as const
    };
    setForm(defaultCfg);
    updateReceiptConfig(defaultCfg);
    addToast('info', 'Valores Restaurados', 'Se han restablecido los ajustes predeterminados del ticket.');
  };

  const testPrint = () => {
    window.print();
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
                Hardware POS & Tickets
              </span>
              <span className="text-xs text-[#D8C3B5]">GestiBella Periféricos</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight">
              Impresora Térmica & Diseño de Tickets
            </h1>
            <p className="text-xs sm:text-sm text-[#D8C3B5] mt-1 max-w-2xl">
              Configura tu impresora POS de 58mm u 80mm y personaliza fácilmente el logotipo, tipografía, colores, espacios y datos visibles en los recibos de tus clientas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={testPrint}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Prueba</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Settings Form (Left 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFD8] shadow-sm space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E8DFD8]">
            <button
              type="button"
              onClick={() => setActiveTab('printer')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'printer'
                  ? 'bg-white text-[#1C1917] shadow-xs border border-[#E8DFD8]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Printer className="w-4 h-4 text-[#BE5A38]" />
              <span>Impresora POS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'design'
                  ? 'bg-white text-[#1C1917] shadow-xs border border-[#E8DFD8]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Palette className="w-4 h-4 text-[#BE5A38]" />
              <span>Diseño & Estilo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-white text-[#1C1917] shadow-xs border border-[#E8DFD8]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#BE5A38]" />
              <span>Datos del Ticket</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* TAB 1: PRINTER SETTINGS */}
            {activeTab === 'printer' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xs font-bold text-[#8D5B4C] uppercase tracking-wider">
                  Configuración del Periférico de Impresión
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Nombre de la Impresora POS
                    </label>
                    <input
                      type="text"
                      value={form.printerName}
                      onChange={(e) => setForm({ ...form, printerName: e.target.value })}
                      placeholder="ej. Epson TM-T20III / Bixolon SRP-350"
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Tipo de Conexión
                    </label>
                    <select
                      value={form.printerConnection}
                      onChange={(e) => setForm({ ...form, printerConnection: e.target.value as any })}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none cursor-pointer"
                    >
                      <option value="USB">Puerto USB / Serial</option>
                      <option value="Bluetooth">Bluetooth Inalámbrica</option>
                      <option value="Red TCP/IP">Red LAN / WiFi (IP)</option>
                      <option value="Navegador (Predeterminada)">Diálogo del Navegador (Sistema)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Ancho del Papel Térmico
                    </label>
                    <select
                      value={form.paperWidth}
                      onChange={(e) => setForm({ ...form, paperWidth: e.target.value as any })}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none cursor-pointer"
                    >
                      <option value="80mm">80mm (Estándar Punto de Venta)</option>
                      <option value="58mm">58mm (Mini Impresora Portátil)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.autoCutter}
                        onChange={(e) => setForm({ ...form, autoCutter: e.target.checked })}
                        className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5] focus:ring-[#BE5A38]"
                      />
                      <span className="text-xs font-bold text-[#1C1917]">Corte Automático al Finalizar Ticket</span>
                    </label>
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD8] text-xs text-[#57534E] space-y-1">
                  <p className="font-bold text-[#BE5A38]">💡 Nota de Conexión:</p>
                  <p>
                    GestiBella se comunica de forma nativa con impresoras térmicas ESC/POS compatibles con USB, Bluetooth o Red local mediante el diálogo de impresión optimizado.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: DESIGN & STYLING */}
            {activeTab === 'design' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xs font-bold text-[#8D5B4C] uppercase tracking-wider">
                  Personalización Visual del Recibo
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Tamaño de Letra (Tipografía)
                    </label>
                    <select
                      value={form.fontSize}
                      onChange={(e) => setForm({ ...form, fontSize: e.target.value as any })}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none cursor-pointer"
                    >
                      <option value="xs">Pequeño (Económico / 58mm)</option>
                      <option value="sm">Normal (Estándar Térmico)</option>
                      <option value="base">Grande (Alta Legibilidad)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Espaciado y Márgenes
                    </label>
                    <select
                      value={form.spacing}
                      onChange={(e) => setForm({ ...form, spacing: e.target.value as any })}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none cursor-pointer"
                    >
                      <option value="compact">Compacto (Ahorro de papel)</option>
                      <option value="normal">Normal (Balanceado)</option>
                      <option value="spacious">Amplio (Elegante / Espacioso)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      Color de Acento / Marca
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.accentColor}
                        onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                        className="w-12 h-10 rounded-xl border border-[#D8C3B5] cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={form.accentColor}
                        onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                        className="flex-1 bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-[#1C1917]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">
                      URL del Logotipo del Salón
                    </label>
                    <input
                      type="text"
                      value={form.logoUrl}
                      onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">Nombre Comercial del Salón</label>
                    <input
                      type="text"
                      value={form.salonName}
                      onChange={(e) => setForm({ ...form, salonName: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">Eslogan o Subtítulo</label>
                    <input
                      type="text"
                      value={form.salonSlogan || ''}
                      onChange={(e) => setForm({ ...form, salonSlogan: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">Dirección Física</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#44403C] mb-1">Teléfono & RFC / Datos Fiscales</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2.5 text-xs text-[#1C1917]"
                        placeholder="Tel"
                      />
                      <input
                        type="text"
                        value={form.taxId}
                        onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                        className="bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl px-3 py-2.5 text-xs text-[#1C1917]"
                        placeholder="RFC"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTENT & DATA FIELDS */}
            {activeTab === 'content' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xs font-bold text-[#8D5B4C] uppercase tracking-wider">
                  Selección de Datos a Mostrar en el Ticket
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showLogo}
                      onChange={(e) => setForm({ ...form, showLogo: e.target.checked })}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Mostrar Logotipo del Salón</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showTaxId}
                      onChange={(e) => setForm({ ...form, showTaxId: e.target.checked })}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Mostrar RFC / Datos Fiscales</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showClientName}
                      onChange={(e) => setForm({ ...form, showClientName: e.target.checked })}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Nombre de la Clienta</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showStaffName}
                      onChange={(e) => setForm({ ...form, showStaffName: e.target.checked })}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Estilista / Colaborador que Atendió</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showChairNumber}
                      onChange={(e) => setForm({ ...form, showChairNumber: e.target.checked })}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Estación / Sillón de Trabajo</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.showLoyaltyPoints}
                      onChange={(e) => setForm({ ...form, showLoyaltyPoints: e.target.checked })}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Puntos de Lealtad Ganados ★</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD8] cursor-pointer sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.showBarcode}
                      onChange={(e) => setForm({ ...form, showBarcode: e.target.checked })}
                      className="w-4 h-4 text-[#BE5A38] rounded border-[#D8C3B5]"
                    />
                    <span className="font-medium text-[#1C1917]">Código de Barras y Folio Digital</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#44403C] mb-1">
                    Mensaje Personalizado de Agradecimiento (Pie de Ticket)
                  </label>
                  <textarea
                    rows={3}
                    value={form.customFooterMessage}
                    onChange={(e) => setForm({ ...form, customFooterMessage: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#D8C3B5] rounded-xl p-3 text-xs text-[#1C1917] focus:ring-2 focus:ring-[#BE5A38] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F0E8E1]">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 bg-[#FAF7F2] text-[#78716C] hover:text-[#1C1917] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Predeterminados</span>
              </button>

              <button
                id="btn-save-printer-config"
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#BE5A38] to-[#D97706] text-white font-bold text-xs rounded-xl shadow-md hover:from-[#A84E30] hover:to-[#B45309] transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Configuración</span>
              </button>
            </div>
          </form>

        </div>

        {/* Live Thermal Preview (Right 5 cols) */}
        <div className="lg:col-span-5 bg-[#2D2A26] rounded-3xl p-6 text-white shadow-xl sticky top-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#BE5A38]" />
              <span className="text-xs font-bold uppercase tracking-wider">Vista Previa Térmica en Vivo</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
              {form.paperWidth} • {form.printerConnection}
            </span>
          </div>

          {/* Thermal Paper Simulation */}
          <div
            className={`mx-auto bg-white text-[#1C1917] rounded-xl shadow-2xl p-4 font-mono transition-all ${
              form.paperWidth === '58mm' ? 'max-w-[240px]' : 'max-w-[310px]'
            }`}
            style={{
              fontSize: form.fontSize === 'xs' ? '10px' : form.fontSize === 'sm' ? '11px' : '12px',
              lineHeight: form.spacing === 'compact' ? '1.2' : form.spacing === 'spacious' ? '1.6' : '1.4'
            }}
          >
            {/* Header */}
            <div className={`text-center space-y-1.5 pb-3 border-b border-dashed border-neutral-300`}>
              {form.showLogo && (
                <img
                  src={form.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 rounded-full object-cover mx-auto border"
                />
              )}
              <h4 className="font-serif-luxury font-bold text-base font-sans" style={{ color: form.accentColor }}>
                {form.salonName}
              </h4>
              {form.salonSlogan && (
                <p className="text-[9px] text-neutral-500 font-sans italic">{form.salonSlogan}</p>
              )}
              <p className="text-[9px] text-neutral-600 font-sans">
                {form.address}<br />
                Tel: {form.phone}
                {form.showTaxId && form.taxId && <><br />RFC: {form.taxId}</>}
              </p>
            </div>

            {/* Ticket metadata */}
            <div className="text-left text-[10px] space-y-0.5 py-2 border-b border-dashed border-neutral-300">
              <div className="flex justify-between">
                <span>FOLIO:</span>
                <strong style={{ color: form.accentColor }}>GBE-2026-9842</strong>
              </div>
              <div className="flex justify-between">
                <span>FECHA:</span>
                <span>26/08/2026 10:15</span>
              </div>
              {form.showClientName && (
                <div className="flex justify-between">
                  <span>CLIENTA:</span>
                  <strong>Sofía Valenzuela</strong>
                </div>
              )}
              {form.showStaffName && (
                <div className="flex justify-between">
                  <span>ATENDIÓ:</span>
                  <span>Mariana Vega</span>
                </div>
              )}
              {form.showChairNumber && (
                <div className="flex justify-between">
                  <span>SILLÓN:</span>
                  <span>Sillón Color 02</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="text-left space-y-1.5 py-2 border-b border-dashed border-neutral-300">
              <div className="flex justify-between font-bold">
                <span>1x Balayage & Brushing</span>
                <span>$1,450</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>1x Mascarilla Kérastase</span>
                <span>$480</span>
              </div>
            </div>

            {/* Totals */}
            <div className="text-left space-y-1 py-2 border-b border-dashed border-neutral-300">
              <div className="flex justify-between text-neutral-500">
                <span>SUBTOTAL:</span>
                <span>$1,930 MXN</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>DESCUENTO:</span>
                <span>-$0 MXN</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm pt-1" style={{ color: form.accentColor }}>
                <span>TOTAL:</span>
                <span>$1,930 MXN</span>
              </div>
            </div>

            {/* Payment & Loyalty */}
            <div className="text-left text-[9px] space-y-0.5 py-2 border-b border-dashed border-neutral-300">
              <div className="flex justify-between">
                <span>MÉTODO PAGO:</span>
                <strong>TARJETA CRÉDITO</strong>
              </div>
              {form.showLoyaltyPoints && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>PUNTOS GANADOS:</span>
                  <span>+96 PTS ★</span>
                </div>
              )}
            </div>

            {/* Barcode & Footer */}
            <div className="pt-2 text-center space-y-2">
              {form.showBarcode && (
                <div className="h-6 bg-neutral-900 mx-auto rounded flex items-center justify-center text-white text-[8px] tracking-[0.2em]">
                  ||||| | |||| |||| ||| |||||||
                </div>
              )}
              <p className="text-[9px] text-neutral-600 font-sans italic">
                {form.customFooterMessage}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <p className="text-[11px] text-[#D8C3B5] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Impresora configurada: <strong>{form.printerName}</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
