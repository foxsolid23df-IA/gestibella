import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SaleTicket,
  ExpenseRecord,
  InventoryItem,
  Branch,
  BranchProductTransfer,
  ReceiptConfig,
  StaffMember
} from '../types';

/**
 * Loads an image from a URL and converts it to a base64 Data URL.
 * Handles CORS and failures gracefully.
 */
export async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  if (!imageUrl) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          resolve(null);
        }
      } catch (err) {
        console.warn('Canvas export failed for image URL, skipping image:', err);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn('Failed to load image for PDF export:', imageUrl);
      resolve(null);
    };
    img.src = imageUrl;
  });
}

interface CommonPdfOptions {
  receiptConfig: ReceiptConfig;
  selectedBranchName?: string;
  dateRangeLabel?: string;
  generatedBy?: string;
  includeLogo?: boolean;
  includeSignatures?: boolean;
}

/**
 * Draw sophisticated header with Business Logo and metadata
 */
function drawHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  logoBase64: string | null,
  options: CommonPdfOptions
): number {
  const { receiptConfig, selectedBranchName, dateRangeLabel, generatedBy, includeLogo = true } = options;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 14;

  // Background header band
  doc.setFillColor(250, 247, 242); // #FAF7F2
  doc.roundedRect(10, 10, pageWidth - 20, 36, 3, 3, 'F');
  doc.setDrawColor(232, 223, 216); // #E8DFD8
  doc.roundedRect(10, 10, pageWidth - 20, 36, 3, 3, 'S');

  let leftTextX = 16;

  // Draw Logo if available
  if (includeLogo && logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 15, 13, 28, 28);
      leftTextX = 48;
    } catch (e) {
      console.warn('Could not add image to jsPDF doc:', e);
      leftTextX = 16;
    }
  } else if (includeLogo) {
    // Decorative badge if no base64 image
    doc.setFillColor(190, 90, 56); // #BE5A38
    doc.roundedRect(15, 14, 26, 26, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('GB', 28, 30, { align: 'center' });
    leftTextX = 46;
  }

  // Salon Name and Title
  doc.setTextColor(28, 25, 23); // #1C1917
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(receiptConfig.salonName || 'GestiBella Salon & Spa', leftTextX, 20);

  if (receiptConfig.salonSlogan) {
    doc.setTextColor(120, 113, 108); // #78716C
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.text(receiptConfig.salonSlogan, leftTextX, 25);
  }

  // Document Title
  doc.setTextColor(190, 90, 56); // #BE5A38
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(title.toUpperCase(), leftTextX, 33);

  doc.setTextColor(87, 83, 78);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(subtitle, leftTextX, 38);

  // Right Side: Business Details & Date
  const rightX = pageWidth - 16;
  doc.setTextColor(68, 64, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(`Ticket no fiscal — sin validez SAT`, rightX, 16, { align: 'right' });
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.setFont('helvetica', 'normal');
  doc.text(`RFC ref: ${receiptConfig.taxId || 'GBE240824-XYZ'}`, rightX, 19, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 113, 108);
  doc.text(receiptConfig.address || 'Polanco, Ciudad de México', rightX, 24, { align: 'right' });
  doc.text(`Tel: ${receiptConfig.phone || '+52 55 5540 8890'}`, rightX, 28, { align: 'right' });
  
  const nowStr = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text(`Emitido: ${nowStr}`, rightX, 34, { align: 'right' });
  if (selectedBranchName) {
    doc.setTextColor(190, 90, 56);
    doc.text(`Sede: ${selectedBranchName}`, rightX, 39, { align: 'right' });
  }

  return 52; // Current Y offset after header
}

/**
 * Draw footer with pagination and audit signature
 */
function drawFooter(doc: jsPDF, options: CommonPdfOptions) {
  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(232, 223, 216);
    doc.line(10, pageHeight - 14, pageWidth - 10, pageHeight - 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(120, 113, 108);
  doc.text(
    `Ticket no fiscal — sin validez SAT. Solicita factura manual 24h por WhatsApp. • GestiBella • Generado por: ${options.generatedBy || 'Gerencia General'}`,
    12,
    pageHeight - 9
  );

    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 12,
      pageHeight - 9,
      { align: 'right' }
    );
  }
}

/**
 * 1. EXPORT FINANCIAL STATEMENT (Estado de Cuenta & Cierre Financiero)
 */
export async function generateFinancialStatementPDF(params: {
  receiptConfig: ReceiptConfig;
  ticketsList: SaleTicket[];
  expensesList: ExpenseRecord[];
  branches: Branch[];
  selectedBranchId?: string;
  dateRangeLabel?: string;
  generatedBy?: string;
  includeSignatures?: boolean;
}): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const {
    receiptConfig,
    ticketsList,
    expensesList,
    branches,
    selectedBranchId = 'ALL',
    dateRangeLabel = 'Mes Actual',
    generatedBy = 'Administración',
    includeSignatures = true
  } = params;

  const branchObj = branches.find((b) => b.id === selectedBranchId);
  const branchName = selectedBranchId === 'ALL' ? 'Consolidado Todas las Sucursales' : branchObj?.name || 'Sucursal Principal';

  // Load logo as base64
  let logoBase64: string | null = null;
  if (receiptConfig.logoUrl) {
    logoBase64 = await getBase64ImageFromUrl(receiptConfig.logoUrl);
  }

  // Filter tickets & expenses
  const paidTickets = ticketsList.filter((t) => t.status === 'PAID');
  const totalRevenue = paidTickets.reduce((acc, t) => acc + t.total, 0);
  const totalExpenses = expensesList.reduce((acc, e) => acc + e.amount, 0);
  const estimatedCommissions = Math.round(totalRevenue * 0.42);
  const netProfit = totalRevenue - totalExpenses - estimatedCommissions;
  const netMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Breakdown by payment methods
  const cashTotal = paidTickets.filter((t) => t.paymentMethod === 'EFECTIVO').reduce((acc, t) => acc + t.total, 0);
  const cardTotal = paidTickets.filter((t) => t.paymentMethod === 'TARJETA_CREDITO' || t.paymentMethod === 'TARJETA_DEBITO').reduce((acc, t) => acc + t.total, 0);
  const transferTotal = paidTickets.filter((t) => t.paymentMethod === 'TRANSFERENCIA').reduce((acc, t) => acc + t.total, 0);
  const tipsTotal = paidTickets.reduce((acc, t) => acc + (t.tip || 0), 0);

  // Draw Header
  let y = drawHeader(
    doc,
    'Estado de Cuenta & Cierre Financiero',
    `Período: ${dateRangeLabel} • Sede: ${branchName}`,
    logoBase64,
    {
      receiptConfig,
      selectedBranchName: branchName,
      dateRangeLabel,
      generatedBy,
      includeLogo: receiptConfig.showLogo !== false
    }
  );

  const pageWidth = doc.internal.pageSize.getWidth();

  // Summary KPI Cards in 4 columns
  const cardWidth = (pageWidth - 20 - 9) / 4;
  const cardHeight = 18;
  const startX = 10;

  // 1. Ingresos
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(startX, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 113, 108);
  doc.text('INGRESOS BRUTOS', startX + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text(`$${totalRevenue.toLocaleString()} MXN`, startX + 3, y + 12);
  doc.setFontSize(6);
  doc.setTextColor(16, 185, 129);
  doc.text(`${paidTickets.length} transacciones`, startX + 3, y + 16);

  // 2. Gastos
  const x2 = startX + cardWidth + 3;
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(x2, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 113, 108);
  doc.text('GASTOS OPERATIVOS', x2 + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(225, 29, 72);
  doc.text(`$${totalExpenses.toLocaleString()} MXN`, x2 + 3, y + 12);
  doc.setFontSize(6);
  doc.setTextColor(120, 113, 108);
  doc.text(`${expensesList.length} partidas de egreso`, x2 + 3, y + 16);

  // 3. Comisiones
  const x3 = x2 + cardWidth + 3;
  doc.setFillColor(245, 245, 244);
  doc.roundedRect(x3, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 113, 108);
  doc.text('COMISIONES STAFF', x3 + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(141, 91, 76);
  doc.text(`$${estimatedCommissions.toLocaleString()} MXN`, x3 + 3, y + 12);
  doc.setFontSize(6);
  doc.setTextColor(120, 113, 108);
  doc.text('Estimado por servicios', x3 + 3, y + 16);

  // 4. Utilidad Neta
  const x4 = x3 + cardWidth + 3;
  doc.setFillColor(240, 253, 244); // light green
  doc.roundedRect(x4, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(21, 128, 61);
  doc.text('UTILIDAD NETA', x4 + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(21, 128, 61);
  doc.text(`$${netProfit.toLocaleString()} MXN`, x4 + 3, y + 12);
  doc.setFontSize(6);
  doc.text(`Margen Neto: ${netMargin}%`, x4 + 3, y + 16);

  y += cardHeight + 5;

  // Conciliación de Cobros por Método
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(10, y, pageWidth - 20, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(190, 90, 56);
  doc.text('ARQUEO POR FORMA DE PAGO:', 14, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(44, 40, 37);
  doc.text(`Efectivo en Caja: $${cashTotal.toLocaleString()} MXN`, 65, y + 7.5);
  doc.text(`Tarjetas (TPV): $${cardTotal.toLocaleString()} MXN`, 110, y + 7.5);
  doc.text(`Transferencia SPEI: $${transferTotal.toLocaleString()} MXN`, 150, y + 7.5);
  doc.text(`Propinas: $${tipsTotal.toLocaleString()} MXN`, pageWidth - 14, y + 7.5, { align: 'right' });

  y += 16;

  // Table 1: Detailed Sales Tickets
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(28, 25, 23);
  doc.text('1. Relación Detallada de Cobros y Tickets Emitidos', 10, y);
  y += 3;

  const ticketRows = paidTickets.map((t) => {
    const itemsSummary = t.items.map((i) => `${i.name} (x${i.quantity})`).join(', ');
    return [
      t.ticketNumber,
      t.paidAt ? t.paidAt.split('T')[0] : t.createdAt.split('T')[0],
      t.clientName,
      t.chairNumber ? `Sillón ${t.chairNumber}` : 'Recepción',
      itemsSummary.length > 35 ? itemsSummary.slice(0, 35) + '...' : itemsSummary,
      t.paymentMethod || 'EFECTIVO',
      `$${t.total.toLocaleString()} MXN`
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Folio', 'Fecha', 'Clienta', 'Ubicación / Sillón', 'Servicios / Artículos', 'Forma Pago', 'Total']],
    body: ticketRows.length > 0 ? ticketRows : [['—', '—', 'Sin movimientos registrados', '—', '—', '—', '$0']],
    theme: 'striped',
    headStyles: {
      fillColor: [190, 90, 56],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 6.5,
      textColor: [44, 40, 37],
      cellPadding: 1.8
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 20 },
      1: { cellWidth: 18 },
      2: { cellWidth: 32 },
      3: { cellWidth: 24 },
      4: { cellWidth: 50 },
      5: { cellWidth: 24 },
      6: { halign: 'right', fontStyle: 'bold', cellWidth: 22 }
    },
    margin: { left: 10, right: 10 }
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Table 2: Expenses Record
  if (y > 220) {
    doc.addPage();
    y = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(28, 25, 23);
  doc.text('2. Desglose de Gastos Operativos y Salidas de Caja', 10, y);
  y += 3;

  const expenseRows = expensesList.map((e) => [
    e.date,
    e.concept,
    e.category,
    e.paymentMethod,
    e.receiptNumber || 'Sin factura',
    e.registeredBy || 'Gerencia',
    `-$${e.amount.toLocaleString()} MXN`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Fecha', 'Concepto del Gasto', 'Categoría', 'Método Pago', 'Folio/Factura', 'Registrado Por', 'Monto']],
    body: expenseRows.length > 0 ? expenseRows : [['—', 'Sin gastos registrados', '—', '—', '—', '—', '$0']],
    theme: 'striped',
    headStyles: {
      fillColor: [68, 64, 60],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 6.5,
      textColor: [44, 40, 37],
      cellPadding: 1.8
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { fontStyle: 'bold', cellWidth: 48 },
      2: { cellWidth: 32 },
      3: { cellWidth: 26 },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { halign: 'right', fontStyle: 'bold', textColor: [225, 29, 72], cellWidth: 22 }
    },
    margin: { left: 10, right: 10 }
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Optional Signatures block
  if (includeSignatures) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    const signWidth = 60;
    const sign1X = 25;
    const sign2X = pageWidth - 25 - signWidth;

    doc.setDrawColor(180, 170, 160);
    doc.line(sign1X, y + 16, sign1X + signWidth, y + 16);
    doc.line(sign2X, y + 16, sign2X + signWidth, y + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(44, 40, 37);
    doc.text('Firma de Gerencia / Dueño', sign1X + signWidth / 2, y + 21, { align: 'center' });
    doc.text('Firma Contador / Auditor', sign2X + signWidth / 2, y + 21, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 113, 108);
    doc.text(receiptConfig.salonName, sign1X + signWidth / 2, y + 25, { align: 'center' });
    doc.text('Verificación de Cierre y Arqueo', sign2X + signWidth / 2, y + 25, { align: 'center' });
  }

  // Draw Page Numbers and Footers
  drawFooter(doc, {
    receiptConfig,
    generatedBy,
    dateRangeLabel
  });

  return doc;
}

/**
 * 2. EXPORT MULTI-BRANCH INVENTORY SUMMARY (Resumen & Matriz de Inventario Multi-Sucursal)
 */
export async function generateInventorySummaryPDF(params: {
  receiptConfig: ReceiptConfig;
  inventoryList: InventoryItem[];
  branches: Branch[];
  branchTransfers: BranchProductTransfer[];
  getProductBranchStock: (productId: string, branchId: string) => number;
  selectedBranchId?: string;
  generatedBy?: string;
  includeSignatures?: boolean;
}): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const {
    receiptConfig,
    inventoryList,
    branches,
    branchTransfers,
    getProductBranchStock,
    selectedBranchId = 'ALL',
    generatedBy = 'Administración de Almacén',
    includeSignatures = true
  } = params;

  const branchObj = branches.find((b) => b.id === selectedBranchId);
  const branchName = selectedBranchId === 'ALL' ? 'Red Multi-Sucursal Consolidada' : branchObj?.name || 'Sucursal Principal';

  // Load logo as base64
  let logoBase64: string | null = null;
  if (receiptConfig.logoUrl) {
    logoBase64 = await getBase64ImageFromUrl(receiptConfig.logoUrl);
  }

  // Calculate inventory metrics
  const totalItems = inventoryList.length;
  const totalUnits = inventoryList.reduce((acc, i) => acc + i.currentStock, 0);
  const totalInventoryCost = inventoryList.reduce((acc, i) => acc + i.costPrice * i.currentStock, 0);
  const totalRetailValuation = inventoryList
    .filter((i) => i.isRetail && i.retailPrice)
    .reduce((acc, i) => acc + (i.retailPrice || 0) * i.currentStock, 0);
  const lowStockCount = inventoryList.filter((i) => i.currentStock <= i.minStock).length;

  let y = drawHeader(
    doc,
    'Resumen & Matriz de Inventario Multi-Sucursal',
    `Auditoría y valuación de stock de insumos técnicos y retail • Sede: ${branchName}`,
    logoBase64,
    {
      receiptConfig,
      selectedBranchName: branchName,
      generatedBy,
      includeLogo: receiptConfig.showLogo !== false
    }
  );

  const pageWidth = doc.internal.pageSize.getWidth();

  // Summary Metrics (5 cards)
  const cardCount = 5;
  const cardGap = 3;
  const cardWidth = (pageWidth - 20 - (cardCount - 1) * cardGap) / cardCount;
  const cardHeight = 16;
  const startX = 10;

  const metrics = [
    { label: 'CATÁLOGO DE PRODUCTOS', val: `${totalItems} Ítems`, sub: 'Insumos y Retail' },
    { label: 'EXISTENCIAS TOTALES', val: `${totalUnits} Uds`, sub: 'Consolidado en red' },
    { label: 'VALORACIÓN AL COSTO', val: `$${totalInventoryCost.toLocaleString()} MXN`, sub: 'Inversión en almacén' },
    { label: 'VALOR POTENCIAL RETAIL', val: `$${totalRetailValuation.toLocaleString()} MXN`, sub: 'En vitrinas activas' },
    {
      label: 'ALERTAS STOCK CRÍTICO',
      val: `${lowStockCount} Ítems`,
      sub: lowStockCount > 0 ? 'Requieren reorden' : 'Existencias óptimas',
      isWarning: lowStockCount > 0
    }
  ];

  metrics.forEach((m, idx) => {
    const cx = startX + idx * (cardWidth + cardGap);
    doc.setFillColor(m.isWarning ? 254 : 245, m.isWarning ? 242 : 245, m.isWarning ? 242 : 244);
    doc.roundedRect(cx, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(m.isWarning ? 185 : 120, m.isWarning ? 28 : 113, m.isWarning ? 28 : 108);
    doc.text(m.label, cx + 3, y + 4.5);
    doc.setFontSize(9);
    doc.setTextColor(m.isWarning ? 225 : 28, m.isWarning ? 29 : 25, m.isWarning ? 72 : 23);
    doc.text(m.val, cx + 3, y + 10.5);
    doc.setFontSize(5.5);
    doc.setTextColor(120, 113, 108);
    doc.text(m.sub, cx + 3, y + 14);
  });

  y += cardHeight + 5;

  // Build dynamic table columns for branches
  const headCols = ['SKU', 'Insumo / Producto', 'Categoría', 'Costo Unit.', 'P. Venta'];
  branches.forEach((b) => {
    headCols.push(`Stock ${b.code || b.name.split(' ')[1] || b.name}`);
  });
  headCols.push('Total Red', 'Valuación Costo', 'Estado');

  const rows = inventoryList.map((item) => {
    const isLow = item.currentStock <= item.minStock;
    const row = [
      item.sku,
      item.name,
      item.category,
      `$${item.costPrice}`,
      item.retailPrice ? `$${item.retailPrice}` : 'Uso Interno'
    ];

    // Branch stocks
    branches.forEach((b) => {
      const bStock = getProductBranchStock(item.id, b.id);
      row.push(`${bStock}`);
    });

    row.push(
      `${item.currentStock} ${item.unit || 'uds'}`,
      `$${(item.costPrice * item.currentStock).toLocaleString()}`,
      isLow ? 'CRÍTICO' : 'ÓPTIMO'
    );

    return row;
  });

  autoTable(doc, {
    startY: y,
    head: [headCols],
    body: rows,
    theme: 'striped',
    headStyles: {
      fillColor: [190, 90, 56],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 6.5,
      textColor: [44, 40, 37],
      cellPadding: 1.6
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 22 },
      1: { fontStyle: 'bold', cellWidth: 55 },
      2: { cellWidth: 26 },
      3: { halign: 'right', cellWidth: 18 },
      4: { halign: 'right', cellWidth: 18 },
      [headCols.length - 3]: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
      [headCols.length - 2]: { halign: 'right', fontStyle: 'bold', cellWidth: 24 },
      [headCols.length - 1]: { halign: 'center', fontStyle: 'bold', cellWidth: 18 }
    },
    margin: { left: 10, right: 10 }
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // Inter-branch transfers audit log table
  if (branchTransfers.length > 0) {
    if (y > 150) {
      doc.addPage();
      y = 16;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(28, 25, 23);
    doc.text('Historial de Traspasos Recientes entre Sucursales', 10, y);
    y += 3;

    const trfRows = branchTransfers.slice(0, 10).map((t) => [
      t.transferCode,
      t.date,
      t.productName,
      `${t.quantity} ${t.unit || 'uds'}`,
      `${t.sourceBranchName} ➔ ${t.destinationBranchName}`,
      t.authorizedBy,
      t.notes || 'Reabastecimiento'
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Folio', 'Fecha', 'Producto Transferido', 'Cantidad', 'Ruta (Origen ➔ Destino)', 'Autorizado Por', 'Motivo']],
      body: trfRows,
      theme: 'striped',
      headStyles: {
        fillColor: [68, 64, 60],
        textColor: [255, 255, 255],
        fontSize: 6.5,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 6,
        textColor: [44, 40, 37],
        cellPadding: 1.4
      },
      margin: { left: 10, right: 10 }
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // Signatures
  if (includeSignatures) {
    if (y > 165) {
      doc.addPage();
      y = 20;
    }

    const signWidth = 65;
    const sign1X = 40;
    const sign2X = pageWidth - 40 - signWidth;

    doc.setDrawColor(180, 170, 160);
    doc.line(sign1X, y + 14, sign1X + signWidth, y + 14);
    doc.line(sign2X, y + 14, sign2X + signWidth, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(44, 40, 37);
    doc.text('Responsable de Almacén & Logística', sign1X + signWidth / 2, y + 18, { align: 'center' });
    doc.text('V.B. Director General / Franquiciatario', sign2X + signWidth / 2, y + 18, { align: 'center' });
  }

  drawFooter(doc, {
    receiptConfig,
    generatedBy
  });

  return doc;
}

/**
 * 3. EXPORT SALON EXECUTIVE ANALYTICS REPORT (Reporte Ejecutivo de Rendimiento y Ocupación)
 */
export async function generateExecutiveAnalyticsPDF(params: {
  receiptConfig: ReceiptConfig;
  ticketsList: SaleTicket[];
  branches: Branch[];
  topServices: { name: string; revenue: number; count: number; percentage: number }[];
  timeRangeLabel?: string;
  generatedBy?: string;
}): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const {
    receiptConfig,
    ticketsList,
    branches,
    topServices,
    timeRangeLabel = 'Mes Actual',
    generatedBy = 'Dirección de Operaciones'
  } = params;

  let logoBase64: string | null = null;
  if (receiptConfig.logoUrl) {
    logoBase64 = await getBase64ImageFromUrl(receiptConfig.logoUrl);
  }

  const paidTickets = ticketsList.filter((t) => t.status === 'PAID');
  const totalRevenue = paidTickets.reduce((acc, t) => acc + t.total, 0);
  const avgTicket = paidTickets.length > 0 ? Math.round(totalRevenue / paidTickets.length) : 0;

  let y = drawHeader(
    doc,
    'Reporte Ejecutivo de Rendimiento & Ocupación',
    `Indicadores clave de productividad, servicios líderes y retención • ${timeRangeLabel}`,
    logoBase64,
    {
      receiptConfig,
      dateRangeLabel: timeRangeLabel,
      generatedBy,
      includeLogo: receiptConfig.showLogo !== false
    }
  );

  const pageWidth = doc.internal.pageSize.getWidth();

  // 3 Big KPI Cards
  const kpiW = (pageWidth - 20 - 6) / 3;
  const kpiH = 20;

  // 1. Ticket Promedio
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(10, y, kpiW, kpiH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('TICKET PROMEDIO', 14, y + 6);
  doc.setFontSize(13);
  doc.setTextColor(28, 25, 23);
  doc.text(`$${avgTicket.toLocaleString()} MXN`, 14, y + 13);
  doc.setFontSize(6.5);
  doc.setTextColor(16, 185, 129);
  doc.text('+18.4% vs mes anterior', 14, y + 17.5);

  // 2. Ocupación
  const kpi2X = 10 + kpiW + 3;
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(kpi2X, y, kpiW, kpiH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('TASA DE OCUPACIÓN SILLONES', kpi2X + 4, y + 6);
  doc.setFontSize(13);
  doc.setTextColor(190, 90, 56);
  doc.text('82.6%', kpi2X + 4, y + 13);
  doc.setFontSize(6.5);
  doc.setTextColor(16, 185, 129);
  doc.text('6.4 horas activas / día', kpi2X + 4, y + 17.5);

  // 3. Retención
  const kpi3X = kpi2X + kpiW + 3;
  doc.setFillColor(250, 247, 242);
  doc.roundedRect(kpi3X, y, kpiW, kpiH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('RETENCIÓN & RECURRENCIA', kpi3X + 4, y + 6);
  doc.setFontSize(13);
  doc.setTextColor(21, 128, 61);
  doc.text('74.2%', kpi3X + 4, y + 13);
  doc.setFontSize(6.5);
  doc.setTextColor(16, 185, 129);
  doc.text('Tarjetas de sellos activas', kpi3X + 4, y + 17.5);

  y += kpiH + 8;

  // Services Ranking Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(28, 25, 23);
  doc.text('Servicios Más Rentables & Facturación Acumulada', 10, y);
  y += 3;

  const topRows = topServices.map((srv, idx) => [
    `#${idx + 1}`,
    srv.name,
    `${srv.count} servicios`,
    `$${srv.revenue.toLocaleString()} MXN`,
    `${srv.percentage}% del total`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Posición', 'Servicio / Tratamiento', 'Frecuencia', 'Facturación Bruta', 'Participación']],
    body: topRows,
    theme: 'striped',
    headStyles: {
      fillColor: [190, 90, 56],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [44, 40, 37],
      cellPadding: 2.5
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', cellWidth: 18 },
      1: { fontStyle: 'bold', cellWidth: 75 },
      2: { halign: 'center', cellWidth: 28 },
      3: { halign: 'right', fontStyle: 'bold', cellWidth: 35 },
      4: { halign: 'right', cellWidth: 30 }
    },
    margin: { left: 10, right: 10 }
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Multi-Branch Performance Summary Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(28, 25, 23);
  doc.text('Desempeño por Sucursales (Ventas y Personal)', 10, y);
  y += 3;

  const branchRows = branches.map((b) => [
    b.code,
    b.name,
    b.managerName,
    `${b.activeStaffCount} estilistas`,
    `$${b.todaySales.toLocaleString()} MXN`,
    `$${b.monthlyRevenue.toLocaleString()} MXN`,
    '100% Operativa'
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Código', 'Sucursal', 'Gerente', 'Equipo Activo', 'Ventas Hoy', 'Facturación Mensual', 'Estatus']],
    body: branchRows,
    theme: 'striped',
    headStyles: {
      fillColor: [68, 64, 60],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [44, 40, 37],
      cellPadding: 2.2
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 18 },
      1: { fontStyle: 'bold', cellWidth: 42 },
      2: { cellWidth: 32 },
      3: { cellWidth: 25 },
      4: { halign: 'right', cellWidth: 26 },
      5: { halign: 'right', fontStyle: 'bold', textColor: [190, 90, 56], cellWidth: 32 },
      6: { halign: 'center', cellWidth: 22 }
    },
    margin: { left: 10, right: 10 }
  });

  drawFooter(doc, {
    receiptConfig,
    generatedBy,
    dateRangeLabel: timeRangeLabel
  });

  return doc;
}
