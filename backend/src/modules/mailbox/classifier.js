const categories = ['trabajo', 'proyectos', 'reuniones', 'documentos', 'otros'];
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function classifyMessage({ subject, sender, labels = [] }) {
  if (labels.some(label => ['SPAM', 'TRASH', 'CATEGORY_PROMOTIONS', 'CATEGORY_SOCIAL'].includes(label))) return null;
  const address = String(sender || '').match(/<([^<>]+)>/)?.[1] || String(sender || '').trim();
  if (/@(?:[^@.]+\.)?(?:temu\.com|temuemail\.com)$/i.test(address)) return null;
  const title = normalize(subject);
  if (/\b(oferta|descuento|cupon|promocion|sale|newsletter|unsubscribe)\b/.test(title)) return null;
  const rules = [
    ['proyectos', /\b(proyecto|project|entrega|sprint|release|avance|hito)\b/, 'El asunto menciona un proyecto o una entrega.'],
    ['reuniones', /\b(reunion|meeting|invitacion|agenda|entrevista|videollamada)\b/, 'El asunto menciona una reunión o cita.'],
    ['documentos', /\b(documento|contrato|factura|informe|reporte|acta|cotizacion)\b/, 'El asunto menciona un documento de trabajo.'],
    ['trabajo', /\b(trabajo|laboral|oficina|tarea|equipo|cliente|solicitud|aprobacion)\b/, 'El asunto contiene un tema laboral.']
  ];
  for (const [category, pattern, reason] of rules) if (pattern.test(title)) return { category, reason };
  return null;
}
module.exports = { classifyMessage, categories };
