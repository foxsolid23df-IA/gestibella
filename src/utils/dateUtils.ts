const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

const MONTHS_FULL_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Returns today as 'YYYY-MM-DD' */
export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Returns tomorrow as 'YYYY-MM-DD' */
export function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Converts 'YYYY-MM-DD' to '9 Sep' style label */
export function formatDayMonth(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS_ES[m - 1]}`;
}

/** Returns 'Septiembre 2026' for current month */
export function getCurrentMonthYear(): string {
  const d = new Date();
  return `${MONTHS_FULL_ES[d.getMonth()]} ${d.getFullYear()}`;
}
