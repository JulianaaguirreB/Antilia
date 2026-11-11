# Protocolo de validación final (Release 3)

Responsable del protocolo: Samuel Montealegre Quintero (QA).

Ventana de ejecución: del lunes 9 al domingo 15 de noviembre de 2026. Los resultados alimentan la entrega de la validación final (15 de noviembre) y el MVP final (22 de noviembre).

## 1. Objetivo

Comprobar con personas reales del segmento:

1. Si los updates 03 (recorrido guiado), 04 (espacios localizables y recuperables) y 05 (pendientes unificados) del Release 3 se completan sin ayuda y en menos tiempo que los recorridos equivalentes del Release 2.
2. Si los resultados siguen siendo comparables con el Release 1 y el Release 2, repitiendo las mismas tareas base.
3. Si la usabilidad percibida (SUS) se mantiene o mejora frente al Release 1 (77,5 puntos) y al Release 2.

## 2. Versión que se prueba

Las sesiones usan la URL fija del despliegue de Vercel correspondiente al tag `v0.3`, no la URL principal, para que todos los participantes prueben la misma versión. El enlace se obtiene en Vercel → Deployments → despliegue del commit etiquetado `v0.3` y se anota en el registro. En Android también puede usarse el APK 0.3.7.

## 3. Participantes

Seis personas: cinco más una de reserva.

| Grupo | Cantidad | Propósito |
|---|---|---|
| Personas que ya participaron en una validación anterior (R1 o R2) | Al menos 2 | Medir la evolución entre versiones con las mismas personas |
| Personal administrativo nuevo del segmento | Al menos 3 | Medir la adopción sin aprendizaje previo |
| Reserva | 1 | Reemplazar una cancelación sin mover la fecha |

- **Perfil:** asistentes, auxiliares o coordinadores administrativos de empresas medianas de Bogotá que usan celular con Chrome o Safari.
- **Exclusiones:** no participan compañeros de universidad, familiares ni amigos de ningún integrante del equipo.
- **Identificación:** cada persona conserva el código que tuvo en validaciones anteriores. Las personas nuevas continúan la numeración.

## 4. Tareas y criterios de éxito

Las tareas se leen una por una, en el orden de la tabla. Una tarea es exitosa si se cumple el criterio sin ayuda. Un bloqueo de más de tres minutos se registra como fracaso.

### Bloque A · Tareas base del Release 1 (sin cambios)

Se repiten textualmente para mantener la comparación entre los tres releases.

| # | Tarea leída al participante | Criterio de éxito | Límite |
|---|---|---|---|
| R1-T1 | «Cree una cuenta en Antilia con su correo de trabajo.» | Llega a la pantalla principal | 2 min |
| R1-T2 | «Registre dos cosas que necesite ordenar hoy: una de su escritorio y una de su computador.» | Crea una tarea física y una digital con el tipo correcto | 60 s |
| R1-T3 | «Marque como hecha la tarea de su escritorio y diga cuántos días lleva su racha.» | Completa con un toque e informa la racha correcta sin salir de la pantalla principal | Sin límite |
| R1-T4 | «Muestre solo las tareas de su computador.» | Usa el filtro de tareas digitales («Correos y archivos») | 20 s |
| R1-T5 | «Encuentre cuál ha sido su racha más alta.» | Llega a Progreso y lee el récord correcto | 30 s |

### Bloque B · Tareas de los updates del Release 3

| # | Tarea leída al participante | Criterio de éxito | Límite |
|---|---|---|---|
| T1-F | «Use el recorrido guiado para crear un espacio nuevo, agregarle una tarea de su oficina y completarla de inmediato.» | Completa los tres pasos desde el recorrido guiado sin salir a otros menús y activa la racha del día | 90 s |
| T2-F | «Archive uno de sus espacios, encuéntrelo usando el filtro de archivados y restáurelo a su lista activa.» | Archiva el espacio, filtra por archivados, lo restaura y verifica el contador de tareas | 45 s |
| T3-F | «Vaya a sus pendientes unificados y filtre todas las tareas pendientes (físicas, correos o archivos) asociadas a su espacio de hoy.» | Abre Pendientes unificados y aplica correctamente los filtros de estado, espacio y fecha | 45 s |
| T4-F | «Planee su escritorio en 3D ubicando dos objetos de trabajo y consulte en su progreso cuántos días de actividad lleva en la semana.» | Guarda la distribución en el escritorio 3D y lee correctamente su actividad de los últimos 7 días junto a Lumi | 2 min |

El texto de las tareas no se modifica después de la primera sesión.

## 5. Criterios de validación

| Indicador | Umbral |
|---|---|
| Tasa de éxito por tarea | Al menos 80 % (cuatro de cada cinco participantes) en cada tarea |
| SUS promedio | 68 o más, y no menor que el promedio del Release 1 (77,5) |
| Tiempo en T1-F, T2-F y T3-F | Menor que el tiempo promedio de la tarea equivalente del Release 2, cuando exista registro |

## 6. Procedimiento de cada sesión

Se aplica el mismo protocolo de `protocolo-release1.md`:

1. Consentimiento grabado para registrar pantalla, voz, tiempos y respuestas con fines académicos y anónimos.
2. Instrucciones: se evalúa la aplicación, no a la persona; se pide pensar en voz alta.
3. Tareas sin ayuda, cronometradas desde que se termina de leer cada una.
4. Cuestionario final en Google Forms con el código del participante: perfil, afirmaciones de experiencia y SUS de diez afirmaciones.

La sesión puede ser presencial o por videollamada con pantalla compartida y dura cerca de 20 minutos.

## 7. Registro

Los resultados se diligencian en `registro-final.xlsx`, con la misma estructura de `registro-release2.xlsx` (hojas Guion, Participantes, Tareas, SUS, Hallazgos y Resumen).

## 8. Agenda de participantes

| Código | Perfil y empresa | Participación previa | Fecha y hora | Modalidad | Estado |
|---|---|---|---|---|---|
| PF-1 | | | | | Por confirmar |
| PF-2 | | | | | Por confirmar |
| PF-3 | | | | | Por confirmar |
| PF-4 | | | | | Por confirmar |
| PF-5 | | | | | Por confirmar |
| Reserva | | | | | Por confirmar |

La tabla se actualiza cuando cada participante confirma su fecha. Solo se marca «Confirmado» con una respuesta escrita del participante.

## 9. Responsables

| Actividad | Responsable |
|---|---|
| Agenda, contacto con CBA Ingenieros y confirmación de participantes | Nicolás Silva García (Tech Lead) |
| Moderación de las sesiones | Alejandro Macías (UX) |
| Cronometraje, registro por tarea, custodia de la evidencia y consolidación de resultados | Samuel Montealegre Quintero (QA) |
| Cálculo del SUS y priorización de hallazgos | Nicolás Silva García y Samuel Montealegre Quintero |
| Disponibilidad del servidor y del APK durante las sesiones | Juliana Aguirre Ballesteros (Backend) y Juan Fernando Herrera (Frontend) |

## 10. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Cancelaciones en la semana de la demo | Participante de reserva y sesiones repartidas en varios días |
| Primera carga lenta por la pausa de la base de datos gratuita | Abrir la URL un minuto antes de cada sesión |
| Las tareas del bloque B necesitan un espacio creado | T1-F crea el espacio que usa T2-F |
| Datos personales reales en las tareas | Se pide describir los pendientes sin nombres de personas ni datos de terceros |
