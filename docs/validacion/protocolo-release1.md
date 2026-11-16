# Protocolo de validación del Release 1

Responsable del protocolo y del registro de resultados: Samuel Montealegre Quintero (QA).

Este protocolo se aplica en cada sesión con participantes. Las tareas y los criterios de éxito se definieron antes de las sesiones, el 11 de octubre de 2026, en el Reporte a la Junta del Release 1 (sección 7.4). Aquí se conservan sin cambios. Solo se precisa cómo se ven hoy las etiquetas de la interfaz.

## 1. Objetivo

Comprobar si personas reales del segmento completan sin ayuda el recorrido principal del Release 1. El recorrido es crear una cuenta, registrar tareas de orden, completarlas y consultar la racha. Además se mide la usabilidad percibida con el cuestionario SUS. Los problemas observados se registran como hallazgos priorizados (H1, H2…) para orientar los cambios del Release 2.

## 2. Versión que se prueba

| Opción | URL | Cuándo usarla |
|---|---|---|
| A (preferida) | Despliegue de Vercel correspondiente al tag `v0.1` (Vercel → Deployments → despliegue del 11 de octubre) | Si el despliegue abre, permite registrarse y crear tareas sin errores con la base de datos actual |
| B | https://antilia-delta.vercel.app/ | Si la opción A no funciona. El reporte debe declarar que las sesiones usaron la versión publicada al momento de la sesión |

La versión usada se anota para cada participante en el registro (columna «Versión probada»). Antes de la primera sesión, una persona del equipo comprueba que la URL elegida permite completar las cinco tareas.

## 3. Participantes

Mínimo cinco personas, más una de reserva.

**Perfil:** asistentes, auxiliares o coordinadores administrativos de empresas medianas de Bogotá. Atienden archivo, correo y solicitudes internas, no tienen un momento fijo para ordenar su espacio y usan un celular con Chrome o Safari.

**Fuentes priorizadas (early adopters):**
- personas de la investigación de campo de agosto;
- personal administrativo vinculado a CBA Ingenieros;
- personas del segmento que lleguen por la landing.

**Criterios de exclusión:** compañeros de universidad, familiares y amigos de cualquier integrante del equipo. Si existe duda sobre la relación con alguien del equipo, la persona no participa.

Cada participante se identifica con un código (P01, P02…). El nombre no se registra en el repositorio.

## 4. Lugar y roles de la sesión

La sesión se realiza en el entorno real del participante: en su puesto de trabajo o por videollamada con la pantalla del celular compartida. El participante usa su propio celular.


| Rol | Responsabilidad |
|---|---|
| Moderador | Lee el guion y las tareas, pide pensar en voz alta y no ayuda |
| Observador QA | Cronometra, diligencia el registro por tarea y resguarda la evidencia |

Si la sesión la conduce una sola persona, esa persona graba la sesión y toma los tiempos después, a partir de la grabación.

## 5. Materiales

- Celular del participante con la URL de la versión elegida.
- Registro de la sesión: `registro-release1.xlsx` (hojas Participantes, Tareas, SUS y Hallazgos).
- Cuestionario SUS impreso, en formulario o leído en voz alta.
- Grabación de pantalla o videollamada con pantalla compartida.
- Cronómetro.

## 6. Guion de la sesión (20 a 25 minutos)

**6.1 Bienvenida y consentimiento (2 minutos).** El moderador lee:

> «Gracias por acompañarnos. Somos estudiantes de Ingeniería de Sistemas de la Pontificia Universidad Javeriana y estamos probando Antilia, una aplicación para organizar el espacio de trabajo. No le estamos evaluando a usted, estamos evaluando la aplicación: si algo no funciona o no se entiende, es información valiosa para nosotros. Con su permiso, vamos a grabar la pantalla de su celular y su voz, y a tomar notas. La grabación solo la verá el equipo y el profesor del curso, y en los documentos usaremos un código en lugar de su nombre. Puede detener la sesión en cualquier momento. ¿Está de acuerdo con que grabemos?»

Si la persona acepta, la aceptación se graba al inicio del video y se marca en el registro. Si no acepta la grabación, la sesión continúa solo con notas fechadas.

**6.2 Instrucciones (1 minuto).**

> «Le voy a leer cinco tareas, una por una. Intente hacerlas como lo haría sola o solo. Mientras lo hace, por favor diga en voz alta lo que piensa, lo que busca y lo que espera que pase. Yo no podré ayudarle durante las tareas; al final puede preguntarme lo que quiera.»

El moderador no explica cómo funciona la aplicación.

**6.3 Tareas (10 a 15 minutos).** Se leen en el orden de la sección 7. El cronómetro arranca cuando termina la lectura de la tarea y se detiene cuando el participante dice que terminó o cumple el criterio.

**6.4 Cuestionario SUS (3 minutos).** El participante califica las diez afirmaciones de la sección 9.

**6.5 Preguntas abiertas (3 minutos).**
1. «¿Qué fue lo más difícil?»
2. «¿Qué le haría volver a usar la aplicación mañana?»

**6.6 Cierre.** Se agradece la participación y, solo entonces, se responden las dudas del participante.

## 7. Tareas y criterios de éxito

Una tarea es exitosa cuando el participante cumple el criterio sin recibir ayuda. Si permanece bloqueado más de tres minutos, la tarea se registra como fracaso y se continúa con la siguiente. En ese caso se puede ubicar al participante en el punto de partida de la tarea siguiente, sin explicarle la tarea fallida.

| # | Tarea leída al participante | Criterio de éxito | Referencia en la versión actual |
|---|---|---|---|
| T1 | «Cree una cuenta en Antilia con su correo de trabajo.» | Llega a la pantalla principal en máximo dos minutos | Pantalla principal «Hola, [nombre]» |
| T2 | «Registre dos cosas que necesite ordenar hoy: una de su escritorio y una de su computador.» | Crea una tarea física y una digital con el tipo correcto, en máximo treinta segundos cada una | El tipo físico se muestra como «En mi espacio» y el digital como «Correos y archivos» |
| T3 | «Marque como hecha la tarea de su escritorio y diga cuántos días lleva su racha.» | Completa la tarea con un toque e informa la racha correcta sin salir de la pantalla principal | Aviso «¡Racha de 1 día!» |
| T4 | «Muestre solo las tareas de su computador.» | Usa el filtro de tareas digitales en máximo veinte segundos | En la v0.1 el filtro se llama «Digitales»; en la versión actual, «Correos y archivos» |
| T5 | «Encuentre cuál ha sido su racha más alta.» | Llega a la pantalla de progreso y lee el récord correcto en máximo treinta segundos | Pestaña «Progreso», texto «Racha más alta» |

**Criterio de validación del release:** cada tarea la completan al menos cuatro de cada cinco participantes (80 %) y el SUS promedio es igual o mayor que 68.

## 8. Registro por tarea

Para cada participante y cada tarea se registra en la hoja «Tareas»:

- **Resultado:** «Éxito» si se cumple el criterio sin ayuda; «Fracaso» en cualquier otro caso.
- **Tiempo en segundos.**
- **Errores observados:** toques en lugares equivocados, pantallas a las que entró por error, mensajes de error.
- **Cita textual:** lo que dijo en voz alta, si ayuda a entender el problema.

Una tarea completada después de exceder el tiempo del criterio se registra como «Fracaso», con la anotación «completó fuera de tiempo».

## 9. Cuestionario SUS

El participante califica cada afirmación de 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo):

1. Creo que me gustaría usar esta aplicación con frecuencia.
2. Encontré la aplicación innecesariamente compleja.
3. Pensé que la aplicación era fácil de usar.
4. Creo que necesitaría el apoyo de una persona experta para poder usar esta aplicación.
5. Encontré que las funciones de la aplicación estaban bien integradas.
6. Pensé que había demasiada inconsistencia en la aplicación.
7. Imagino que la mayoría de las personas aprendería a usar esta aplicación muy rápidamente.
8. Encontré la aplicación muy engorrosa de usar.
9. Me sentí muy seguro o segura usando la aplicación.
10. Necesité aprender muchas cosas antes de poder empezar a usar esta aplicación.

**Cálculo por participante:**
1. A cada afirmación impar (1, 3, 5, 7 y 9) se le resta 1.
2. Cada afirmación par (2, 4, 6, 8 y 10) se resta de 5.
3. Los diez resultados se suman, lo que da un valor entre 0 y 40.
4. La suma se multiplica por 2,5, lo que da un puntaje entre 0 y 100.

Después se promedian los puntajes de todos los participantes. La hoja «SUS» del registro hace el cálculo automáticamente.

**Interpretación:** por debajo de 51 hay problemas serios; 68 es el promedio de la industria; por encima de 80 la usabilidad es excelente.

## 10. Hallazgos y severidad

Un hallazgo es un problema observado en las sesiones, con evidencia: participante, tarea y minuto de la grabación, o cita textual. Las opiniones sin comportamiento observado se registran como comentarios, no como hallazgos.

| Severidad | Nombre | Definición |
|---|---|---|
| 4 | Crítico | Impide completar una tarea del recorrido principal |
| 3 | Grave | La tarea se completa con mucha dificultad o fuera de tiempo, o afecta a dos o más participantes |
| 2 | Moderado | Causa duda o un error que el participante corrige solo |
| 1 | Menor | Problema de forma o de texto que no afecta el resultado |

Los hallazgos se numeran H1, H2… ordenados por severidad y, a igual severidad, por número de participantes afectados. Cada uno se redacta con su frecuencia, por ejemplo: «H1 · Tres de cinco participantes no encontraron el filtro de tareas digitales».

Un update del Release 2 cita un hallazgo solo si el cambio responde directamente al problema observado y su criterio de terminado comprueba que el problema ya no ocurre.

## 11. Evidencia y privacidad

- **Nombres de archivo:** `P01_2026-10-25_grabacion.mp4`, `P01_2026-10-25_notas.pdf`, `P01_2026-10-25_sus.pdf`.
- **Dónde se guarda:** en la carpeta compartida del equipo, no en el repositorio, porque contiene voz, imagen o datos de contacto de personas.
- **Qué se registra en el repositorio:** solo resultados con códigos de participante.
- **Correo de trabajo:** si un participante usa su correo de trabajo en T1, ese correo no se copia en ningún documento.

## 12. Lista de verificación antes de cada sesión

- [ ] La persona cumple el perfil y no es compañera, familiar ni amiga de nadie del equipo.
- [ ] La URL de la versión elegida abre en el celular del participante.
- [ ] El registro tiene una fila preparada para el participante.
- [ ] La grabación funciona y el consentimiento queda grabado.
- [ ] El moderador tiene el guion y las cinco tareas impresas o en pantalla aparte.
