-- seed.sql — Inserta tenant demo + datos de initialData.ts
-- Ejecutar con: supabase db reset  o  psql < seed.sql
-- Ids fijos para reproducibilidad en demo

-- Tenant demo
insert into public.tenants (id, slug, business_name, tax_id, plan_tier, currency, timezone)
values ('00000000-0000-0000-0000-000000000001','gestibella-demo','GestiBella Salon & Spa','GBE240824-XYZ','pro','MXN','America/Mexico_City')
on conflict (slug) do nothing;

-- Branches
insert into public.branches (id, tenant_id, code, name, address, phone, manager_name, active_staff_count, today_sales, monthly_revenue, status, color_tag) values
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001','POL-01','GestiBella Polanco (Principal)','Av. Presidente Masaryk 360, Polanco, CDMX','+52 55 5540 8890','Valentina Vega',6,14920,384000,'ACTIVE','#BE5A38'),
('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000001','ROM-02','GestiBella Roma Norte','Álvaro Obregón 130, Roma Nte., CDMX','+52 55 5264 1190','Mariana Silva',4,9850,245000,'ACTIVE','#2D2A26'),
('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000001','SAT-03','GestiBella Satélite','Blvd. Manuel Ávila Camacho 2200, Naucalpan','+52 55 5373 4410','Carlos Mendieta',5,11200,310000,'ACTIVE','#D97706')
on conflict (id) do nothing;

-- Staff (de initialData.ts INITIAL_STAFF)
insert into public.staff (id, tenant_id, name, email, phone, role, role_title, avatar, service_commission_rate, product_commission_rate, specialties, color_tag, is_active, permissions) values
('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0000-000000000001','Valentina Rossi','valentina@gestibella.com','+52 55 4123 9901','ADMIN','Directora & Master Colorista','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',0.50,0.15,array['Balayage & Color','Diseño de Corte','Tratamientos Capilares'],'#E07A5F',true,'{"canAccessPOS":true,"canAccessFinances":true,"canAccessInventory":true,"canAccessReports":true,"canManageStaff":true}'),
('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0000-000000000001','Sebastián Méndez','sebastian@gestibella.com','+52 55 4123 9902','STYLIST','Estilista Senior & Barbero VIP','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',0.45,0.12,array['Cortes de Precisión','Keratinas & Alisados','Styling Editorial'],'#3D5A80',true,'{"canAccessPOS":true,"canAccessFinances":false,"canAccessInventory":true,"canAccessReports":false,"canManageStaff":false}'),
('00000000-0000-0000-0000-000000000103','00000000-0000-0000-0000-000000000001','Camila Morales','camila@gestibella.com','+52 55 4123 9903','STYLIST','Especialista en Uñas & Manicura Rusa','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',0.40,0.10,array['Nail Art Estructurado','Pedicura Spa','Soft Gel'],'#BE5A38',true,'{"canAccessPOS":true,"canAccessFinances":false,"canAccessInventory":true,"canAccessReports":false,"canManageStaff":false}'),
('00000000-0000-0000-0000-000000000104','00000000-0000-0000-0000-000000000001','Dr. Julián Rivas','julian@gestibella.com','+52 55 4123 9904','STYLIST','Cosmiatra & Terapeuta Spa','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',0.45,0.15,array['Masajes Holísticos','Hidrafaciales','Drenaje Linfático'],'#2A9D8F',true,'{"canAccessPOS":true,"canAccessFinances":false,"canAccessInventory":true,"canAccessReports":false,"canManageStaff":false}'),
('00000000-0000-0000-0000-000000000105','00000000-0000-0000-0000-000000000001','Andrea Fuentes','recepcion@gestibella.com','+52 55 4123 9905','RECEPTIONIST','Coordinadora de Experiencia & Caja','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',0.05,0.08,array['Atención VIP','Control de Citas','Punto de Venta'],'#8D5B4C',true,'{"canAccessPOS":true,"canAccessFinances":false,"canAccessInventory":false,"canAccessReports":false,"canManageStaff":false}')
on conflict (id) do nothing;

-- Services
insert into public.services (id, tenant_id, name, category, duration_minutes, price, cost, required_supplies) values
('00000000-0000-0000-0000-000000000201','00000000-0000-0000-0000-000000000001','Balayage Signature & Matiz Gloss','Colorimetría',180,2400,450,'[{"supplyId":"00000000-0000-0000-0000-000000000301","quantity":90,"unit":"g"},{"supplyId":"00000000-0000-0000-0000-000000000303","quantity":120,"unit":"ml"}]'),
('00000000-0000-0000-0000-000000000202','00000000-0000-0000-0000-000000000001','Corte de Autor & Styling Profesional','Cabello',60,650,40,'[{"supplyId":"00000000-0000-0000-0000-000000000304","quantity":15,"unit":"ml"}]'),
('00000000-0000-0000-0000-000000000203','00000000-0000-0000-0000-000000000001','Tratamiento Reconstructivo Keratina Botox','Cabello',120,1850,280,'[{"supplyId":"00000000-0000-0000-0000-000000000305","quantity":50,"unit":"ml"}]'),
('00000000-0000-0000-0000-000000000204','00000000-0000-0000-0000-000000000001','Manicura Spa Rusa + Esmaltado Semipermanente','Manicura & Pedicura',75,520,65,'[]'),
('00000000-0000-0000-0000-000000000205','00000000-0000-0000-0000-000000000001','Pedicura Jelly Spa Detox','Manicura & Pedicura',60,680,85,'[]'),
('00000000-0000-0000-0000-000000000206','00000000-0000-0000-0000-000000000001','Masaje Relajante Descontracturante (60 min)','Spa & Masajes',60,950,110,'[]'),
('00000000-0000-0000-0000-000000000207','00000000-0000-0000-0000-000000000001','Facial Profundo Hydrafacial Glow','Faciales',75,1350,210,'[]'),
('00000000-0000-0000-0000-000000000208','00000000-0000-0000-0000-000000000001','Lifting de Pestañas + Laminado de Cejas','Cejas & Pestañas',60,780,95,'[]')
on conflict (id) do nothing;

-- Inventory
insert into public.inventory_items (id, tenant_id, sku, name, brand, category, unit, cost_price, retail_price, is_retail, location, min_stock, max_stock, current_stock) values
('00000000-0000-0000-0000-000000000301','00000000-0000-0000-0000-000000000001','TINT-7-1','Tinte Igora Royal 7-1 Rubio Ceniza','Schwarzkopf Pro','Tintes','Tubos (60g)',145,null,false,'Estante Colorimetría A-2',6,25,18),
('00000000-0000-0000-0000-000000000302','00000000-0000-0000-0000-000000000001','TINT-8-3','Tinte Majirel 8.3 Rubio Claro Dorado','L''Oréal Professionnel','Tintes','Tubos (50ml)',160,null,false,'Estante Colorimetría A-3',5,20,24),
('00000000-0000-0000-0000-000000000303','00000000-0000-0000-0000-000000000001','OXI-20V','Peróxido Oxigenada 20 Volúmenes','Wella Blondor','Químicos & Peróxidos','ml',0.12,null,false,'Área Técnica Mezclas',1000,5000,4500),
('00000000-0000-0000-0000-000000000304','00000000-0000-0000-0000-000000000001','SHAMP-NO5','Olaplex No. 4 & No. 5 Bond Maintenance Kit','Olaplex','Retail Venta','Unidades',580,990,true,'Vitrinas de Exhibición Recepción',3,15,18),
('00000000-0000-0000-0000-000000000305','00000000-0000-0000-0000-000000000001','MASK-K18','K18 Molecular Repair Hair Mask 50ml','K18 Biomimetic','Retail Venta','Unidades',920,1580,true,'Vitrinas de Exhibición Recepción',4,12,9),
('00000000-0000-0000-0000-000000000306','00000000-0000-0000-0000-000000000001','KER-BTOX','Tratamiento Nanoplastia & Botox Capilar 1L','Braé Divine','Tratamientos','ml',1.85,null,false,'Estante Tratamientos Cabina 1',300,2000,1250),
('00000000-0000-0000-0000-000000000307','00000000-0000-0000-0000-000000000001','GEL-SEM-08','Gel Semipermanente Nude Velvet #24','The GelBottle','Insumos Desechables','Frascos',210,null,false,'Mesa Manicura 1',3,10,18)
on conflict (id) do nothing;

-- Branch inventory seed (de initialData.ts branchStock)
insert into public.branch_inventory (branch_id, inventory_item_id, stock) values
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000301',10),('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000301',5),('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000301',3),
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000302',14),('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000302',6),('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000302',4),
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000303',2800),('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000303',1100),('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000303',600),
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000304',9),('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000304',5),('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000304',4),
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000305',4),('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000305',3),('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000305',2),
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000306',650),('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000306',400),('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000306',200),
('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000307',8),('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000307',6),('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000307',4)
on conflict do nothing;

-- Upsell items
insert into public.upsell_items (id, tenant_id, name, category, price, duration_minutes, description, recommended_for_category, popular_prompt) values
('00000000-0000-0000-0000-000000000401','00000000-0000-0000-0000-000000000001','Hidratación Molecular Exprés Olaplex / K18','Cabello',280,15,'Tratamiento exprés de sellado de puntas',array['Cabello','Colorimetría'],'¿Te gustaría añadir una Hidratación Molecular Exprés por solo $280 MXN extra?'),
('00000000-0000-0000-0000-000000000402','00000000-0000-0000-0000-000000000001','Ampolleta Reconstructora con Ácido Hialurónico','Cabello',180,10,'Nutrición intensiva',array['Cabello','Colorimetría'],'¿Añadimos una ampolleta de brillo diamante por solo $180 MXN?'),
('00000000-0000-0000-0000-000000000403','00000000-0000-0000-0000-000000000001','Exfoliación & Mascarilla de Manos de Seda','Manicura & Pedicura',150,10,'Exfoliación con sales',array['Manicura & Pedicura'],'¿Te gustaría incluir exfoliación de parafina por $150 MXN?')
on conflict (id) do nothing;

-- AntiNoShow + Receipt config
insert into public.anti_noshow_settings (tenant_id, deposits_enabled, deposit_percentage, minimum_service_price_for_deposit, deposit_required_categories, ics_calendar_attachment_enabled, reminder_upsell_enabled, automated_waitlist_trigger_enabled, reminder_notice_hours)
values ('00000000-0000-0000-0000-000000000001', true, 30, 1000, array['Colorimetría','Cabello','Faciales','Spa & Masajes'], true, true, true, 24)
on conflict (tenant_id) do nothing;

insert into public.receipt_config (tenant_id, salon_name, salon_slogan, address, phone, tax_id, logo_url, printer_name, printer_connection, paper_width, font_size, accent_color, custom_footer_message)
values ('00000000-0000-0000-0000-000000000001','GestiBella Salon & Spa','Alta Peluquería & Estética','Av. Presidente Masaryk 360, Polanco, CDMX','+52 55 5540 8890','GBE240824-XYZ','https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80','Epson TM-T20III Thermal POS','USB','80mm','xs','#BE5A38','¡Gracias por consentirte con nosotros!')
on conflict (tenant_id) do nothing;

-- Clients
insert into public.clients (id, tenant_id, name, phone, email, avatar, joined_date, total_spent, visit_count, loyalty_points, stamp_card_count, preferred_staff_id, allergies_or_notes) values
('00000000-0000-0000-0000-000000000501','00000000-0000-0000-0000-000000000001','Mariana Garza Villarreal','+52 81 1845 9210','mariana.garza@gmail.com','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80','2025-03-12',16400,7,340,5,'00000000-0000-0000-0000-000000000101','Sensibilidad a fragancias fuertes.'),
('00000000-0000-0000-0000-000000000502','00000000-0000-0000-0000-000000000001','Lucía Fernández Ramos','+52 55 9382 1104','lucia.fernandez@outlook.com','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80','2025-08-19',9200,4,180,3,'00000000-0000-0000-0000-000000000102','Cuero cabelludo seco.'),
('00000000-0000-0000-0000-000000000503','00000000-0000-0000-0000-000000000001','Carolina Benítez','+52 55 8734 5519','caro.benitez@empresa.com','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80','2026-01-10',4850,3,90,6,'00000000-0000-0000-0000-000000000103','Uñas quebradizas.'),
('00000000-0000-0000-0000-000000000504','00000000-0000-0000-0000-000000000001','Sofía Álvarez de la Rosa','+52 55 2390 1928','sofia.alvarez@luxury.com','https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80','2025-11-04',28900,12,720,2,'00000000-0000-0000-0000-000000000104','Clienta VIP Platinum.')
on conflict (id) do nothing;

-- Expenses
insert into public.expenses (id, tenant_id, date, concept, category, amount, payment_method, receipt_number, registered_by) values
('00000000-0000-0000-0000-000000000601','00000000-0000-0000-0000-000000000001','2026-08-20','Reabastecimiento Tintes Schwarzkopf & Peróxidos','Insumos y Productos',5400,'Transferencia Bancaria','FAC-PROV-9921','Valentina Rossi'),
('00000000-0000-0000-0000-000000000602','00000000-0000-0000-0000-000000000001','2026-08-01','Renta Mensual Local Comercial Polanco','Alquiler y Local',22000,'Transferencia Bancaria','REC-ARR-08-26','Valentina Rossi'),
('00000000-0000-0000-0000-000000000603','00000000-0000-0000-0000-000000000001','2026-08-15','Pago Servicio Energía Eléctrica CFE','Servicios Básicos',3850,'Tarjeta Corporativa','CFE-883921','Andrea Fuentes')
on conflict (id) do nothing;
