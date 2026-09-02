import { Appointment } from '../types';

export interface SalonLocationInfo {
  name: string;
  address: string;
  phone: string;
  city: string;
}

export const DEFAULT_SALON_INFO: SalonLocationInfo = {
  name: 'GestiBella Salon & Haute Coiffure',
  address: 'Av. Presidente Masaryk 420, Polanco III Secc',
  phone: '+52 55 4123 9901',
  city: 'Ciudad de México, CDMX'
};

/**
 * Format a Date object or date+time string into iCalendar UTC/Local timestamp (YYYYMMDDTHHMMSS)
 */
export function formatIcsDate(dateStr: string, timeStr: string, addMinutes = 0): string {
  // dateStr is YYYY-MM-DD, timeStr is HH:mm
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  const d = new Date(year, month - 1, day, hours, minutes);
  if (addMinutes > 0) {
    d.setMinutes(d.getMinutes() + addMinutes);
  }

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = '00';

  return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
}

/**
 * Generates valid RFC 5545 iCalendar (.ics) content including VALARM triggers
 * for 24-hour and 1-hour native device push notifications.
 */
export function generateIcsContent(
  appointment: Appointment,
  salonInfo: SalonLocationInfo = DEFAULT_SALON_INFO,
  stylistName = 'Staff Profesional'
): string {
  const dtStart = formatIcsDate(appointment.date, appointment.time, 0);
  const dtEnd = formatIcsDate(appointment.date, appointment.time, appointment.durationMinutes || 60);
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `gestibella-${appointment.id}-${Date.now()}@gestibella.com`;

  const summary = `Cita de Belleza: ${appointment.serviceName} | GestiBella`;
  const location = `${salonInfo.name}, ${salonInfo.address}, ${salonInfo.city}`;
  const description = `¡Hola ${appointment.clientName}!\n\nTu cita para ${appointment.serviceName} está confirmada en ${salonInfo.name}.\n\n` +
    `• Especialista asignado(a): ${stylistName}\n` +
    `• Fecha y Hora: ${appointment.date} a las ${appointment.time} hrs\n` +
    `• Duración estimada: ${appointment.durationMinutes} minutos\n` +
    `• Total del servicio: $${appointment.price.toLocaleString()} MXN\n` +
    (appointment.depositPaid ? `• Anticipo pagado: $${appointment.depositAmount?.toLocaleString()} MXN (Abonado)\n` : '') +
    `• Dirección: ${location}\n` +
    `• Teléfono/WhatsApp: ${salonInfo.phone}\n\n` +
    `Por favor llega 5 minutos antes para brindarte la mejor experiencia.`;

  // Clean description for ICS (escape newlines as \n)
  const escapedDescription = description.replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GestiBella//Software Salón de Belleza//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:GestiBella Citas',
    'X-WR-TIMEZONE:America/Mexico_City',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${escapedDescription}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    // 24 Hours Native Device Reminder Alarm
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio: Mañana tienes tu cita de ${appointment.serviceName} en GestiBella a las ${appointment.time} hrs.`,
    'END:VALARM',
    // 1 Hour Native Device Reminder Alarm
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Tu cita en GestiBella inicia en 1 hora (${appointment.time} hrs). Te esperamos en ${salonInfo.name}.`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Creates a downloadable .ics Blob and initiates download on client device.
 */
export function downloadIcsFile(
  appointment: Appointment,
  salonInfo: SalonLocationInfo = DEFAULT_SALON_INFO,
  stylistName = 'Staff Profesional'
): void {
  const icsData = generateIcsContent(appointment, salonInfo, stylistName);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const sanitizedClient = appointment.clientName.replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('download', `Cita_GestiBella_${sanitizedClient}_${appointment.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a direct Google Calendar Web intent URL
 */
export function generateGoogleCalendarUrl(
  appointment: Appointment,
  salonInfo: SalonLocationInfo = DEFAULT_SALON_INFO,
  stylistName = 'Staff Profesional'
): string {
  const dtStart = formatIcsDate(appointment.date, appointment.time, 0);
  const dtEnd = formatIcsDate(appointment.date, appointment.time, appointment.durationMinutes || 60);

  const title = encodeURIComponent(`Cita en GestiBella: ${appointment.serviceName}`);
  const details = encodeURIComponent(
    `Cita confirmada en ${salonInfo.name}\n\n` +
    `• Clienta: ${appointment.clientName}\n` +
    `• Servicio: ${appointment.serviceName}\n` +
    `• Especialista: ${stylistName}\n` +
    `• Duración: ${appointment.durationMinutes} min\n` +
    `• Total: $${appointment.price.toLocaleString()} MXN\n` +
    `• Teléfono de atención: ${salonInfo.phone}`
  );
  const location = encodeURIComponent(`${salonInfo.name}, ${salonInfo.address}, ${salonInfo.city}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
}
