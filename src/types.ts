export type UserRole = 'ADMIN' | 'MANAGER' | 'STYLIST' | 'RECEPTIONIST';

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  email: string;
  phone: string;
  serviceCommissionRate: number; // e.g. 0.40 = 40%
  productCommissionRate: number; // e.g. 0.15 = 15%
  specialties: string[];
  colorTag: string;
  isActive: boolean;
  permissions?: {
    canAccessPOS: boolean;
    canAccessFinances: boolean;
    canAccessInventory: boolean;
    canAccessReports: boolean;
    canManageStaff: boolean;
  };
}

export type AppointmentStatus = 'CONFIRMED' | 'IN_WAITING' | 'IN_CHAIR' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  ticketId?: string;
  notificationSent?: boolean;
  // Creative Anti-No-Show & Retention fields
  depositRequired?: boolean;
  depositAmount?: number;
  depositPaid?: boolean;
  depositPaidAt?: string;
  depositPaymentMethod?: 'TRANSFERENCIA' | 'TARJETA_CREDITO' | 'STRIPE_LINK' | 'EFECTIVO';
  suggestedUpsellId?: string;
  upsellAccepted?: boolean;
  upsellItemName?: string;
  upsellItemPrice?: number;
}

export interface WaitlistEntry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientId?: string;
  serviceId: string;
  serviceName: string;
  preferredStaffId: string; // 'ANY' or staffId
  preferredDate: string; // YYYY-MM-DD
  preferredTimeRange: string; // e.g. '10:00 - 14:00' o '15:00 - 19:00' o 'Cualquier hora'
  status: 'WAITING' | 'NOTIFIED' | 'BOOKED' | 'EXPIRED';
  notes?: string;
  createdAt: string;
  lastNotifiedAt?: string;
  notificationHistory?: {
    date: string;
    message: string;
    slotFreedInfo: string;
  }[];
}

export interface UpsellItem {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  description: string;
  recommendedForCategory: string[];
  popularPrompt: string; // e.g. "¿Te gustaría agregar una hidratación exprés por $180 extra? Responde SI"
}

export interface AntiNoShowSettings {
  depositsEnabled: boolean;
  depositPercentage: number; // e.g. 30
  minimumServicePriceForDeposit: number; // e.g. 1000
  depositRequiredCategories: string[]; // ['Colorimetría', 'Cabello', 'Faciales']
  icsCalendarAttachmentEnabled: boolean;
  reminderUpsellEnabled: boolean;
  automatedWaitlistTriggerEnabled: boolean;
  reminderNoticeHours: number; // 24
}

export interface SalonService {
  id: string;
  name: string;
  category: 'Cabello' | 'Colorimetría' | 'Manicura & Pedicura' | 'Spa & Masajes' | 'Faciales' | 'Cejas & Pestañas';
  durationMinutes: number;
  price: number;
  cost: number;
  requiredSupplies?: { supplyId: string; quantity: number; unit: string }[];
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'Tintes' | 'Tratamientos' | 'Shampoo & Cuidado' | 'Químicos & Peróxidos' | 'Insumos Desechables' | 'Retail Venta';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  retailPrice?: number;
  isRetail: boolean;
  location: string;
  branchStock?: Record<string, number>;
}

export interface BranchProductTransfer {
  id: string;
  transferCode: string;
  date: string;
  sourceBranchId: string;
  sourceBranchName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unit: string;
  authorizedBy: string;
  notes?: string;
  status: 'COMPLETED' | 'IN_TRANSIT' | 'CANCELLED';
}

export interface TechnicalFormula {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  staffId: string;
  staffName: string;
  serviceType: string;
  baseNatural: string;
  porosity: 'Baja' | 'Media' | 'Alta';
  formulaDetails: string; // e.g. "60g Tinte 7.1 + 30g 8.3 + 90ml Peróxido 20 Vol"
  exposureTimeMinutes: number;
  treatmentUsed?: string;
  photoUrl?: string;
  notes: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  joinedDate: string;
  totalSpent: number;
  visitCount: number;
  loyaltyPoints: number;
  stampCardCount: number; // 0 to 6 stamps (6 = free session)
  preferredStaffId?: string;
  allergiesOrNotes?: string;
  activePackages: {
    packageName: string;
    totalSessions: number;
    usedSessions: number;
    expiryDate: string;
  }[];
}

export interface ReceiptConfig {
  salonName: string;
  salonSlogan?: string;
  address: string;
  phone: string;
  taxId: string; // RFC
  logoUrl: string;
  printerName: string;
  printerConnection: 'USB' | 'Bluetooth' | 'Red TCP/IP' | 'Navegador (Predeterminada)';
  paperWidth: '58mm' | '80mm';
  fontSize: 'xs' | 'sm' | 'base';
  accentColor: string;
  showLogo: boolean;
  showTaxId: boolean;
  showStaffName: boolean;
  showClientName: boolean;
  showChairNumber: boolean;
  showLoyaltyPoints: boolean;
  showBarcode: boolean;
  customFooterMessage: string;
  autoCutter: boolean;
  spacing: 'compact' | 'normal' | 'spacious';
}

export interface TicketItem {
  id: string;
  type: 'SERVICE' | 'PRODUCT' | 'PACKAGE';
  itemId: string;
  name: string;
  staffId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export type TicketStatus = 'OPEN' | 'HOLD' | 'PAID' | 'CANCELLED';

export interface SaleTicket {
  id: string;
  ticketNumber: string;
  clientId: string;
  clientName: string;
  chairNumber?: string;
  status: TicketStatus;
  createdAt: string;
  items: TicketItem[];
  subtotal: number;
  discountTotal: number;
  depositCredited?: number; // Pre-paid deposit from appointment booking
  tax: number;
  tip: number;
  total: number;
  paymentMethod?: 'EFECTIVO' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA' | 'PUNTOS' | 'MIXTO';
  paymentDetails?: {
    cashReceived?: number;
    changeGiven?: number;
    pointsRedeemed?: number;
    depositCredited?: number;
  };
  paidAt?: string;
  closedByStaffId?: string;
  appointmentId?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  concept: string;
  category: 'Insumos y Productos' | 'Alquiler y Local' | 'Servicios Básicos' | 'Mantenimiento' | 'Marketing y Publicidad' | 'Nómina y Comisiones' | 'Otros';
  amount: number;
  paymentMethod: string;
  receiptNumber?: string;
  registeredBy: string;
}

export interface SoftwarePlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  isPopular?: boolean;
  features: string[];
  maxStaff: string;
  supportLevel: string;
}

export interface ActiveDeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'Desktop' | 'Tablet' | 'Mobile';
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  role: 'ADMIN' | 'RECEPTIONIST';
  tokenSignature: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  managerName: string;
  activeStaffCount: number;
  todaySales: number;
  monthlyRevenue: number;
  status: 'ACTIVE' | 'SYNCING' | 'MAINTENANCE';
  colorTag: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'Finanzas de Salón' | 'Fidelización' | 'Marketing de Belleza' | 'Operaciones & Fórmulas';
  readTime: string;
  author: string;
  authorRole: string;
  date: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  businessName: string;
  businessType: 'Salón de Alta Peluquería' | 'Spa & Centro Estético' | 'Nail Bar & Beauty Lounge' | 'Cadena de Salones';
  avatar: string;
  location: string;
  stars: number;
  quote: string;
  metricHighlight: string;
}
