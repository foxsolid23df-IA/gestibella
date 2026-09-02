import {
  StaffMember,
  SalonService,
  InventoryItem,
  TechnicalFormula,
  ClientProfile,
  SaleTicket,
  ExpenseRecord,
  SoftwarePlan,
  BlogPost,
  Testimonial,
  Appointment,
  WaitlistEntry,
  UpsellItem,
  AntiNoShowSettings,
  BranchProductTransfer
} from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Valentina Rossi',
    role: 'ADMIN',
    roleTitle: 'Directora & Master Colorista',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    email: 'valentina@gestibella.com',
    phone: '+52 55 4123 9901',
    serviceCommissionRate: 0.50,
    productCommissionRate: 0.15,
    specialties: ['Balayage & Color', 'Diseño de Corte', 'Tratamientos Capilares'],
    colorTag: '#E07A5F',
    isActive: true
  },
  {
    id: 'staff-2',
    name: 'Sebastián Méndez',
    role: 'STYLIST',
    roleTitle: 'Estilista Senior & Barbero VIP',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    email: 'sebastian@gestibella.com',
    phone: '+52 55 4123 9902',
    serviceCommissionRate: 0.45,
    productCommissionRate: 0.12,
    specialties: ['Cortes de Precisión', 'Keratinas & Alisados', 'Styling Editorial'],
    colorTag: '#3D5A80',
    isActive: true
  },
  {
    id: 'staff-3',
    name: 'Camila Morales',
    role: 'STYLIST',
    roleTitle: 'Especialista en Uñas & Manicura Rusa',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    email: 'camila@gestibella.com',
    phone: '+52 55 4123 9903',
    serviceCommissionRate: 0.40,
    productCommissionRate: 0.10,
    specialties: ['Nail Art Estructurado', 'Pedicura Spa', 'Soft Gel'],
    colorTag: '#BE5A38',
    isActive: true
  },
  {
    id: 'staff-4',
    name: 'Dr. Julián Rivas',
    role: 'STYLIST',
    roleTitle: 'Cosmiatra & Terapeuta Spa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    email: 'julian@gestibella.com',
    phone: '+52 55 4123 9904',
    serviceCommissionRate: 0.45,
    productCommissionRate: 0.15,
    specialties: ['Masajes Holísticos', 'Hidrafaciales', 'Drenaje Linfático'],
    colorTag: '#2A9D8F',
    isActive: true
  },
  {
    id: 'staff-5',
    name: 'Andrea Fuentes',
    role: 'RECEPTIONIST',
    roleTitle: 'Coordinadora de Experiencia & Caja',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    email: 'recepcion@gestibella.com',
    phone: '+52 55 4123 9905',
    serviceCommissionRate: 0.05,
    productCommissionRate: 0.08,
    specialties: ['Atención VIP', 'Control de Citas', 'Punto de Venta'],
    colorTag: '#8D5B4C',
    isActive: true
  }
];

export const INITIAL_SERVICES: SalonService[] = [
  {
    id: 'srv-1',
    name: 'Balayage Signature & Matiz Gloss',
    category: 'Colorimetría',
    durationMinutes: 180,
    price: 2400,
    cost: 450,
    requiredSupplies: [
      { supplyId: 'inv-1', quantity: 90, unit: 'g' },
      { supplyId: 'inv-3', quantity: 120, unit: 'ml' }
    ]
  },
  {
    id: 'srv-2',
    name: 'Corte de Autor & Styling Profesional',
    category: 'Cabello',
    durationMinutes: 60,
    price: 650,
    cost: 40,
    requiredSupplies: [
      { supplyId: 'inv-4', quantity: 15, unit: 'ml' }
    ]
  },
  {
    id: 'srv-3',
    name: 'Tratamiento Reconstructivo Keratina Botox',
    category: 'Cabello',
    durationMinutes: 120,
    price: 1850,
    cost: 280,
    requiredSupplies: [
      { supplyId: 'inv-5', quantity: 50, unit: 'ml' }
    ]
  },
  {
    id: 'srv-4',
    name: 'Manicura Spa Rusa + Esmaltado Semipermanente',
    category: 'Manicura & Pedicura',
    durationMinutes: 75,
    price: 520,
    cost: 65
  },
  {
    id: 'srv-5',
    name: 'Pedicura Jelly Spa Detox',
    category: 'Manicura & Pedicura',
    durationMinutes: 60,
    price: 680,
    cost: 85
  },
  {
    id: 'srv-6',
    name: 'Masaje Relajante Descontracturante (60 min)',
    category: 'Spa & Masajes',
    durationMinutes: 60,
    price: 950,
    cost: 110
  },
  {
    id: 'srv-7',
    name: 'Facial Profundo Hydrafacial Glow',
    category: 'Faciales',
    durationMinutes: 75,
    price: 1350,
    cost: 210
  },
  {
    id: 'srv-8',
    name: 'Lifting de Pestañas + Laminado de Cejas',
    category: 'Cejas & Pestañas',
    durationMinutes: 60,
    price: 780,
    cost: 95
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'TINT-7-1',
    name: 'Tinte Igora Royal 7-1 Rubio Ceniza',
    brand: 'Schwarzkopf Pro',
    category: 'Tintes',
    currentStock: 18,
    minStock: 6,
    maxStock: 25,
    unit: 'Tubos (60g)',
    costPrice: 145,
    isRetail: false,
    location: 'Estante Colorimetría A-2',
    branchStock: {
      'branch-1': 10,
      'branch-2': 5,
      'branch-3': 3
    }
  },
  {
    id: 'inv-2',
    sku: 'TINT-8-3',
    name: 'Tinte Majirel 8.3 Rubio Claro Dorado',
    brand: "L'Oréal Professionnel",
    category: 'Tintes',
    currentStock: 24,
    minStock: 5,
    maxStock: 20,
    unit: 'Tubos (50ml)',
    costPrice: 160,
    isRetail: false,
    location: 'Estante Colorimetría A-3',
    branchStock: {
      'branch-1': 14,
      'branch-2': 6,
      'branch-3': 4
    }
  },
  {
    id: 'inv-3',
    sku: 'OXI-20V',
    name: 'Peróxido Oxigenada 20 Volúmenes',
    brand: 'Wella Blondor',
    category: 'Químicos & Peróxidos',
    currentStock: 4500,
    minStock: 1000,
    maxStock: 5000,
    unit: 'ml',
    costPrice: 0.12,
    isRetail: false,
    location: 'Área Técnica Mezclas',
    branchStock: {
      'branch-1': 2800,
      'branch-2': 1100,
      'branch-3': 600
    }
  },
  {
    id: 'inv-4',
    sku: 'SHAMP-NO5',
    name: 'Olaplex No. 4 & No. 5 Bond Maintenance Kit',
    brand: 'Olaplex',
    category: 'Retail Venta',
    currentStock: 18,
    minStock: 3,
    maxStock: 15,
    unit: 'Unidades',
    costPrice: 580,
    retailPrice: 990,
    isRetail: true,
    location: 'Vitrinas de Exhibición Recepción',
    branchStock: {
      'branch-1': 9,
      'branch-2': 5,
      'branch-3': 4
    }
  },
  {
    id: 'inv-5',
    sku: 'MASK-K18',
    name: 'K18 Molecular Repair Hair Mask 50ml',
    brand: 'K18 Biomimetic',
    category: 'Retail Venta',
    currentStock: 9,
    minStock: 4,
    maxStock: 12,
    unit: 'Unidades',
    costPrice: 920,
    retailPrice: 1580,
    isRetail: true,
    location: 'Vitrinas de Exhibición Recepción',
    branchStock: {
      'branch-1': 4,
      'branch-2': 3,
      'branch-3': 2
    }
  },
  {
    id: 'inv-6',
    sku: 'KER-BTOX',
    name: 'Tratamiento Nanoplastia & Botox Capilar 1L',
    brand: 'Braé Divine',
    category: 'Tratamientos',
    currentStock: 1250,
    minStock: 300,
    maxStock: 2000,
    unit: 'ml',
    costPrice: 1.85,
    isRetail: false,
    location: 'Estante Tratamientos Cabina 1',
    branchStock: {
      'branch-1': 650,
      'branch-2': 400,
      'branch-3': 200
    }
  },
  {
    id: 'inv-7',
    sku: 'GEL-SEM-08',
    name: 'Gel Semipermanente Nude Velvet #24',
    brand: 'The GelBottle',
    category: 'Insumos Desechables',
    currentStock: 18,
    minStock: 3,
    maxStock: 10,
    unit: 'Frascos',
    costPrice: 210,
    isRetail: false,
    location: 'Mesa Manicura 1',
    branchStock: {
      'branch-1': 8,
      'branch-2': 6,
      'branch-3': 4
    }
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'cli-1',
    name: 'Mariana Garza Villarreal',
    phone: '+52 81 1845 9210',
    email: 'mariana.garza@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-03-12',
    totalSpent: 16400,
    visitCount: 7,
    loyaltyPoints: 340,
    stampCardCount: 5,
    preferredStaffId: 'staff-1',
    allergiesOrNotes: 'Sensibilidad a fragancias fuertes. Prefiere té verde matcha.',
    activePackages: [
      {
        packageName: 'Pack 4 Sesiones Matiz & Brillo',
        totalSessions: 4,
        usedSessions: 2,
        expiryDate: '2026-11-30'
      }
    ]
  },
  {
    id: 'cli-2',
    name: 'Lucía Fernández Ramos',
    phone: '+52 55 9382 1104',
    email: 'lucia.fernandez@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-08-19',
    totalSpent: 9200,
    visitCount: 4,
    loyaltyPoints: 180,
    stampCardCount: 3,
    preferredStaffId: 'staff-2',
    allergiesOrNotes: 'Cuero cabelludo seco. Usar champú sin sulfatos.',
    activePackages: []
  },
  {
    id: 'cli-3',
    name: 'Carolina Benítez',
    phone: '+52 55 8734 5519',
    email: 'caro.benitez@empresa.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-10',
    totalSpent: 4850,
    visitCount: 3,
    loyaltyPoints: 90,
    stampCardCount: 6, // Listo para premio!
    preferredStaffId: 'staff-3',
    allergiesOrNotes: 'Uñas quebradizas, aplicar base rubber.',
    activePackages: [
      {
        packageName: 'Paquete Manicura VIP Mensual',
        totalSessions: 3,
        usedSessions: 3,
        expiryDate: '2026-08-30'
      }
    ]
  },
  {
    id: 'cli-4',
    name: 'Sofía Álvarez de la Rosa',
    phone: '+52 55 2390 1928',
    email: 'sofia.alvarez@luxury.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-11-04',
    totalSpent: 28900,
    visitCount: 12,
    loyaltyPoints: 720,
    stampCardCount: 2,
    preferredStaffId: 'staff-4',
    allergiesOrNotes: 'Clienta VIP Platinum. Prefiere cabina privada y aromaterapia lavanda.',
    activePackages: [
      {
        packageName: 'Membresía Spa Serenidad (6 Masajes)',
        totalSessions: 6,
        usedSessions: 4,
        expiryDate: '2026-12-15'
      }
    ]
  }
];

export const INITIAL_FORMULAS: TechnicalFormula[] = [
  {
    id: 'form-1',
    clientId: 'cli-1',
    clientName: 'Mariana Garza Villarreal',
    date: '2026-07-15',
    staffId: 'staff-1',
    staffName: 'Valentina Rossi',
    serviceType: 'Balayage & Matiz Rubio Manteca',
    baseNatural: 'Castaño Claro 5.0 (Raíz 3cm)',
    porosity: 'Media',
    formulaDetails: 'Decoloración Wella Blondor + 20 Vol (1:2) con Olaplex No.1. Matiz en bacha: 45g Igora 9-1 + 15g 8-4 + Peróxido 6 Vol por 18 min.',
    exposureTimeMinutes: 45,
    treatmentUsed: 'Olaplex Paso 2 Reconstructor Bond Perfector',
    notes: 'Aclaró nivel 9 perfecto sin reflejos cobrizos. Recomendado volver a matizar en 6 semanas.'
  },
  {
    id: 'form-2',
    clientId: 'cli-2',
    clientName: 'Lucía Fernández Ramos',
    date: '2026-08-02',
    staffId: 'staff-2',
    staffName: 'Sebastián Méndez',
    serviceType: 'Color Global Avellana Cálido',
    baseNatural: 'Castaño Oscuro 4.0 con 30% canas',
    porosity: 'Alta',
    formulaDetails: 'Cobertura canas: 30g Majirel 6.0 + 30g Majirel 6.34 + 90ml Peróxido 20 Vol. Medios a puntas: 40g 7.35 + 10 Vol.',
    exposureTimeMinutes: 35,
    treatmentUsed: 'Mascarilla Ácida K18 Leave-In',
    notes: 'Cobertura de canas al 100%. Excelente brillo y sedosidad.'
  },
  {
    id: 'form-3',
    clientId: 'cli-4',
    clientName: 'Sofía Álvarez de la Rosa',
    date: '2026-08-18',
    staffId: 'staff-4',
    staffName: 'Dr. Julián Rivas',
    serviceType: 'Tratamiento Protocolo Facial Antiedad',
    baseNatural: 'Piel Mixta deshidratada',
    porosity: 'Baja',
    formulaDetails: 'Peeling Enzimático Papaya + Sérum Ácido Hialurónico 2% ultra bajo peso molecular + Máscara Led Roja 20 min.',
    exposureTimeMinutes: 60,
    treatmentUsed: 'Crema selladora con ceramidas y FPS 50+',
    notes: 'Piel sumamente luminosa. No presentó eritema. Próxima cita en 21 días.'
  }
];

export const INITIAL_ANTI_NOSHOW_SETTINGS: AntiNoShowSettings = {
  depositsEnabled: true,
  depositPercentage: 30,
  minimumServicePriceForDeposit: 1000,
  depositRequiredCategories: ['Colorimetría', 'Cabello', 'Faciales', 'Spa & Masajes'],
  icsCalendarAttachmentEnabled: true,
  reminderUpsellEnabled: true,
  automatedWaitlistTriggerEnabled: true,
  reminderNoticeHours: 24
};

export const INITIAL_UPSELL_ITEMS: UpsellItem[] = [
  {
    id: 'up-1',
    name: 'Hidratación Molecular Exprés Olaplex / K18',
    category: 'Cabello',
    price: 280,
    durationMinutes: 15,
    description: 'Tratamiento exprés de sellado de puntas y recuperación de enlaces durante el lavado.',
    recommendedForCategory: ['Cabello', 'Colorimetría'],
    popularPrompt: '¿Te gustaría añadir una Hidratación Molecular Exprés por solo $280 MXN extra a tu cita?'
  },
  {
    id: 'up-2',
    name: 'Ampolleta Reconstructora con Ácido Hialurónico',
    category: 'Cabello',
    price: 180,
    durationMinutes: 10,
    description: 'Nutrición intensiva con calor y masaje capilar estimulante de 10 minutos.',
    recommendedForCategory: ['Cabello', 'Colorimetría'],
    popularPrompt: '¿Añadimos una ampolleta de brillo diamante y nutrición profunda por solo $180 MXN?'
  },
  {
    id: 'up-3',
    name: 'Exfoliación & Mascarilla de Manos de Seda',
    category: 'Manicura & Pedicura',
    price: 150,
    durationMinutes: 10,
    description: 'Exfoliación con sales del mar muerto y baño de parafina tibia para manos resecas.',
    recommendedForCategory: ['Manicura & Pedicura'],
    popularPrompt: '¿Te gustaría incluir una exfoliación de parafina tibia de manos por $150 MXN adicionales?'
  },
  {
    id: 'up-4',
    name: 'Masaje Cervical Anti-Estrés con Aromaterapia',
    category: 'Spa & Masajes',
    price: 220,
    durationMinutes: 15,
    description: '15 minutos extras de enfoque profundo en cuello, trapecios y sienes con aceites esenciales.',
    recommendedForCategory: ['Spa & Masajes', 'Faciales', 'Cabello'],
    popularPrompt: '¿Quieres sumar 15 minutos de masaje cervical relajante anti-estrés por $220 MXN?'
  },
  {
    id: 'up-5',
    name: 'Laminado y Diseño de Cejas con Henna Orgánica',
    category: 'Cejas & Pestañas',
    price: 320,
    durationMinutes: 20,
    description: 'Definición botánica de cejas mientras actúa tu tratamiento capilar.',
    recommendedForCategory: ['Cabello', 'Faciales', 'Cejas & Pestañas'],
    popularPrompt: '¿Aprovechas tu tiempo en cabina para un perfilado orgánico de cejas por $320 MXN?'
  }
];

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wl-1',
    clientName: 'Alejandra Morales Solís',
    clientPhone: '+52 55 7712 4499',
    clientId: 'cli-6',
    serviceId: 'srv-1',
    serviceName: 'Balayage Signature & Matiz Gloss',
    preferredStaffId: 'staff-1',
    preferredDate: '2026-08-25',
    preferredTimeRange: 'Mañana (10:00 - 14:00)',
    status: 'WAITING',
    notes: 'Urge para evento el fin de semana. Si se cancela Balayage con Valentina, avisar inmediatamente.',
    createdAt: '2026-08-23 16:40'
  },
  {
    id: 'wl-2',
    clientName: 'Daniela Zavala Ortiz',
    clientPhone: '+52 81 9923 1180',
    serviceId: 'srv-3',
    serviceName: 'Tratamiento Reconstructivo Keratina Botox',
    preferredStaffId: 'ANY',
    preferredDate: '2026-08-25',
    preferredTimeRange: 'Cualquier horario',
    status: 'WAITING',
    notes: 'Disponible cualquier horario de la tarde con cualquier especialista.',
    createdAt: '2026-08-24 09:15'
  },
  {
    id: 'wl-3',
    clientName: 'Constanza Ríos',
    clientPhone: '+52 55 6601 2284',
    serviceId: 'srv-2',
    serviceName: 'Corte de Autor & Styling Profesional',
    preferredStaffId: 'staff-2',
    preferredDate: '2026-08-24',
    preferredTimeRange: 'Tarde (15:00 - 18:00)',
    status: 'NOTIFIED',
    notes: 'Avisada por WhatsApp de espacio liberado.',
    createdAt: '2026-08-22 18:20',
    lastNotifiedAt: '2026-08-24 11:00',
    notificationHistory: [
      {
        date: '2026-08-24 11:00',
        message: '¡Hola Constanza! Se liberó un espacio hoy a las 15:30 para Corte con Matteo. ¿Deseas tomarlo?',
        slotFreedInfo: '2026-08-24 15:30 con Matteo'
      }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    clientName: 'Mariana Garza Villarreal',
    clientPhone: '+52 81 1845 9210',
    clientId: 'cli-1',
    staffId: 'staff-1',
    serviceId: 'srv-1',
    serviceName: 'Balayage Signature & Matiz Gloss',
    date: '2026-08-24',
    time: '10:00',
    durationMinutes: 180,
    price: 2400,
    status: 'IN_CHAIR',
    notes: 'Retoque de raíz y matizado gloss',
    ticketId: 'tkt-101',
    notificationSent: true,
    depositRequired: true,
    depositAmount: 720,
    depositPaid: true,
    depositPaidAt: '2026-08-22 14:30',
    depositPaymentMethod: 'TRANSFERENCIA',
    suggestedUpsellId: 'up-1',
    upsellAccepted: true,
    upsellItemName: 'Hidratación Molecular Exprés Olaplex / K18',
    upsellItemPrice: 280
  },
  {
    id: 'apt-2',
    clientName: 'Lucía Fernández Ramos',
    clientPhone: '+52 55 9382 1104',
    clientId: 'cli-2',
    staffId: 'staff-2',
    serviceId: 'srv-2',
    serviceName: 'Corte de Autor & Styling Profesional',
    date: '2026-08-24',
    time: '12:30',
    durationMinutes: 60,
    price: 650,
    status: 'IN_CHAIR',
    notes: 'Bob desestructurado',
    ticketId: 'tkt-102',
    notificationSent: true,
    depositRequired: false,
    suggestedUpsellId: 'up-2',
    upsellAccepted: false
  },
  {
    id: 'apt-3',
    clientName: 'Carolina Benítez',
    clientPhone: '+52 55 8734 5519',
    clientId: 'cli-3',
    staffId: 'staff-3',
    serviceId: 'srv-4',
    serviceName: 'Manicura Spa Rusa + Esmaltado Semipermanente',
    date: '2026-08-24',
    time: '14:00',
    durationMinutes: 75,
    price: 520,
    status: 'CONFIRMED',
    notes: 'Quiere diseño french cromado',
    notificationSent: true,
    suggestedUpsellId: 'up-3',
    upsellAccepted: true,
    upsellItemName: 'Exfoliación & Mascarilla de Manos de Seda',
    upsellItemPrice: 150
  },
  {
    id: 'apt-4',
    clientName: 'Sofía Álvarez de la Rosa',
    clientPhone: '+52 55 2390 1928',
    clientId: 'cli-4',
    staffId: 'staff-4',
    serviceId: 'srv-6',
    serviceName: 'Masaje Relajante Descontracturante (60 min)',
    date: '2026-08-24',
    time: '16:00',
    durationMinutes: 60,
    price: 950,
    status: 'CONFIRMED',
    notes: 'Cabina VIP con aromaterapia lavanda',
    notificationSent: false,
    depositRequired: false
  },
  {
    id: 'apt-5',
    clientName: 'Elena Domínguez',
    clientPhone: '+52 55 4411 8890',
    clientId: 'cli-5',
    staffId: 'staff-1',
    serviceId: 'srv-3',
    serviceName: 'Tratamiento Reconstructivo Keratina Botox',
    date: '2026-08-25',
    time: '11:00',
    durationMinutes: 120,
    price: 1850,
    status: 'CONFIRMED',
    notes: 'Primera visita, cabello procesado',
    notificationSent: true,
    depositRequired: true,
    depositAmount: 555,
    depositPaid: true,
    depositPaidAt: '2026-08-23 18:10',
    depositPaymentMethod: 'TARJETA_CREDITO',
    suggestedUpsellId: 'up-1'
  },
  {
    id: 'apt-6',
    clientName: 'Patricia Cárdenas',
    clientPhone: '+52 55 1928 3746',
    clientId: 'cli-6',
    staffId: 'staff-2',
    serviceId: 'srv-2',
    serviceName: 'Corte de Autor & Styling Profesional',
    date: '2026-08-25',
    time: '15:30',
    durationMinutes: 60,
    price: 650,
    status: 'CONFIRMED',
    notes: '',
    notificationSent: false,
    depositRequired: false
  }
];

export const INITIAL_TICKETS: SaleTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'TKT-2026-089',
    clientId: 'cli-1',
    clientName: 'Mariana Garza Villarreal',
    chairNumber: 'Sillón Colorimetría #1',
    status: 'HOLD', // En espera / Cuenta Abierta durante el servicio!
    createdAt: '2026-08-24 10:15',
    items: [
      {
        id: 'item-1',
        type: 'SERVICE',
        itemId: 'srv-1',
        name: 'Balayage Signature & Matiz Gloss',
        staffId: 'staff-1',
        quantity: 1,
        unitPrice: 2400,
        discount: 0,
        total: 2400
      },
      {
        id: 'item-2',
        type: 'PRODUCT',
        itemId: 'inv-4',
        name: 'Olaplex No. 4 & No. 5 Bond Maintenance Kit (Retail)',
        staffId: 'staff-1',
        quantity: 1,
        unitPrice: 990,
        discount: 0,
        total: 990
      }
    ],
    subtotal: 3390,
    discountTotal: 0,
    tax: 0,
    tip: 0,
    total: 3390,
    appointmentId: 'apt-1'
  },
  {
    id: 'tkt-102',
    ticketNumber: 'TKT-2026-090',
    clientId: 'cli-2',
    clientName: 'Lucía Fernández Ramos',
    chairNumber: 'Sillón Styling #2',
    status: 'HOLD', // En espera
    createdAt: '2026-08-24 12:35',
    items: [
      {
        id: 'item-3',
        type: 'SERVICE',
        itemId: 'srv-2',
        name: 'Corte de Autor & Styling Profesional',
        staffId: 'staff-2',
        quantity: 1,
        unitPrice: 650,
        discount: 0,
        total: 650
      },
      {
        id: 'item-4',
        type: 'SERVICE',
        itemId: 'srv-8',
        name: 'Lifting de Pestañas (Agregado en cabina)',
        staffId: 'staff-3',
        quantity: 1,
        unitPrice: 780,
        discount: 0,
        total: 780
      }
    ],
    subtotal: 1430,
    discountTotal: 0,
    tax: 0,
    tip: 0,
    total: 1430,
    appointmentId: 'apt-2'
  },
  {
    id: 'tkt-100',
    ticketNumber: 'TKT-2026-088',
    clientId: 'cli-3',
    clientName: 'Carolina Benítez',
    chairNumber: 'Mesa Manicura #1',
    status: 'PAID',
    createdAt: '2026-08-24 09:00',
    paidAt: '2026-08-24 10:10',
    closedByStaffId: 'staff-5',
    items: [
      {
        id: 'item-5',
        type: 'SERVICE',
        itemId: 'srv-4',
        name: 'Manicura Spa Rusa + Esmaltado Semipermanente',
        staffId: 'staff-3',
        quantity: 1,
        unitPrice: 520,
        discount: 0,
        total: 520
      },
      {
        id: 'item-6',
        type: 'PRODUCT',
        itemId: 'inv-5',
        name: 'K18 Molecular Repair Hair Mask (Retail)',
        staffId: 'staff-3',
        quantity: 1,
        unitPrice: 1580,
        discount: 100,
        total: 1480
      }
    ],
    subtotal: 2100,
    discountTotal: 100,
    tax: 0,
    tip: 150,
    total: 2150,
    paymentMethod: 'TARJETA_CREDITO',
    paymentDetails: {
      cashReceived: 0,
      changeGiven: 0
    }
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    date: '2026-08-20',
    concept: 'Reabastecimiento Tintes Schwarzkopf & Peróxidos',
    category: 'Insumos y Productos',
    amount: 5400,
    paymentMethod: 'Transferencia Bancaria',
    receiptNumber: 'FAC-PROV-9921',
    registeredBy: 'Valentina Rossi'
  },
  {
    id: 'exp-2',
    date: '2026-08-01',
    concept: 'Renta Mensual Local Comercial Polanco',
    category: 'Alquiler y Local',
    amount: 22000,
    paymentMethod: 'Transferencia Bancaria',
    receiptNumber: 'REC-ARR-08-26',
    registeredBy: 'Valentina Rossi'
  },
  {
    id: 'exp-3',
    date: '2026-08-15',
    concept: 'Pago Servicio Energía Eléctrica CFE',
    category: 'Servicios Básicos',
    amount: 3850,
    paymentMethod: 'Tarjeta Corporativa',
    receiptNumber: 'CFE-883921',
    registeredBy: 'Andrea Fuentes'
  },
  {
    id: 'exp-4',
    date: '2026-08-10',
    concept: 'Campaña Anuncios Meta / Instagram Ads Salón',
    category: 'Marketing y Publicidad',
    amount: 4200,
    paymentMethod: 'Tarjeta Corporativa',
    receiptNumber: 'FB-ADS-7718',
    registeredBy: 'Valentina Rossi'
  },
  {
    id: 'exp-5',
    date: '2026-08-12',
    concept: 'Mantenimiento Sillones Hidráulicos y Lavacabezas',
    category: 'Mantenimiento',
    amount: 1800,
    paymentMethod: 'Efectivo',
    receiptNumber: 'SERV-MANT-102',
    registeredBy: 'Andrea Fuentes'
  }
];

export const SOFTWARE_PLANS: SoftwarePlan[] = [
  {
    id: 'plan-starter',
    name: 'Plan Studio Inicial',
    tagline: 'Ideal para salones boutique, barberías y estilistas independientes que buscan orden.',
    priceMonthly: 590,
    priceAnnualMonthly: 470, // Pago anual con 20% dcto
    maxStaff: 'Hasta 3 profesionales',
    supportLevel: 'Soporte vía WhatsApp y Chat',
    features: [
      'Agenda interactiva diaria y semanal',
      'Punto de venta (POS) y emisión de tickets',
      'Control de hasta 150 clientes con historial',
      'Control de inventario básico con alertas',
      'Cálculo de comisiones básico',
      'Recordatorios automáticos de citas',
      'Acceso móvil y web simultáneo'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Plan Salón Pro',
    tagline: 'El más elegido por salones de alto flujo, spas consolidados y centros de estética.',
    priceMonthly: 1190,
    priceAnnualMonthly: 950,
    isPopular: true,
    maxStaff: 'Hasta 10 profesionales',
    supportLevel: 'Soporte Prioritario VIP 24/7',
    features: [
      'Todo lo del Plan Studio Inicial +',
      'Función avanzada de "Ticket en Espera" (cuentas abiertas)',
      'Bitácora técnica de Fórmulas de Colorimetría por cliente',
      'Descuento automático de inventario por consumo interno',
      'Motor CRM: Puntos de lealtad y Tarjetas de sellos virtuales',
      'Venta y control de Paquetes de múltiples sesiones',
      'Calculadora de comisiones diferenciadas (servicios vs productos)',
      'Control de gastos y arqueo de caja multi-cajero',
      'Reportes gerenciales y proyecciones de ingresos futuros'
    ]
  },
  {
    id: 'plan-elite',
    name: 'Plan Cadena & Spa Élite',
    tagline: 'Diseñado para franquicias, cadenas de salones y spas médicos de gran escala.',
    priceMonthly: 2190,
    priceAnnualMonthly: 1750,
    maxStaff: 'Profesionales y sucursales Ilimitadas',
    supportLevel: 'Gerente de cuenta dedicado + Onboarding presencial/remoto',
    features: [
      'Todo lo del Plan Salón Pro +',
      'Gestión multi-sucursal centralizada',
      'Fórmulas técnicas compartidas entre sucursales',
      'Roles y permisos granulares personalizados',
      'API REST abierta para integraciones con ERP contable',
      'Dashboard corporativo con métricas consolidadas',
      'Migración de datos de tu sistema anterior sin costo',
      'Garantía de SLA 99.9% y respaldos automáticos por hora'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Valeria Cárdenas',
    businessName: 'Lumière Haute Coiffure',
    businessType: 'Salón de Alta Peluquería',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    location: 'Ciudad de México',
    stars: 5,
    quote: 'El "Ticket en Espera" y la bitácora de fórmulas cambiaron nuestro negocio. Antes las estilistas perdían notas de color o se olvidaban de cobrar el tratamiento añadido en el lavacabezas. Con GestiBella aumentamos el ticket promedio un 28% en el primer mes.',
    metricHighlight: '+28% Ticket Promedio'
  },
  {
    id: 'test-2',
    name: 'Rodrigo Santoro',
    businessName: 'The Barber & Spa Club',
    businessType: 'Cadena de Salones',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'Guadalajara, Jalisco',
    stars: 5,
    quote: 'Calcular las comisiones de 14 barberos y terapeutas nos tomaba todo el fin de semana. Ahora se genera en 2 segundos exactos, desglosando productos y servicios. La transparencia con el equipo es total y ya no hay discusiones de nómina.',
    metricHighlight: 'Cálculo de Comisiones en 2 seg'
  },
  {
    id: 'test-3',
    name: 'Mariela Dupont',
    businessName: 'Sensoria Wellness & Spa',
    businessType: 'Spa & Centro Estético',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    location: 'Monterrey, N.L.',
    stars: 5,
    quote: 'La tarjeta de sellos virtual y el control de paquetes han logrado que nuestras clientas vuelvan cada 18 días en lugar de cada 40. Además, el consumo interno nos alertó que estábamos gastando 30% más de producto en tintes del presupuestado.',
    metricHighlight: '45% Mayor Retención'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Cómo calcular el gramaje de colorimetría y evitar el 25% de mermas en tu salón',
    slug: 'calcular-gramaje-colorimetria-evitar-mermas',
    summary: 'Aprende a registrar fórmulas técnicas exactas por cliente y descontar mililitros de peróxido y tubos de tinte para maximizar tu margen.',
    content: `El desperdicio en el área de mezclas es la fuga de dinero silenciosa más grande de los salones de belleza. 
    
    Cuando un estilista prepara "al ojo" 80 gramos de producto para un retoque de raíz que solo necesitaba 45 gramos, ese excedente termina en el lavabo. Al mes, un salón con 4 coloristas tira a la basura el equivalente a 15-25 tubos de tinte de alta gama.
    
    1. Implementa básculas digitales en el área técnica.
    2. Guarda la fórmula técnica en la ficha digital del cliente (base natural, gramos exactos, volúmenes de oxidante y tiempo de pose).
    3. Utiliza la función de consumo interno automático de GestiBella para conciliar compras con aplicaciones reales.`,
    category: 'Operaciones & Fórmulas',
    readTime: '4 min de lectura',
    author: 'Valentina Rossi',
    authorRole: 'Master Colorista & Directora Técnica',
    date: '18 Agosto 2026',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'post-2',
    title: 'Ticket en Espera: La estrategia para elevar las ventas cruzadas durante la cita',
    slug: 'ticket-en-espera-estrategia-ventas-cruzadas',
    summary: 'Por qué no debes cerrar la cuenta al agendar: permite a tu equipo sumar tratamientos en el lavacabezas o productos de retail antes del cobro final.',
    content: `El comportamiento de compra en el salón ocurre durante la experiencia, no al inicio.
    
    Cuando una clienta llega a su cita de corte, su disposición es de un ticket de $600. Pero cuando el estilista le muestra el daño en puntas y le ofrece un tratamiento reconstructivo express de $450 en el lavacabezas, la respuesta suele ser afirmativa en más del 60% de los casos si el proceso de cobro es fluido.
    
    Tener una 'cuenta abierta' o ticket en espera permite que cualquier miembro del staff agregue insumos, servicios adicionales o retail sin fricción, centralizando todo en un único cobro al momento de despedir al cliente.`,
    category: 'Finanzas de Salón',
    readTime: '5 min de lectura',
    author: 'Sebastián Méndez',
    authorRole: 'Consultor de Negocios de Belleza',
    date: '12 Agosto 2026',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'post-3',
    title: 'Tarjetas de sellos virtuales vs Descuentos agresivos: ¿Cuál fideliza mejor?',
    slug: 'tarjetas-sellos-virtuales-vs-descuentos',
    summary: 'Descubre por qué regalar sesiones de bajo costo tras acumular visitas protege el valor de tu marca mucho mejor que aplicar descuentos del 20%.',
    content: `Los descuentos directos acostumbran a tu clientela a esperar promociones y devalúan la percepción de lujo de tu servicio.
    
    En cambio, los programas de lealtad basados en metas alcanzables (ejemplo: 'Tu 6ta visita incluye una hidratación capilar de cortesía') activan el principio de recompensa progresiva. El cliente siente que está 'construyendo' un beneficio con cada cita y prefiere volver a tu salón antes que experimentar con la competencia.`,
    category: 'Fidelización',
    readTime: '3 min de lectura',
    author: 'Camila Morales',
    authorRole: 'Especialista en Fidelización y CRM',
    date: '05 Agosto 2026',
    imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BRANCH_TRANSFERS: BranchProductTransfer[] = [
  {
    id: 'trf-1',
    transferCode: 'TRF-2026-081',
    date: '2026-08-25 16:30',
    sourceBranchId: 'branch-1',
    sourceBranchName: 'GestiBella Polanco (Principal)',
    destinationBranchId: 'branch-2',
    destinationBranchName: 'GestiBella Roma Norte',
    productId: 'inv-1',
    productName: 'Tinte Igora Royal 7-1 Rubio Ceniza',
    productSku: 'TINT-7-1',
    quantity: 4,
    unit: 'Tubos (60g)',
    authorizedBy: 'Valentina Vega (Admin)',
    notes: 'Reabastecimiento urgente por alta demanda en colorimetría de fin de semana.',
    status: 'COMPLETED'
  },
  {
    id: 'trf-2',
    transferCode: 'TRF-2026-082',
    date: '2026-08-26 09:15',
    sourceBranchId: 'branch-1',
    sourceBranchName: 'GestiBella Polanco (Principal)',
    destinationBranchId: 'branch-3',
    destinationBranchName: 'GestiBella Satélite',
    productId: 'inv-4',
    productName: 'Olaplex No. 4 & No. 5 Bond Maintenance Kit',
    productSku: 'SHAMP-NO5',
    quantity: 3,
    unit: 'Unidades',
    authorizedBy: 'Valentina Vega (Admin)',
    notes: 'Traspaso de stock de vitrina para venta directa.',
    status: 'COMPLETED'
  }
];

export const ARCHITECTURE_BLUEPRINT = {
  overview: {
    title: 'Arquitectura Integral de Software para GestiBella (SaaS Multi-Tenant)',
    description: 'Diseño de sistema cliente-servidor optimizado para operaciones en tiempo real, offline-resilience en caja, sincronización de agenda y alta seguridad de datos técnicos de salón de belleza y spa.',
    techStack: {
      frontend: 'React 19, TypeScript, Tailwind CSS, Motion, WebSockets para sync de agenda en tiempo real, Service Worker para resiliencia en POS.',
      backend: 'Node.js / Express / NestJS modular con TypeScript, Prisma ORM, Redis para caching de disponibilidad de sillones y sessions.',
      database: 'PostgreSQL Relacional (Multi-Tenant con aislamiento por tenant_id y particionamiento por sucursal).',
      infra: 'Cloud Run / Kubernetes Docker Containers con balanceador de carga y CDN para assets.'
    }
  },
  databaseSchema: [
    {
      table: 'tenants (Negocios / Salones)',
      fields: ['id UUID (PK)', 'business_name VARCHAR(150)', 'slug VARCHAR(50) UNIQUE', 'tax_id VARCHAR(50)', 'plan_tier ENUM', 'currency VARCHAR(5)', 'timezone VARCHAR(50)', 'created_at TIMESTAMP']
    },
    {
      table: 'users / staff (Personal del Salón)',
      fields: ['id UUID (PK)', 'tenant_id UUID (FK)', 'name VARCHAR(100)', 'email VARCHAR(100)', 'password_hash VARCHAR(255)', 'role ENUM(ADMIN, MANAGER, STYLIST, RECEPTIONIST)', 'service_commission_rate DECIMAL(5,2)', 'product_commission_rate DECIMAL(5,2)', 'color_tag VARCHAR(10)', 'is_active BOOLEAN']
    },
    {
      table: 'clients (Ficha Unificada de Clientes)',
      fields: ['id UUID (PK)', 'tenant_id UUID (FK)', 'name VARCHAR(100)', 'phone VARCHAR(25)', 'email VARCHAR(100)', 'loyalty_points INT DEFAULT 0', 'stamp_card_count INT DEFAULT 0', 'allergies_notes TEXT', 'total_spent DECIMAL(10,2)', 'created_at TIMESTAMP']
    },
    {
      table: 'services (Catálogo de Servicios)',
      fields: ['id UUID (PK)', 'tenant_id UUID (FK)', 'name VARCHAR(100)', 'category VARCHAR(50)', 'duration_minutes INT', 'price DECIMAL(10,2)', 'cost_estimate DECIMAL(10,2)']
    },
    {
      table: 'inventory_items (Stock y Consumo)',
      fields: ['id UUID (PK)', 'tenant_id UUID (FK)', 'sku VARCHAR(50)', 'name VARCHAR(150)', 'category VARCHAR(50)', 'current_stock DECIMAL(10,2)', 'min_stock DECIMAL(10,2)', 'cost_price DECIMAL(10,2)', 'retail_price DECIMAL(10,2)', 'is_retail BOOLEAN']
    },
    {
      table: 'technical_formulas (Bitácora de Colorimetría)',
      fields: ['id UUID (PK)', 'client_id UUID (FK)', 'staff_id UUID (FK)', 'date DATE', 'base_natural VARCHAR(100)', 'porosity ENUM', 'formula_details TEXT', 'exposure_time_minutes INT', 'treatment_used TEXT', 'notes TEXT']
    },
    {
      table: 'appointments (Agenda)',
      fields: ['id UUID (PK)', 'tenant_id UUID (FK)', 'client_id UUID (FK)', 'staff_id UUID (FK)', 'service_id UUID (FK)', 'start_time TIMESTAMP', 'end_time TIMESTAMP', 'status ENUM(CONFIRMED, IN_WAITING, IN_CHAIR, COMPLETED, CANCELLED)', 'projected_price DECIMAL(10,2)']
    },
    {
      table: 'sale_tickets (Punto de Venta / Tickets en Espera)',
      fields: ['id UUID (PK)', 'tenant_id UUID (FK)', 'ticket_number VARCHAR(30)', 'client_id UUID (FK)', 'chair_number VARCHAR(30)', 'status ENUM(OPEN, HOLD, PAID, CANCELLED)', 'subtotal DECIMAL(10,2)', 'discount DECIMAL(10,2)', 'tip DECIMAL(10,2)', 'total DECIMAL(10,2)', 'payment_method ENUM', 'paid_at TIMESTAMP']
    },
    {
      table: 'ticket_items (Desglose de Ticket)',
      fields: ['id UUID (PK)', 'ticket_id UUID (FK)', 'item_type ENUM(SERVICE, PRODUCT, PACKAGE)', 'item_id UUID', 'staff_id UUID (FK)', 'quantity INT', 'unit_price DECIMAL(10,2)', 'commission_amount DECIMAL(10,2)', 'total DECIMAL(10,2)']
    },
    {
      table: 'expenses (Gastos Operativos)',
      fields: ['id UUID (PK)', 'tenant_id UUID (FK)', 'date DATE', 'concept VARCHAR(200)', 'category VARCHAR(50)', 'amount DECIMAL(10,2)', 'payment_method VARCHAR(50)', 'registered_by UUID (FK)']
    }
  ],
  backlogEpics: [
    {
      epicId: 'EPIC-01',
      title: 'Módulo de Agenda Inteligente y Citas',
      stories: [
        { id: 'US-101', title: 'Calendario multi-vista (Día, Semana, Mes y Por Empleado en columnas)', priority: 'ALTA', est: '5 pts', acceptance: 'El recepcionista visualiza en columnas paralelas los sillones y estilistas disponibles, permitiendo arrastrar y reagendar citas sin colisiones.' },
        { id: 'US-102', title: 'Enlace directo de Cita con Ticket de Punto de Venta', priority: 'ALTA', est: '3 pts', acceptance: 'Al hacer click en "Iniciar Atención", la cita se convierte en un ticket en espera con el servicio precotizado listo para recibir consumos adicionales.' },
        { id: 'US-103', title: 'Notificación y Confirmación de Citas vía WhatsApp', priority: 'MEDIA', est: '3 pts', acceptance: 'Envío de recordatorio con 1 clic con link dinámico para confirmar o reprogramar la cita.' }
      ]
    },
    {
      epicId: 'EPIC-02',
      title: 'Punto de Venta (POS) con Ticket en Espera & Paquetes',
      stories: [
        { id: 'US-201', title: 'Gestión de "Ticket en Espera" (Cuentas Abiertas)', priority: 'CRÍTICA', est: '8 pts', acceptance: 'Permite mantener la cuenta abierta mientras la clienta está en el salón y agregar servicios express o productos de vitrina antes del cobro final.' },
        { id: 'US-202', title: 'Cobro multi-método y desglose de propinas', priority: 'ALTA', est: '5 pts', acceptance: 'Soporta pagos mixtos (efectivo + tarjeta + puntos de lealtad) con cálculo automático de vuelto y asignación de propina a estilista.' },
        { id: 'US-203', title: 'Venta y redención de paquetes de múltiples sesiones', priority: 'MEDIA', est: '5 pts', acceptance: 'Permite cobrar un paquete de 4 sesiones por adelantado y descontar el balance sesión a sesión.' }
      ]
    },
    {
      epicId: 'EPIC-03',
      title: 'Inventario, Consumo Interno y Fórmulas Técnicas',
      stories: [
        { id: 'US-301', title: 'Bitácora técnica de Fórmulas de Colorimetría por cliente', priority: 'ALTA', est: '5 pts', acceptance: 'El estilista puede consultar la proporción exacta de tinte y peróxido utilizada en visitas previas para replicar el tono sin variaciones.' },
        { id: 'US-302', title: 'Descuento de stock por consumo interno en servicios', priority: 'ALTA', est: '5 pts', acceptance: 'Al completar un servicio de balayage, el sistema rebaja automáticamente los gramos de decolorante y mililitros de oxidante del inventario.' },
        { id: 'US-303', title: 'Alertas visuales de stock mínimo y reposición', priority: 'MEDIA', est: '3 pts', acceptance: 'Tablero que resalta en color ámbar/rojo los productos con existencias por debajo del punto de reorden.' }
      ]
    },
    {
      epicId: 'EPIC-04',
      title: 'Recursos Humanos y Motor de Comisiones Automáticas',
      stories: [
        { id: 'US-401', title: 'Configuración de tasas de comisión por colaborador', priority: 'ALTA', est: '5 pts', acceptance: 'Definir porcentajes independientes para servicios (ej. 45%) y para venta de productos de vitrina (ej. 15%).' },
        { id: 'US-402', title: 'Liquidación de comisiones en 1 clic', priority: 'ALTA', est: '5 pts', acceptance: 'Generar reporte filtrable por rango de fechas que totaliza las ganancias de cada estilista sin errores manuales.' }
      ]
    },
    {
      epicId: 'EPIC-05',
      title: 'Finanzas, Gastos y Analítica Gerencial',
      stories: [
        { id: 'US-501', title: 'Registro de Gastos Operativos y Arqueo de Caja', priority: 'ALTA', est: '5 pts', acceptance: 'Registro de egresos (alquiler, insumos) y cuadre de caja diario con cálculo de faltantes o sobrantes.' },
        { id: 'US-502', title: 'Dashboard de Proyección de Ingresos y Métricas Clave', priority: 'ALTA', est: '5 pts', acceptance: 'Visualización de ventas proyectadas según citas agendadas, ticket promedio y tasa de retención de clientes.' }
      ]
    }
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Autenticación de personal con email/password y generación de JWT con rol.' },
    { method: 'GET', path: '/api/v1/appointments?date=YYYY-MM-DD&staff_id=UUID', desc: 'Obtiene el calendario de citas con estado y enlace a ticket.' },
    { method: 'POST', path: '/api/v1/appointments', desc: 'Crea una nueva cita calculando disponibilidad de sillón y personal.' },
    { method: 'PATCH', path: '/api/v1/appointments/:id/status', desc: 'Actualiza el estado (CONFIRMED, IN_CHAIR, COMPLETED, CANCELLED).' },
    { method: 'GET', path: '/api/v1/tickets/hold', desc: 'Obtiene todos los tickets en espera (cuentas abiertas en atención).' },
    { method: 'POST', path: '/api/v1/tickets', desc: 'Crea un ticket en espera asociado o no a una cita previa.' },
    { method: 'POST', path: '/api/v1/tickets/:id/items', desc: 'Agrega consumos de servicios, productos o paquetes a una cuenta abierta.' },
    { method: 'POST', path: '/api/v1/tickets/:id/checkout', desc: 'Procesa el cobro final, descuenta stock, acumula puntos y calcula comisiones.' },
    { method: 'GET', path: '/api/v1/clients/:id/formulas', desc: 'Historial de recetas y fórmulas técnicas de colorimetría del cliente.' },
    { method: 'POST', path: '/api/v1/clients/:id/formulas', desc: 'Registra una nueva fórmula técnica con fotos, mezclas y tiempo de pose.' },
    { method: 'GET', path: '/api/v1/inventory/alerts', desc: 'Retorna ítems bajo el stock mínimo para generación de orden de compra.' },
    { method: 'GET', path: '/api/v1/commissions/summary?from=DATE&to=DATE', desc: 'Resumen consolidado de comisiones por empleado y concepto.' },
    { method: 'GET', path: '/api/v1/analytics/dashboard', desc: 'KPIs en tiempo real: ventas hoy, proyección semanal, ocupación y retención.' }
  ]
};
