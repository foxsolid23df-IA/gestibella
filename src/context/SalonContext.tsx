import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useQueryClient } from '@tanstack/react-query';
import {
  StaffMember, SalonService, InventoryItem, TechnicalFormula, ClientProfile,
  SaleTicket, ExpenseRecord, Appointment, AppointmentStatus, TicketItem,
  WaitlistEntry, UpsellItem, AntiNoShowSettings, ReceiptConfig,
  ActiveDeviceSession, Branch, BranchProductTransfer
} from '../types';
import {
  INITIAL_STAFF, INITIAL_SERVICES, INITIAL_INVENTORY, INITIAL_CLIENTS,
  INITIAL_FORMULAS, INITIAL_APPOINTMENTS, INITIAL_TICKETS, INITIAL_EXPENSES,
  INITIAL_WAITLIST, INITIAL_UPSELL_ITEMS, INITIAL_ANTI_NOSHOW_SETTINGS,
  INITIAL_BRANCH_TRANSFERS
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useTenant } from '../lib/tenantContext';

export type PublicNavSection = 'INICIO' | 'CARACTERISTICAS' | 'TESTIMONIOS' | 'COMUNICACION' | 'BLOG' | 'PLANES';
export type PortalNavModule = 'DASHBOARD'|'AGENDA'|'ANTI_NOSHOW'|'POS'|'INVENTORY_FORMULAS'|'CRM'|'STAFF_COMMISSIONS'|'STAFF_MANAGEMENT'|'FINANCES'|'REPORTS'|'PRINTER_SETTINGS'|'AUTHORIZED_DEVICES'|'MULTI_BRANCH'|'ARCHITECTURE_DOCS';

interface ToastNotification { id: string; type: 'success'|'info'|'warning'|'error'; title: string; message: string; }

interface SalonContextType {
  isPortalOpen: boolean; setIsPortalOpen: (open:boolean)=>void;
  publicSection: PublicNavSection; setPublicSection: (s:PublicNavSection)=>void;
  portalModule: PortalNavModule; setPortalModule: (m:PortalNavModule)=>void;
  isLoginModalOpen: boolean; setIsLoginModalOpen: (o:boolean)=>void;
  isSwitchProfileModalOpen: boolean; setIsSwitchProfileModalOpen: (o:boolean)=>void;
  currentStaff: StaffMember; setCurrentStaff: (s:StaffMember)=>void;
  loginAs: (staffId:string)=>void; logout: ()=>void;
  addStaffMember: (data: Omit<StaffMember,'id'>)=>void;
  updateStaffMember: (id:string, data:Partial<StaffMember>)=>void;
  deleteStaffMember: (id:string)=>void;
  staffList: StaffMember[]; servicesList: SalonService[]; inventoryList: InventoryItem[];
  clientsList: ClientProfile[]; formulasList: TechnicalFormula[]; appointmentsList: Appointment[];
  ticketsList: SaleTicket[]; expensesList: ExpenseRecord[]; waitlistEntries: WaitlistEntry[];
  upsellItemsList: UpsellItem[]; antiNoShowSettings: AntiNoShowSettings;
  receiptConfig: ReceiptConfig; updateReceiptConfig: (c:Partial<ReceiptConfig>)=>void;
  activeSessions: ActiveDeviceSession[]; revokeSession:(id:string)=>void; terminateOtherSessions:()=>void;
  branches: Branch[]; selectedBranchId: string; setSelectedBranchId:(id:string)=>void;
  branchTransfers: BranchProductTransfer[];
  transferProductBetweenBranches: (p:{sourceBranchId:string;destinationBranchId:string;productId:string;quantity:number;notes?:string;authorizedBy?:string;})=>Promise<boolean>;
  getProductBranchStock: (productId:string, branchId:string)=>number;
  activeCheckoutTicket: SaleTicket|null; setActiveCheckoutTicket:(t:SaleTicket|null)=>void;
  lastCompletedReceipt: SaleTicket|null; setLastCompletedReceipt:(r:SaleTicket|null)=>void;
  selectedFormulaClient: ClientProfile|null; setSelectedFormulaClient:(c:ClientProfile|null)=>void;
  addAppointment: (a:Omit<Appointment,'id'>)=>void;
  updateAppointmentStatus: (id:string,s:AppointmentStatus)=>void;
  convertAppointmentToOpenTicket: (aptId:string)=>SaleTicket;
  sendAppointmentReminder:(id:string)=>void;
  recordAppointmentDeposit:(aptId:string,amount:number,method:NonNullable<Appointment['depositPaymentMethod']>)=>void;
  toggleAppointmentUpsell:(aptId:string,upsellId:string)=>void;
  addToWaitlist:(e:Omit<WaitlistEntry,'id'|'createdAt'|'status'>)=>void;
  cancelAppointmentAndTriggerWaitlist:(aptId:string)=>{waitlistMatches:WaitlistEntry[];freedSlot:string};
  notifyWaitlistClient:(id:string,msg?:string)=>void;
  bookWaitlistToAppointment:(id:string,date:string,time:string,staffId:string)=>void;
  removeWaitlistEntry:(id:string)=>void;
  updateAntiNoShowSettings:(s:Partial<AntiNoShowSettings>)=>void;
  createOpenTicket:(clientId:string,chairNumber?:string)=>SaleTicket;
  addItemToTicket:(ticketId:string,item:Omit<TicketItem,'id'>)=>void;
  removeItemFromTicket:(ticketId:string,itemId:string)=>void;
  checkoutTicket:(ticketId:string,pm:SaleTicket['paymentMethod'],tip:number,cashGiven?:number,pointsToRedeem?:number)=>void;
  addSessionPackageToClient:(clientId:string,packageName:string,totalSessions:number,price:number)=>void;
  addInventoryItem:(i:Omit<InventoryItem,'id'>)=>void;
  updateStock:(itemId:string,newStock:number)=>void;
  recordServiceSupplyConsumption:(s:{supplyId:string;quantity:number}[])=>void;
  addTechnicalFormula:(f:Omit<TechnicalFormula,'id'>)=>void;
  addClient:(c:Omit<ClientProfile,'id'|'totalSpent'|'visitCount'|'loyaltyPoints'|'stampCardCount'|'activePackages'|'joinedDate'>)=>void;
  addStampToClient:(id:string)=>void; redeemStampCardReward:(id:string)=>void; usePackageSession:(id:string,idx:number)=>void;
  addExpense:(e:Omit<ExpenseRecord,'id'>)=>void;
  toasts: ToastNotification[]; addToast:(t:ToastNotification['type'],title:string,msg:string)=>void; removeToast:(id:string)=>void;
  resetToDemoData:()=>void;
  isSupabaseEnabled: boolean; isTenantLoading: boolean;
}

const SalonContext = createContext<SalonContextType|undefined>(undefined);

// Helpers to persist to Supabase (fire-and-forget, demo RLS allow all)
async function sbInsert(table: string, row: any, tenantId: string|null) {
  if (!isSupabaseConfigured || !supabase || !tenantId) return;
  try { await supabase.from(table).insert({ ...row, tenant_id: tenantId }); } catch(e){ console.warn('[supabase insert]',table,e); }
}
async function sbUpdate(table: string, id: string, patch: any) {
  if (!isSupabaseConfigured || !supabase) return;
  try { await supabase.from(table).update(patch).eq('id', id); } catch(e){ console.warn('[supabase update]',table,e); }
}
async function sbDelete(table: string, id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try { await supabase.from(table).delete().eq('id', id); } catch(e){ console.warn('[supabase delete]',table,e); }
}
async function sbRpcTransfer(tenantId:string, source:string, dest:string, product:string, qty:number, authBy:string, notes?:string){
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.rpc('transfer_product', {
      p_tenant_id: tenantId, p_source_branch_id: source, p_destination_branch_id: dest, p_product_id: product, p_quantity: qty, p_authorized_by: authBy, p_notes: notes||null
    });
    if (error) throw error;
    return data;
  } catch(e){ console.warn('[rpc transfer]',e); return null; }
}

export const SalonProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const { tenantId, isLoading: isTenantLoading, limits, isExpired, tenant } = useTenant();
  const qc = useQueryClient();
  const isSupabaseEnabled = isSupabaseConfigured && !!tenantId;

  // Navigation — ephemeral (no localStorage)
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [publicSection, setPublicSection] = useState<PublicNavSection>('INICIO');
  const [portalModule, setPortalModule] = useState<PortalNavModule>('DASHBOARD');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSwitchProfileModalOpen, setIsSwitchProfileModalOpen] = useState(false);

  // Data — in-memory (migrated hard from localStorage)
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [currentStaff, setCurrentStaff] = useState<StaffMember>(INITIAL_STAFF[0]);
  const [servicesList] = useState<SalonService[]>(INITIAL_SERVICES);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [clientsList, setClientsList] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [formulasList, setFormulasList] = useState<TechnicalFormula[]>(INITIAL_FORMULAS);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [ticketsList, setTicketsList] = useState<SaleTicket[]>(INITIAL_TICKETS);
  const [expensesList, setExpensesList] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>(INITIAL_WAITLIST);
  const [upsellItemsList] = useState<UpsellItem[]>(INITIAL_UPSELL_ITEMS);
  const [antiNoShowSettings, setAntiNoShowSettings] = useState<AntiNoShowSettings>(INITIAL_ANTI_NOSHOW_SETTINGS);
  const [receiptConfig, setReceiptConfig] = useState<ReceiptConfig>({
    salonName:'GestiBella Salon & Spa', salonSlogan:'Alta Peluquería & Estética',
    address:'Av. Presidente Masaryk 360, Polanco, CDMX', phone:'+52 55 5540 8890',
    taxId:'GBE240824-XYZ', logoUrl:'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
    printerName:'Epson TM-T20III Thermal POS', printerConnection:'USB', paperWidth:'80mm', fontSize:'xs', accentColor:'#BE5A38',
    showLogo:true, showTaxId:true, showStaffName:true, showClientName:true, showChairNumber:true, showLoyaltyPoints:true, showBarcode:true,
    customFooterMessage:'¡Gracias por consentirte con nosotros! Visítanos de nuevo y acumula sellos para tu tratamiento gratis.', autoCutter:true, spacing:'normal'
  });
  const [activeSessions, setActiveSessions] = useState<ActiveDeviceSession[]>([
    { id:'session-curr', deviceName:'MacBook Pro (Recepción Principal)', deviceType:'Desktop', browser:'Chrome 125.0 (macOS)', ipAddress:'189.203.14.88', location:'Ciudad de México, MX', lastActive:'Hace un momento', isCurrent:true, role:'ADMIN', tokenSignature:'sig-gb-9982x' },
    { id:'session-tablet', deviceName:'iPad Pro (Sillón 02 / Estilista)', deviceType:'Tablet', browser:'Safari Mobile (iPadOS)', ipAddress:'189.203.14.90', location:'Ciudad de México, MX', lastActive:'Hace 12 minutos', isCurrent:false, role:'RECEPTIONIST', tokenSignature:'sig-gb-7741y' },
    { id:'session-remote', deviceName:'PC Escritorio (Sucursal Alterna / Sospechosa)', deviceType:'Desktop', browser:'Firefox 120 (Windows)', ipAddress:'201.141.55.12', location:'Guadalajara, JAL', lastActive:'Hace 3 horas', isCurrent:false, role:'ADMIN', tokenSignature:'sig-gb-3310z' }
  ]);
  const [branches, setBranches] = useState<Branch[]>([
    { id:'branch-1', name:'GestiBella Polanco (Principal)', code:'POL-01', address:'Av. Presidente Masaryk 360, Polanco, CDMX', phone:'+52 55 5540 8890', managerName:'Valentina Vega', activeStaffCount:6, todaySales:14920, monthlyRevenue:384000, status:'ACTIVE', colorTag:'#BE5A38' },
    { id:'branch-2', name:'GestiBella Roma Norte', code:'ROM-02', address:'Álvaro Obregón 130, Roma Nte., CDMX', phone:'+52 55 5264 1190', managerName:'Mariana Silva', activeStaffCount:4, todaySales:9850, monthlyRevenue:245000, status:'ACTIVE', colorTag:'#2D2A26' },
    { id:'branch-3', name:'GestiBella Satélite', code:'SAT-03', address:'Blvd. Manuel Ávila Camacho 2200, Naucalpan', phone:'+52 55 5373 4410', managerName:'Carlos Mendieta', activeStaffCount:5, todaySales:11200, monthlyRevenue:310000, status:'ACTIVE', colorTag:'#D97706' }
  ]);
  const [selectedBranchId, setSelectedBranchId] = useState('ALL');
  const [branchTransfers, setBranchTransfers] = useState<BranchProductTransfer[]>(INITIAL_BRANCH_TRANSFERS);
  const [activeCheckoutTicket, setActiveCheckoutTicket] = useState<SaleTicket|null>(null);
  const [lastCompletedReceipt, setLastCompletedReceipt] = useState<SaleTicket|null>(null);
  const [selectedFormulaClient, setSelectedFormulaClient] = useState<ClientProfile|null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Load from Supabase on tenant ready (hard migration read)
  // Tenant limpio: nuevos tenants inician vacíos, solo gestibella-demo mantiene seed como demo
  useEffect(() => {
    if (!isSupabaseEnabled || !supabase || !tenantId) return;
    let cancelled=false;
    (async()=>{
      try{
        const [staffRes, branchesRes, clientsRes, apptsRes, ticketsRes, expensesRes, waitlistRes, formulasRes] = await Promise.all([
          supabase.from('staff').select('*').eq('tenant_id', tenantId),
          supabase.from('branches').select('*').eq('tenant_id', tenantId),
          supabase.from('clients').select('*').eq('tenant_id', tenantId),
          supabase.from('appointments').select('*').eq('tenant_id', tenantId),
          supabase.from('tickets').select('*, ticket_items(*)').eq('tenant_id', tenantId),
          supabase.from('expenses').select('*').eq('tenant_id', tenantId),
          supabase.from('waitlist_entries').select('*').eq('tenant_id', tenantId),
          supabase.from('technical_formulas').select('*').eq('tenant_id', tenantId),
        ]);
        if(cancelled) return;
        const isDemoTenant = tenant?.slug === 'gestibella-demo';
        // Staff y branches: siempre hidratar si hay datos (incluye tenant nuevo con 1 staff/1 branch)
        if(staffRes.data){
          if(staffRes.data.length>0){
            const mapped: StaffMember[] = staffRes.data.map((r:any)=>({ id:r.id, name:r.name, role:r.role, roleTitle:r.role_title, avatar:r.avatar, email:r.email, phone:r.phone, serviceCommissionRate:Number(r.service_commission_rate), productCommissionRate:Number(r.product_commission_rate), specialties:r.specialties||[], colorTag:r.color_tag, isActive:r.is_active, permissions:r.permissions }));
            setStaffList(mapped); setCurrentStaff(mapped[0]);
          } else if (!isDemoTenant) {
            setStaffList([]); // tenant limpio sin demo staff
          }
        }
        if(branchesRes.data){
          if(branchesRes.data.length>0){
            setBranches(branchesRes.data.map((r:any)=>({ id:r.id, name:r.name, code:r.code, address:r.address, phone:r.phone, managerName:r.manager_name, activeStaffCount:r.active_staff_count, todaySales:Number(r.today_sales), monthlyRevenue:Number(r.monthly_revenue), status:r.status, colorTag:r.color_tag })));
          } else if (!isDemoTenant) {
            setBranches([]);
          }
        }
        // Datos operativos: para tenant limpio, vacío si no hay datos; para demo, mantener seed si vacío
        if(clientsRes.data){
          if(clientsRes.data.length>0){
            setClientsList(clientsRes.data.map((r:any)=>({ id:r.id, name:r.name, phone:r.phone, email:r.email, avatar:r.avatar, joinedDate:r.joined_date, totalSpent:Number(r.total_spent), visitCount:r.visit_count, loyaltyPoints:r.loyalty_points, stampCardCount:r.stamp_card_count, preferredStaffId:r.preferred_staff_id, allergiesOrNotes:r.allergies_or_notes, activePackages:[] })));
          } else if (!isDemoTenant) {
            setClientsList([]);
          }
        }
        if(apptsRes.data){
          if(apptsRes.data.length>0){
            setAppointmentsList(apptsRes.data.map((r:any)=>({ id:r.id, clientName:r.client_name, clientPhone:r.client_phone, clientId:r.client_id, staffId:r.staff_id, serviceId:r.service_id, serviceName:r.service_name, date:r.date, time:r.time, durationMinutes:r.duration_minutes, price:Number(r.price), status:r.status, notes:r.notes, ticketId:r.ticket_id, notificationSent:r.notification_sent, depositRequired:r.deposit_required, depositAmount:r.deposit_amount?Number(r.deposit_amount):undefined, depositPaid:r.deposit_paid, depositPaidAt:r.deposit_paid_at, depositPaymentMethod:r.deposit_payment_method, suggestedUpsellId:r.suggested_upsell_id, upsellAccepted:r.upsell_accepted, upsellItemName:r.upsell_item_name, upsellItemPrice:r.upsell_item_price?Number(r.upsell_item_price):undefined })));
          } else if (!isDemoTenant) {
            setAppointmentsList([]);
          }
        }
        if(ticketsRes.data){
          if(ticketsRes.data.length>0){
            setTicketsList(ticketsRes.data.map((r:any)=>({ id:r.id, ticketNumber:r.ticket_number, clientId:r.client_id, clientName:r.client_name, chairNumber:r.chair_number, status:r.status, createdAt:r.created_at, appointmentId:r.appointment_id, items:(r.ticket_items||[]).map((it:any)=>({ id:it.id, type:it.type, itemId:it.item_id, name:it.name, staffId:it.staff_id, quantity:Number(it.quantity), unitPrice:Number(it.unit_price), discount:Number(it.discount), total:Number(it.total)})), subtotal:Number(r.subtotal), discountTotal:Number(r.discount_total), depositCredited:Number(r.deposit_credited), tax:Number(r.tax), tip:Number(r.tip), total:Number(r.total), paymentMethod:r.payment_method, paymentDetails:r.payment_details, paidAt:r.paid_at, closedByStaffId:r.closed_by_staff_id })));
          } else if (!isDemoTenant) {
            setTicketsList([]);
          }
        }
        if(expensesRes.data){
          if(expensesRes.data.length>0){
            setExpensesList(expensesRes.data.map((r:any)=>({ id:r.id, date:r.date, concept:r.concept, category:r.category, amount:Number(r.amount), paymentMethod:r.payment_method, receiptNumber:r.receipt_number, registeredBy:r.registered_by })));
          } else if (!isDemoTenant) {
            setExpensesList([]);
          }
        }
        if(waitlistRes.data){
          if(waitlistRes.data.length>0){
            setWaitlistEntries(waitlistRes.data.map((r:any)=>({ id:r.id, clientName:r.client_name, clientPhone:r.client_phone, clientId:r.client_id, serviceId:r.service_id, serviceName:r.service_name, preferredStaffId:r.preferred_staff_id, preferredDate:r.preferred_date, preferredTimeRange:r.preferred_time_range, status:r.status, notes:r.notes, createdAt:r.created_at, lastNotifiedAt:r.last_notified_at, notificationHistory:r.notification_history })));
          } else if (!isDemoTenant) {
            setWaitlistEntries([]);
          }
        }
        if(formulasRes.data){
          if(formulasRes.data.length>0){
            setFormulasList(formulasRes.data.map((r:any)=>({ id:r.id, clientId:r.client_id, clientName:r.client_name, date:r.date, staffId:r.staff_id, staffName:r.staff_name, serviceType:r.service_type, baseNatural:r.base_natural, porosity:r.porosity, formulaDetails:r.formula_details, exposureTimeMinutes:r.exposure_time_minutes, treatmentUsed:r.treatment_used, photoUrl:r.photo_url, notes:r.notes })));
          } else if (!isDemoTenant) {
            setFormulasList([]);
          }
        }
        // Si es tenant limpio y no tiene datos, también limpiar branchTransfers (no hay endpoint, se queda con seed pero se puede ignorar)
        if (!isDemoTenant) {
          // inventory y servicios también deberían quedar vacíos para tenant limpio, pero los dejamos con seed por ahora
          // Si quieres inventario limpio, descomenta:
          // setInventoryList([]);
        }
      } catch(e){ console.warn('[supabase hydrate]',e); }
    })();
    return ()=>{ cancelled=true; };
  }, [isSupabaseEnabled, tenantId, tenant?.slug]);

  const addToast = useCallback((type:ToastNotification['type'], title:string, message:string)=>{
    const id = Date.now().toString()+Math.random().toString().slice(2,5);
    setToasts(prev=>[...prev,{id,type,title,message}]);
    setTimeout(()=> setToasts(prev=>prev.filter(t=>t.id!==id)),4500);
  },[]);
  const removeToast = useCallback((id:string)=> setToasts(prev=>prev.filter(t=>t.id!==id)),[]);

  const loginAs = (staffId:string)=>{
    const found = staffList.find(s=>s.id===staffId);
    if(found){ setCurrentStaff(found); setIsPortalOpen(true); setIsLoginModalOpen(false); addToast('success','Sesión Iniciada',`Bienvenido(a) a GestiBella, ${found.name} (${found.roleTitle})`); }
  };
  const logout = ()=>{ setIsPortalOpen(false); addToast('info','Sesión Finalizada','Has salido del portal exclusivo del salón.'); };

  const addStaffMember = (data:Omit<StaffMember,'id'>)=>{
    if (limits.maxStaff !== null && staffList.length >= limits.maxStaff) {
      addToast('error','Límite del plan alcanzado',`Plan ${tenant?.plan_tier ?? ''} permite máximo ${limits.maxStaff} colaboradores. Actualiza a ${tenant?.plan_tier==='starter'?'Pro':'Elite'} para añadir más.`);
      return;
    }
    if (isExpired) { addToast('error','Licencia vencida','Renueva tu licencia para añadir personal.'); return; }
    const newId = `staff-${Date.now()}`;
    const newStaff:StaffMember = { ...data, id:newId, permissions: data.permissions||{ canAccessPOS:true, canAccessFinances:data.role==='ADMIN', canAccessInventory:true, canAccessReports:data.role==='ADMIN'||data.role==='MANAGER', canManageStaff:data.role==='ADMIN' } };
    setStaffList(prev=>[...prev,newStaff]);
    if(isSupabaseEnabled) sbInsert('staff',{ id:newId, name:newStaff.name, email:newStaff.email, phone:newStaff.phone, role:newStaff.role, role_title:newStaff.roleTitle, avatar:newStaff.avatar, service_commission_rate:newStaff.serviceCommissionRate, product_commission_rate:newStaff.productCommissionRate, specialties:newStaff.specialties, color_tag:newStaff.colorTag, is_active:newStaff.isActive, permissions:newStaff.permissions }, tenantId);
    addToast('success','Colaborador Registrado',`Se ha dado de alta a ${newStaff.name} exitosamente.`);
  };
  const updateStaffMember = (id:string, updatedData:Partial<StaffMember>)=>{
    setStaffList(prev=> prev.map(s=> s.id===id?{...s,...updatedData}:s));
    if(currentStaff.id===id) setCurrentStaff(prev=>({ ...prev, ...updatedData }));
    if(isSupabaseEnabled) sbUpdate('staff', id, { name:updatedData.name, role:updatedData.role, role_title:updatedData.roleTitle, phone:updatedData.phone, email:updatedData.email, permissions:updatedData.permissions });
    addToast('success','Colaborador Actualizado','Los cambios en el perfil y permisos han sido guardados.');
  };
  const deleteStaffMember = (id:string)=>{
    if(staffList.length<=1){ addToast('error','Acción no permitida','Debe existir al menos un colaborador activo en el sistema.'); return; }
    const target=staffList.find(s=>s.id===id);
    if(target?.id===currentStaff.id){ addToast('error','Sesión Activa','No puedes eliminar el perfil con el que estás conectado actualmente.'); return; }
    setStaffList(prev=> prev.filter(s=>s.id!==id));
    if(isSupabaseEnabled) sbDelete('staff', id);
    addToast('info','Colaborador Eliminado','El perfil ha sido removido del sistema.');
  };

  const updateReceiptConfig = (newConfig:Partial<ReceiptConfig>)=>{
    setReceiptConfig(prev=>({ ...prev, ...newConfig }));
    if(isSupabaseEnabled && tenantId) supabase.from('receipt_config').upsert({ tenant_id: tenantId, salon_name:newConfig.salonName, address:newConfig.address, phone:newConfig.phone, tax_id:newConfig.taxId, logo_url:newConfig.logoUrl, accent_color:newConfig.accentColor, custom_footer_message:newConfig.customFooterMessage } as any).then(()=>{});
  };
  const revokeSession = (sessionId:string)=> setActiveSessions(prev=> prev.filter(s=>s.id!==sessionId));
  const terminateOtherSessions = ()=> setActiveSessions(prev=> prev.filter(s=>s.isCurrent));

  // Business actions — local + supabase persist
  const addAppointment = (newAptData:Omit<Appointment,'id'>)=>{
    if (isExpired) { addToast('error','Licencia vencida','Renueva tu licencia para agendar citas.'); return; }
    const id=`apt-${Date.now()}`;
    let depositRequired=newAptData.depositRequired??false;
    let depositAmount=newAptData.depositAmount;
    if(antiNoShowSettings.depositsEnabled && newAptData.price>=antiNoShowSettings.minimumServicePriceForDeposit && depositRequired===false){
      depositRequired=true; depositAmount=Math.round((newAptData.price*antiNoShowSettings.depositPercentage)/100);
    }
    const newApt:Appointment={ ...newAptData, id, depositRequired, depositAmount: depositAmount || (depositRequired?Math.round((newAptData.price*antiNoShowSettings.depositPercentage)/100):undefined) };
    setAppointmentsList(prev=>[newApt,...prev]);
    if(isSupabaseEnabled) sbInsert('appointments',{ id, client_id:newApt.clientId, client_name:newApt.clientName, client_phone:newApt.clientPhone, staff_id:newApt.staffId, service_id:newApt.serviceId, service_name:newApt.serviceName, date:newApt.date, time:newApt.time, duration_minutes:newApt.durationMinutes, price:newApt.price, status:newApt.status, notes:newApt.notes, deposit_required:depositRequired, deposit_amount:depositAmount }, tenantId);
    addToast('success','Cita Agendada',`Cita para ${newApt.clientName} el ${newApt.date} a las ${newApt.time} hrs.`);
  };
  const updateAppointmentStatus = (id:string,status:AppointmentStatus)=>{
    setAppointmentsList(prev=> prev.map(apt=> apt.id===id?{...apt,status}:apt));
    if(isSupabaseEnabled) sbUpdate('appointments', id, { status });
    addToast('info','Estado Actualizado',`Estado de cita cambiado a: ${status}`);
  };
  const recordAppointmentDeposit = (aptId:string,amount:number,method:NonNullable<Appointment['depositPaymentMethod']>)=>{
    setAppointmentsList(prev=> prev.map(apt=> apt.id!==aptId?apt:{...apt, depositPaid:true, depositAmount:amount, depositPaidAt:new Date().toLocaleString(), depositPaymentMethod:method}));
    if(isSupabaseEnabled) sbUpdate('appointments', aptId, { deposit_paid:true, deposit_amount:amount, deposit_paid_at:new Date().toISOString(), deposit_payment_method:method });
    addToast('success','Anticipo Registrado',`Depósito de $${amount.toLocaleString()} MXN abonado con éxito (${method}).`);
  };
  const toggleAppointmentUpsell = (aptId:string,upsellId:string)=>{
    const upsell=(upsellItemsList as UpsellItem[]).find(u=>u.id===upsellId); if(!upsell) return;
    setAppointmentsList(prev=> prev.map(apt=>{ if(apt.id!==aptId) return apt; const nextAccepted=!apt.upsellAccepted; return {...apt, suggestedUpsellId:upsellId, upsellAccepted:nextAccepted, upsellItemName:nextAccepted?upsell.name:undefined, upsellItemPrice:nextAccepted?upsell.price:undefined }; }));
    addToast('info','Up-Selling Actualizado',`Servicio adicional ${upsell.name} ($${upsell.price}) modificado.`);
  };
  const sendAppointmentReminder = (aptId:string)=>{
    setAppointmentsList(prev=> prev.map(apt=> apt.id===aptId?{...apt, notificationSent:true}:apt));
    const apt=appointmentsList.find(a=>a.id===aptId);
    addToast('success','Recordatorio 24h Enviado',`WhatsApp enviado a ${apt?.clientName||'Cliente'}. Incluye botón de .ics.`);
  };
  const cancelAppointmentAndTriggerWaitlist = (aptId:string)=>{
    const targetApt=appointmentsList.find(a=>a.id===aptId);
    if(!targetApt) return {waitlistMatches:[],freedSlot:''};
    setAppointmentsList(prev=> prev.map(a=> a.id===aptId?{...a,status:'CANCELLED'}:a));
    if(isSupabaseEnabled) sbUpdate('appointments', aptId, { status:'CANCELLED' });
    const freedSlot=`${targetApt.date} a las ${targetApt.time} hrs`;
    const matches=waitlistEntries.filter(w=> w.status==='WAITING' && (w.preferredDate===targetApt.date || !w.preferredDate) && (w.preferredStaffId==='ANY' || w.preferredStaffId===targetApt.staffId));
    if(matches.length>0 && antiNoShowSettings.automatedWaitlistTriggerEnabled){
      const candidate=matches[0];
      const msg=`¡Hola ${candidate.clientName}! Se liberó un espacio el ${freedSlot} para ${candidate.serviceName}. ¿Deseas tomar la cita? Responde SI.`;
      setWaitlistEntries(prev=> prev.map(w=> w.id!==candidate.id?w:{...w,status:'NOTIFIED' as const, lastNotifiedAt:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), notificationHistory:[...(w.notificationHistory||[]),{date:new Date().toLocaleDateString(),message:msg,slotFreedInfo:freedSlot}]}));
      addToast('warning','⚡ Disparo Automático de Lista de Espera',`Cita cancelada. Notificación prioritaria a ${candidate.clientName}.`);
    } else addToast('info','Cita Cancelada',`El espacio de ${targetApt.clientName} ha quedado disponible.`);
    return {waitlistMatches:matches,freedSlot};
  };
  const addToWaitlist = (entryData:Omit<WaitlistEntry,'id'|'createdAt'|'status'>)=>{
    const newEntry:WaitlistEntry={ ...entryData, id:`wl-${Date.now()}`, status:'WAITING', createdAt:new Date().toLocaleString()};
    setWaitlistEntries(prev=>[newEntry,...prev]);
    if(isSupabaseEnabled) sbInsert('waitlist_entries',{ id:newEntry.id, client_name:newEntry.clientName, client_phone:newEntry.clientPhone, client_id:newEntry.clientId, service_id:newEntry.serviceId, service_name:newEntry.serviceName, preferred_staff_id:newEntry.preferredStaffId, preferred_date:newEntry.preferredDate, preferred_time_range:newEntry.preferredTimeRange, status:'WAITING', notes:newEntry.notes }, tenantId);
    addToast('success','Cliente Agregado a Lista de Espera',`${newEntry.clientName} registrada.`);
  };
  const notifyWaitlistClient = (waitlistId:string,customMessage?:string)=>{
    const entry=waitlistEntries.find(w=>w.id===waitlistId); if(!entry) return;
    const message=customMessage||`¡Hola ${entry.clientName}! Tenemos un espacio disponible para ${entry.serviceName}. ¿Te gustaría apartarlo?`;
    setWaitlistEntries(prev=> prev.map(w=> w.id!==waitlistId?w:{...w,status:'NOTIFIED' as const, lastNotifiedAt:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), notificationHistory:[...(w.notificationHistory||[]),{date:new Date().toLocaleDateString(),message,slotFreedInfo:'Notificación Manual'}]}));
    addToast('success','Aviso Enviado por WhatsApp',`Notificación a ${entry.clientName}.`);
  };
  const bookWaitlistToAppointment = (waitlistId:string,date:string,time:string,staffId:string)=>{
    const entry=waitlistEntries.find(w=>w.id===waitlistId); if(!entry) return;
    const staff=staffList.find(s=>s.id===staffId)||staffList[0];
    const service=(servicesList as any[]).find((s:any)=>s.id===entry.serviceId)||servicesList[0];
    const newApt:Appointment={ id:`apt-${Date.now()}`, clientId:entry.clientId||`cli-${Date.now()}`, clientName:entry.clientName, clientPhone:entry.clientPhone, staffId:staff.id, serviceId:service.id, serviceName:service.name, date, time, durationMinutes:service.durationMinutes, price:service.price, status:'CONFIRMED', notes:`Asignado desde Lista de Espera: ${entry.notes||''}` };
    setAppointmentsList(prev=>[newApt,...prev]);
    setWaitlistEntries(prev=> prev.map(w=> w.id===waitlistId?{...w,status:'BOOKED' as const}:w));
    addToast('success','¡Cita Asignada con Éxito!',`${entry.clientName} agendada el ${date} a las ${time} con ${staff.name}.`);
  };
  const removeWaitlistEntry=(id:string)=>{ setWaitlistEntries(prev=> prev.filter(w=>w.id!==id)); if(isSupabaseEnabled) sbDelete('waitlist_entries', id); addToast('info','Lista de Espera Actualizada','Entrada removida.'); };
  const updateAntiNoShowSettings=(newSettings:Partial<AntiNoShowSettings>)=>{ setAntiNoShowSettings(prev=>({...prev,...newSettings})); addToast('success','Políticas Anti No-Show Guardadas','Parámetros actualizados.'); };

  const convertAppointmentToOpenTicket=(aptId:string):SaleTicket=>{
    const apt=appointmentsList.find(a=>a.id===aptId); if(!apt) throw new Error('Cita no encontrada');
    if(apt.ticketId){ const existing=ticketsList.find(t=>t.id===apt.ticketId); if(existing){ setPortalModule('POS'); return existing; } }
    const ticketNumber=`TKT-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}`;
    const newTicketId=`tkt-${Date.now()}`;
    const items:TicketItem[]=[{ id:`item-${Date.now()}-1`, type:'SERVICE', itemId:apt.serviceId, name:apt.serviceName, staffId:apt.staffId, quantity:1, unitPrice:apt.price, discount:0, total:apt.price }];
    if(apt.upsellAccepted && apt.upsellItemName && apt.upsellItemPrice) items.push({ id:`item-${Date.now()}-upsell`, type:'SERVICE', itemId:apt.suggestedUpsellId||`up-${Date.now()}`, name:`[Up-Selling] ${apt.upsellItemName}`, staffId:apt.staffId, quantity:1, unitPrice:apt.upsellItemPrice, discount:0, total:apt.upsellItemPrice });
    const subtotal=items.reduce((s,it)=>s+it.total,0);
    const depositCredit=apt.depositPaid&&apt.depositAmount?apt.depositAmount:0;
    const newTicket:SaleTicket={ id:newTicketId, ticketNumber, clientId:apt.clientId, clientName:apt.clientName, chairNumber:'Sillón en Atención', status:'HOLD', createdAt:`${apt.date} ${apt.time}`, appointmentId:apt.id, items, subtotal, discountTotal:0, depositCredited:depositCredit, tax:0, tip:0, total:Math.max(0,subtotal-depositCredit) };
    setTicketsList(prev=>[newTicket,...prev]);
    setAppointmentsList(prev=> prev.map(a=> a.id===aptId?{...a,status:'IN_CHAIR',ticketId:newTicketId}:a));
    addToast('success','Ticket en Espera Creado',`Cuenta abierta para ${apt.clientName}.`);
    setPortalModule('POS'); return newTicket;
  };
  const createOpenTicket=(clientId:string,chairNumber='Sillón General'):SaleTicket=>{
    const client=clientsList.find(c=>c.id===clientId);
    const ticketNumber=`TKT-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}`;
    const newTicket:SaleTicket={ id:`tkt-${Date.now()}`, ticketNumber, clientId, clientName:client?client.name:'Cliente Mostrador', chairNumber, status:'HOLD', createdAt:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), items:[], subtotal:0, discountTotal:0, tax:0, tip:0, total:0 };
    setTicketsList(prev=>[newTicket,...prev]);
    addToast('success','Cuenta Abierta Iniciada',`Ticket #${ticketNumber} listo.`);
    return newTicket;
  };
  const addItemToTicket=(ticketId:string,itemData:Omit<TicketItem,'id'>)=>{
    const newItem:TicketItem={ ...itemData, id:`item-${Date.now()}-${Math.random().toString().slice(2,5)}` };
    setTicketsList(prev=> prev.map(ticket=>{ if(ticket.id!==ticketId) return ticket; const newItems=[...ticket.items,newItem]; const subtotal=newItems.reduce((s,it)=>s+it.total,0); const depositCredit=ticket.depositCredited||0; return {...ticket,items:newItems,subtotal,total:Math.max(0,subtotal-ticket.discountTotal-depositCredit)}; }));
    addToast('info','Consumo Agregado al Ticket',`+ ${newItem.name} agregado.`);
  };
  const removeItemFromTicket=(ticketId:string,itemId:string)=>{
    setTicketsList(prev=> prev.map(ticket=>{ if(ticket.id!==ticketId) return ticket; const newItems=ticket.items.filter(it=>it.id!==itemId); const subtotal=newItems.reduce((s,it)=>s+it.total,0); const depositCredit=ticket.depositCredited||0; return {...ticket,items:newItems,subtotal,total:Math.max(0,subtotal-ticket.discountTotal-depositCredit)}; }));
  };
  const checkoutTicket=(ticketId:string,paymentMethod:SaleTicket['paymentMethod']='TARJETA_CREDITO',tipAmount=0,cashGiven=0,pointsToRedeem=0)=>{
    const target=ticketsList.find(t=>t.id===ticketId); if(!target) return;
    const pointsDiscount=pointsToRedeem*1; const depositCredit=target.depositCredited||0;
    const totalToPay=Math.max(0,target.subtotal-target.discountTotal-pointsDiscount-depositCredit+tipAmount);
    const changeGiven=cashGiven>totalToPay?cashGiven-totalToPay:0;
    const updated:SaleTicket={ ...target, status:'PAID', paidAt:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), paymentMethod, tip:tipAmount, discountTotal:target.discountTotal+pointsDiscount, total:totalToPay, closedByStaffId:currentStaff.id, paymentDetails:{cashReceived:cashGiven,changeGiven,pointsRedeemed:pointsToRedeem,depositCredited:depositCredit} };
    setTicketsList(prev=> prev.map(t=> t.id===ticketId?updated:t));
    if(target.appointmentId) setAppointmentsList(prev=> prev.map(a=> a.id===target.appointmentId?{...a,status:'COMPLETED'}:a));
    const earnedPoints=Math.round(totalToPay*0.05);
    setClientsList(prev=> prev.map(cli=> cli.id!==target.clientId?cli:{...cli,totalSpent:(cli.totalSpent||0)+totalToPay,visitCount:(cli.visitCount||0)+1,loyaltyPoints:Math.max(0,(cli.loyaltyPoints||0)-pointsToRedeem+earnedPoints),stampCardCount:(cli.stampCardCount||0)+1}));
    target.items.forEach(item=>{ if(item.type==='PRODUCT') setInventoryList(prev=> prev.map(inv=> inv.id===item.itemId?{...inv,currentStock:Math.max(0,inv.currentStock-item.quantity)}:inv)); });
    try{ confetti({particleCount:55,spread:60,origin:{y:0.6}});}catch{}
    setLastCompletedReceipt(updated); setActiveCheckoutTicket(null);
    addToast('success','¡Cobro Exitoso!',`Ticket #${updated.ticketNumber} liquidado por $${totalToPay.toLocaleString()}. Puntos +${earnedPoints}.`);
  };
  const addSessionPackageToClient=(clientId:string,packageName:string,totalSessions:number,price:number)=>{
    const client=clientsList.find(c=>c.id===clientId); if(!client) return;
    const expiryDate=new Date(); expiryDate.setMonth(expiryDate.getMonth()+4);
    setClientsList(prev=> prev.map(cli=> cli.id!==clientId?cli:{...cli,activePackages:[...cli.activePackages,{packageName,totalSessions,usedSessions:0,expiryDate:expiryDate.toISOString().split('T')[0]}]}));
    const ticketNumber=`TKT-${new Date().getFullYear()}-${Math.floor(100+Math.random()*900)}`;
    const pkgTicket:SaleTicket={ id:`tkt-${Date.now()}`, ticketNumber, clientId, clientName:client.name, chairNumber:'Recepción POS', status:'PAID', createdAt:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), paidAt:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), items:[{id:`item-${Date.now()}`,type:'PACKAGE',itemId:`pkg-${Date.now()}`,name:`Paquete: ${packageName} (${totalSessions} sesiones)`,staffId:currentStaff.id,quantity:1,unitPrice:price,discount:0,total:price}], subtotal:price, discountTotal:0, tax:0, tip:0, total:price, paymentMethod:'TARJETA_CREDITO' };
    setTicketsList(prev=>[pkgTicket,...prev]);
    addToast('success','Paquete Vendido y Asignado',`${packageName} cargado a ${client.name}.`);
  };
  const addInventoryItem=(itemData:Omit<InventoryItem,'id'>)=>{ const newItem:InventoryItem={...itemData,id:`inv-${Date.now()}`}; setInventoryList(prev=>[newItem,...prev]); if(isSupabaseEnabled) sbInsert('inventory_items',{id:newItem.id, sku:newItem.sku, name:newItem.name, brand:newItem.brand, category:newItem.category, unit:newItem.unit, cost_price:newItem.costPrice, retail_price:newItem.retailPrice, is_retail:newItem.isRetail, location:newItem.location, min_stock:newItem.minStock, max_stock:newItem.maxStock, current_stock:newItem.currentStock}, tenantId); addToast('success','Insumo Registrado',`${newItem.name} guardado.`); };
  const updateStock=(itemId:string,newStock:number)=>{ setInventoryList(prev=> prev.map(item=> item.id===itemId?{...item,currentStock:Math.max(0,newStock)}:item)); addToast('info','Stock Actualizado','Existencias ajustadas.'); };
  const getProductBranchStock=(productId:string,branchId:string):number=>{
    const item=inventoryList.find(i=>i.id===productId); if(!item) return 0;
    if(item.branchStock && typeof item.branchStock[branchId]==='number') return item.branchStock[branchId];
    return branchId==='branch-1'?item.currentStock:0;
  };
  const transferProductBetweenBranches=async({sourceBranchId,destinationBranchId,productId,quantity,notes,authorizedBy}:{sourceBranchId:string;destinationBranchId:string;productId:string;quantity:number;notes?:string;authorizedBy?:string;}):Promise<boolean>=>{
    if (isExpired) { addToast('error','Licencia vencida','Renueva tu licencia para hacer traspasos.'); return false; }
    if(sourceBranchId===destinationBranchId){ addToast('error','Traspaso Inválido','Origen y destino no pueden ser la misma.'); return false; }
    if(quantity<=0){ addToast('error','Cantidad Inválida','Debe ser >0.'); return false; }
    const product=inventoryList.find(i=>i.id===productId); if(!product){ addToast('error','Producto No Encontrado','No existe.'); return false; }
    const sourceBranch=branches.find(b=>b.id===sourceBranchId)||{name:'Sucursal Origen'} as Branch;
    const destBranch=branches.find(b=>b.id===destinationBranchId)||{name:'Sucursal Destino'} as Branch;
    const currentSourceStock=getProductBranchStock(productId,sourceBranchId);
    if(currentSourceStock<quantity){ addToast('error','Stock Insuficiente en Origen',`En ${sourceBranch.name} solo hay ${currentSourceStock} ${product.unit}.`); return false; }
    // Si Supabase habilitado, intentar RPC transaccional
    if(isSupabaseEnabled && tenantId){
      const res = await sbRpcTransfer(tenantId, sourceBranchId, destinationBranchId, productId, quantity, authorizedBy||currentStaff.name, notes);
      if(res!==null){
        // Refetch inventario
        qc.invalidateQueries({queryKey:['inventory']});
        // Optimistic local update también
      }
    }
    setInventoryList(prev=> prev.map(item=>{
      if(item.id!==productId) return item;
      const existing=item.branchStock||{'branch-1':item.currentStock,'branch-2':0,'branch-3':0};
      const newSource=Math.max(0,(existing[sourceBranchId]??item.currentStock)-quantity);
      const newDest=(existing[destinationBranchId]??0)+quantity;
      const updated={...existing,[sourceBranchId]:newSource,[destinationBranchId]:newDest};
      const total=Object.values(updated).reduce<number>((a,c)=>a+(Number(c)||0),0);
      return {...item, branchStock:updated as any, currentStock:total};
    }));
    const newTransfer:BranchProductTransfer={ id:`trf-${Date.now()}`, transferCode:`TRF-2026-${Math.floor(100+Math.random()*900)}`, date:new Date().toLocaleDateString('es-MX',{year:'numeric',month:'2-digit',day:'2-digit'})+' '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), sourceBranchId, sourceBranchName:sourceBranch.name, destinationBranchId, destinationBranchName:destBranch.name, productId:product.id, productName:product.name, productSku:product.sku, quantity, unit:product.unit, authorizedBy:authorizedBy||currentStaff.name, notes:notes||'Traspaso reabastecimiento.', status:'COMPLETED' };
    setBranchTransfers(prev=>[newTransfer,...prev]);
    try{ confetti({particleCount:40,spread:50,origin:{y:0.7}});}catch{}
    addToast('success','¡Traspaso Completado!',`Se transfirieron ${quantity} ${product.unit} de "${product.name}" de ${sourceBranch.name} ➔ ${destBranch.name}.`);
    return true;
  };
  const recordServiceSupplyConsumption=(supplies:{supplyId:string;quantity:number}[])=>{
    setInventoryList(prev=> prev.map(item=>{ const consumed=supplies.find(s=>s.supplyId===item.id); if(!consumed) return item; return {...item,currentStock:Math.max(0,item.currentStock-consumed.quantity)}; }));
    addToast('info','Consumo Interno Descontado','Insumos rebajados.');
  };
  const addTechnicalFormula=(formulaData:Omit<TechnicalFormula,'id'>)=>{
    const newFormula:TechnicalFormula={...formulaData,id:`form-${Date.now()}`};
    setFormulasList(prev=>[newFormula,...prev]);
    if(isSupabaseEnabled) sbInsert('technical_formulas',{id:newFormula.id, client_id:newFormula.clientId, client_name:newFormula.clientName, staff_id:newFormula.staffId, staff_name:newFormula.staffName, service_type:newFormula.serviceType, base_natural:newFormula.baseNatural, porosity:newFormula.porosity, formula_details:newFormula.formulaDetails, exposure_time_minutes:newFormula.exposureTimeMinutes, notes:newFormula.notes}, tenantId);
    addToast('success','Fórmula Técnica Guardada',`Receta archivada para ${formulaData.clientName}.`);
  };
  const addClient=(clientData:Omit<ClientProfile,'id'|'totalSpent'|'visitCount'|'loyaltyPoints'|'stampCardCount'|'activePackages'|'joinedDate'>)=>{
    if (limits.maxClients !== null && clientsList.length >= limits.maxClients) {
      addToast('error','Límite del plan alcanzado',`Plan Starter limitado a ${limits.maxClients} clientes. Actualiza a Pro para clientes ilimitados.`);
      return;
    }
    if (isExpired) { addToast('error','Licencia vencida','Renueva tu licencia para registrar clientes.'); return; }
    const newClient:ClientProfile={...clientData,id:`cli-${Date.now()}`,joinedDate:new Date().toISOString().split('T')[0],totalSpent:0,visitCount:0,loyaltyPoints:50,stampCardCount:0,activePackages:[]};
    setClientsList(prev=>[newClient,...prev]);
    if(isSupabaseEnabled) sbInsert('clients',{id:newClient.id, name:newClient.name, phone:newClient.phone, email:newClient.email, avatar:newClient.avatar, loyalty_points:50}, tenantId);
    addToast('success','Cliente Registrado',`${newClient.name} añadido con 50 puntos.`);
  };
  const addStampToClient=(clientId:string)=>{ setClientsList(prev=> prev.map(cli=> cli.id!==clientId?cli:{...cli,stampCardCount: (cli.stampCardCount||0)>=6?1:(cli.stampCardCount||0)+1})); addToast('success','Sello Virtual Añadido','¡Sello marcado!'); };
  const redeemStampCardReward=(clientId:string)=>{ setClientsList(prev=> prev.map(cli=> cli.id!==clientId?cli:{...cli,stampCardCount:0})); addToast('success','¡Premio Entregado!','Tarjeta 6 sellos canjeada.'); };
  const usePackageSession=(clientId:string,packageIndex:number)=>{ setClientsList(prev=> prev.map(cli=>{ if(cli.id!==clientId) return cli; const pkgs=[...cli.activePackages]; if(pkgs[packageIndex] && pkgs[packageIndex].usedSessions < pkgs[packageIndex].totalSessions) pkgs[packageIndex]={...pkgs[packageIndex],usedSessions:pkgs[packageIndex].usedSessions+1}; return {...cli,activePackages:pkgs}; })); addToast('info','Sesión Descontada','1 sesión consumida.'); };
  const addExpense=(expenseData:Omit<ExpenseRecord,'id'>)=>{ const newExp:ExpenseRecord={...expenseData,id:`exp-${Date.now()}`}; setExpensesList(prev=>[newExp,...prev]); if(isSupabaseEnabled) sbInsert('expenses',{id:newExp.id, date:newExp.date, concept:newExp.concept, category:newExp.category, amount:newExp.amount, payment_method:newExp.paymentMethod, receipt_number:newExp.receiptNumber, registered_by:newExp.registeredBy}, tenantId); addToast('warning','Gasto Registrado',`${newExp.concept}: -$${newExp.amount.toLocaleString()}`); };
  const resetToDemoData=()=>{
    if(window.confirm('¿Restaurar datos de demostración? Se restablecerán a estado inicial (local + Supabase si está conectado).')){
      setStaffList(INITIAL_STAFF); setCurrentStaff(INITIAL_STAFF[0]); setInventoryList(INITIAL_INVENTORY); setClientsList(INITIAL_CLIENTS); setFormulasList(INITIAL_FORMULAS); setAppointmentsList(INITIAL_APPOINTMENTS); setTicketsList(INITIAL_TICKETS); setExpensesList(INITIAL_EXPENSES); setWaitlistEntries(INITIAL_WAITLIST); setBranches([{ id:'branch-1', name:'GestiBella Polanco (Principal)', code:'POL-01', address:'Av. Presidente Masaryk 360, Polanco, CDMX', phone:'+52 55 5540 8890', managerName:'Valentina Vega', activeStaffCount:6, todaySales:14920, monthlyRevenue:384000, status:'ACTIVE', colorTag:'#BE5A38' },{ id:'branch-2', name:'GestiBella Roma Norte', code:'ROM-02', address:'Álvaro Obregón 130, Roma Nte., CDMX', phone:'+52 55 5264 1190', managerName:'Mariana Silva', activeStaffCount:4, todaySales:9850, monthlyRevenue:245000, status:'ACTIVE', colorTag:'#2D2A26' },{ id:'branch-3', name:'GestiBella Satélite', code:'SAT-03', address:'Blvd. Manuel Ávila Camacho 2200, Naucalpan', phone:'+52 55 5373 4410', managerName:'Carlos Mendieta', activeStaffCount:5, todaySales:11200, monthlyRevenue:310000, status:'ACTIVE', colorTag:'#D97706' }]); setBranchTransfers(INITIAL_BRANCH_TRANSFERS);
      addToast('success','Datos Restaurados','Sistema reiniciado con demo. Si Supabase está conectado, ejecuta seed.sql para resetear DB también.');
    }
  };

  return (
    <SalonContext.Provider value={{
      isPortalOpen,setIsPortalOpen,publicSection,setPublicSection,portalModule,setPortalModule,isLoginModalOpen,setIsLoginModalOpen,isSwitchProfileModalOpen,setIsSwitchProfileModalOpen,
      currentStaff,setCurrentStaff,loginAs,logout,addStaffMember,updateStaffMember,deleteStaffMember,
      staffList,servicesList,inventoryList,clientsList,formulasList,appointmentsList,ticketsList,expensesList,waitlistEntries,upsellItemsList,antiNoShowSettings,receiptConfig,updateReceiptConfig,
      activeSessions,revokeSession,terminateOtherSessions,branches,selectedBranchId,setSelectedBranchId,branchTransfers,transferProductBetweenBranches,getProductBranchStock,
      activeCheckoutTicket,setActiveCheckoutTicket,lastCompletedReceipt,setLastCompletedReceipt,selectedFormulaClient,setSelectedFormulaClient,
      addAppointment,updateAppointmentStatus,convertAppointmentToOpenTicket,sendAppointmentReminder,recordAppointmentDeposit,toggleAppointmentUpsell,
      addToWaitlist,cancelAppointmentAndTriggerWaitlist,notifyWaitlistClient,bookWaitlistToAppointment,removeWaitlistEntry,updateAntiNoShowSettings,
      createOpenTicket,addItemToTicket,removeItemFromTicket,checkoutTicket,addSessionPackageToClient,
      addInventoryItem,updateStock,recordServiceSupplyConsumption,addTechnicalFormula,addClient,addStampToClient,redeemStampCardReward,usePackageSession,addExpense,
      toasts,addToast,removeToast,resetToDemoData,
      isSupabaseEnabled, isTenantLoading
    } as any}>
      {children}
    </SalonContext.Provider>
  );
};
export const useSalon = () => {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error('useSalon must be used within SalonProvider');
  return ctx;
};
