# Plan de validación del Release 2

Responsable del plan: Samuel Montealegre Quintero (QA).

Ventana de ejecución: del lunes 26 de octubre al domingo 8 de noviembre de 2026. Los resultados alimentan los updates del Release 3, que se entrega el 8 de noviembre.

## 1. Objetivo

Comprobar cuatro cosas con personas reales del segmento:

1. Si completan sin ayuda los recorridos nuevos del Release 2: espacios, escritorio 3D, correos y archivos, y racha con Lumi.
2. Si los updates 01 y 02, que responden a los hallazgos H1 y H2 del Release 1, resolvieron el problema reportado.
3. Si la usabilidad percibida (SUS) se mantiene o mejora frente al Release 1.
4. Dos señales complementarias: si las personas vuelven a la aplicación sin recordatorios, y si la landing se entiende en cinco segundos.

## 2. Versión que se prueba

Las sesiones usan la URL fija del despliegue de Vercel correspondiente al tag `v0.2`, no la URL principal. Durante la ventana, la URL principal recibirá los cambios del Release 3. Usar el despliegue fijo garantiza que todos los participantes prueben la misma versión. El enlace se obtiene en Vercel → Deployments → despliegue del commit etiquetado `v0.2`, y se anota en el registro.

## 3. Participantes

Seis personas: cinco más una de reserva.

| Grupo | Cantidad | Fuente | Propósito |
|---|---|---|---|
| Personal administrativo del segmento | 5 | Personal administrativo de CBA Ingenieros y contactos de la investigación de campo de agosto | Validar los recorridos del Release 2 con personas distintas a las del Release 1, para evitar el efecto de aprendizaje |
| Reserva | 1 | Personas del segmento que lleguen por la landing | Reemplazar una cancelación sin cambiar la fecha de la sesión |

- **Perfil:** asistentes, auxiliares o coordinadores administrativos de empresas medianas de Bogotá que usan celular con Chrome o Safari.
- **Exclusiones:** no participan compañeros de universidad, familiares ni amigos de ningún integrante del equipo.
- **Identificación:** cada persona se identifica con un código que continúa la numeración del Release 1. Antes de cada sesión se registran su cargo y el tamaño de su empresa.

## 4. Tareas y criterios de éxito

Las tareas se leen una por una, en el orden de la tabla. Una tarea es exitosa si se cumple el criterio sin ayuda. Un bloqueo de más de tres minutos se registra como fracaso.

| # | Tarea leída al participante | Criterio de éxito | Límite |
|---|---|---|---|
| T1 | «Cree un espacio para su escritorio y agréguele una cosa que tenga que ordenar hoy.» | Crea el espacio y una tarea asociada; al recargar, ambos siguen ahí | 2 min |
| T2 | «Planee cómo quiere su mesa: elija un modelo y ubique su portátil y sus libretas.» | Elige una mesa, coloca al menos dos tarjetas con nombre y guarda | 3 min |
| T3 | «Anote un correo que tenga pendiente por responder y márquelo como resuelto.» | Crea un correo pendiente en «Correos y archivos» y lo completa | 1 min |
| T4 | «Complete una de sus tareas y muéstreme cómo cambió Lumi.» | Completa una tarea y llega a la pantalla de racha con Lumi encendida | 45 s |
| T5 | Escenario del hallazgo de mayor severidad del Release 1 que tiene update (U01 o U02) | El criterio de terminado de ese update se cumple con un usuario real | Según el update |

El texto exacto de T5 se escribe el 26 de octubre, a partir de la tabla de updates del reporte del Release 2, y no se modifica después de la primera sesión.

La conexión con Gmail no se incluye: solo funciona para las cuentas autorizadas del piloto.

## 5. Criterios de validación del release

| Indicador | Umbral |
|---|---|
| Tasa de éxito por tarea | Al menos 80 % (cuatro de cada cinco participantes) en cada tarea |
| SUS promedio | 68 o más, y no menor que el promedio del Release 1 |
| Hallazgos del Release 1 con update | El hallazgo no se repite en T5 en al menos cuatro de cada cinco participantes |

## 6. Medidas complementarias

| Medida | Cómo se obtiene | Umbral |
|---|---|---|
| Retorno sin recordatorio (hipótesis 5) | Durante los siete días posteriores a su sesión no se envía ningún recordatorio. Al séptimo día, el participante comparte una captura de «Últimos 7 días» en la pantalla de racha | Al menos dos de seis participantes completan tareas en tres o más días distintos (equivale a la proporción de la hipótesis 5: 5 de 15) |
| Prueba de cinco segundos de la landing | Se muestra la landing en un celular durante cinco segundos a cinco personas del segmento que no conocen Antilia. Después se pregunta: «¿Qué hace esta aplicación y para quién es?» | Al menos cuatro de cinco mencionan organizar tareas o el espacio de trabajo de personal de oficina |
| Tráfico de la landing | Exportación CSV del panel «Visitas a la landing» cada viernes, separada por origen (WhatsApp, Instagram, QR, directo) y sin visitas del equipo | Registro descriptivo de visitas y clics en «Probar Antilia» |

Una captura de racha no reemplaza una sesión. La medida de retorno solo indica si hay uso espontáneo.

## 7. Responsables

| Actividad | Responsable |
|---|---|
| Agenda, contacto con CBA Ingenieros y confirmación de participantes | Nicolás Silva García (Tech Lead) |
| Moderación de las sesiones y prueba de cinco segundos | Alejandro Macías (UX) |
| Cronometraje, registro por tarea, custodia de la evidencia y consolidación de resultados | Samuel Montealegre Quintero (QA) |
| Cálculo del SUS y priorización de hallazgos | Nicolás Silva García y Samuel Montealegre Quintero |
| Disponibilidad del servidor durante las sesiones y ajustes derivados | Juliana Aguirre Ballesteros (Backend) y Juan Fernando Herrera (Frontend) |
| Exportación semanal de la analítica de la landing | Juliana Aguirre Ballesteros |

## 8. Cronograma

| Fecha | Actividad |
|---|---|
| Lunes 26 de octubre | Obtener la URL fija de `v0.2`, redactar T5 y preparar `registro-release2.xlsx`. Contactar participantes |
| Martes 27 de octubre | Ensayo interno del protocolo con la URL fija. Primeras dos sesiones |
| Miércoles 28 de octubre | Dos sesiones. Prueba de cinco segundos de la landing |
| Jueves 29 de octubre | Demo ante la Junta. Sin sesiones |
| Viernes 30 de octubre | Dos sesiones, incluida la de reserva si alguien cancela. Primera exportación de la analítica |
| Sábado 31 de octubre y domingo 1 de noviembre | Cálculo del SUS, comparación con el Release 1 y priorización de hallazgos |
| Lunes 2 de noviembre | Festivo en Colombia. Sin sesiones |
| Martes 3 a viernes 6 de noviembre | Implementación y verificación en la URL de los ajustes derivados de los hallazgos. Recolección de capturas de retorno a los siete días. Segunda exportación de la analítica el viernes 6 |
| Sábado 7 de noviembre | Consolidación de resultados y medidas complementarias |
| Domingo 8 de noviembre | Entrega del Release 3 con los resultados de esta validación |

## 9. Protocolo y materiales

Se aplica el mismo protocolo de `protocolo-release1.md`: consentimiento grabado, instrucciones, pensar en voz alta, tareas sin ayuda, SUS de diez afirmaciones y dos preguntas abiertas. Solo cambian las tareas de la sección 4 y la URL. El registro se diligencia en `registro-release2.xlsx`, con la misma estructura que el del Release 1.

## 10. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Participantes que cancelan en semana de demo y festivo | Reserva confirmada y sesiones distribuidas en tres días |
| Primera carga lenta por la pausa de la base de datos gratuita | El moderador abre la URL un minuto antes de la sesión |
| Cambios del Release 3 alteran la versión probada | Uso exclusivo de la URL fija de `v0.2` |
| Datos personales reales en las tareas | Se pide al participante describir el pendiente sin nombres de personas ni datos de terceros |
| Pocas visitas a la landing | Difusión con los enlaces de origen entre contactos del segmento, sin usar visitas del equipo como evidencia |
