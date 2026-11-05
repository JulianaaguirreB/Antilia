export function isCompletedToday(completedAt: string | null | undefined): boolean {
  if (!completedAt) return false;
  
  const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Bogota', year: 'numeric', month: 'numeric', day: 'numeric' };
  
  const now = new Date();
  const completedDate = new Date(completedAt);
  
  const nowStr = new Intl.DateTimeFormat('es-CO', options).format(now);
  const completedStr = new Intl.DateTimeFormat('es-CO', options).format(completedDate);
  
  return nowStr === completedStr;
}

export function formatMemberSince(createdAt: string): string {
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return '';
  const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Bogota', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('es-CO', options).format(date);
}

export function weekActivity(tasks: { completed_at: string | null }[]) {
  const format = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' });
  const today = format.format(new Date());
  const anchor = new Date(`${today}T12:00:00-05:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(anchor.getTime() - (6 - i) * 86400000);
    const key = format.format(date);
    return { key, date: new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short' }).format(date), label: new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', weekday: 'short' }).format(date).replace('.',''), count: tasks.filter(t => t.completed_at && format.format(new Date(t.completed_at)) === key).length };
  });
}
