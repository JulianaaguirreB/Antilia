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
