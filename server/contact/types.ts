export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatDateTime(date = new Date()): { date: string; time: string; full: string } {
  const datePart = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);

  return {
    date: datePart,
    time: timePart,
    full: `${datePart} ${timePart} (МСК)`,
  };
}

export interface ContactMessageContext {
  name: string;
  email: string;
  company: string;
  message: string;
  ip: string;
  userAgent: string;
  receivedAt: Date;
}
