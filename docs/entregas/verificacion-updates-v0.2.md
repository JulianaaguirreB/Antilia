# Verificación QA del Release 2 (v0.2)

Responsable: Samuel Montealegre Quintero (QA).

Este documento tiene cuatro usos:

1. Comprobar sobre la URL pública https://antilia-delta.vercel.app/, desde un dispositivo que no pertenece a nadie del equipo, que cada update cumple su criterio de terminado.
2. Revisar la landing contra los criterios de la Junta.
3. Confirmar que la landing no promete funciones que el producto no tiene.
4. Cerrar la lista «Antes de subir», cuyo incumplimiento hace que la entrega se devuelva sin calificar.

## 1. Línea base: updates del Release 1 (v0.1)

Según el Reporte a la Junta del 11 de octubre de 2026, el tag `v0.1` incluyó cinco updates:

1. Registro e inicio de sesión con correo y contraseña.
2. Creación de tareas con título y tipo (física o digital).
3. Completar una tarea con un toque y la barra «Progreso del día».
4. Racha de días consecutivos con récord personal y pantalla de progreso.
5. Flujo usable en celular: filtros por tipo, errores que indican cómo corregir, aviso de conexión lenta y navegación inferior.

Ninguno de estos cambios puede registrarse otra vez como update del Release 2.

## 2. Cambios publicados desde v0.1

Cada cambio se comprueba en la URL pública siguiendo los pasos de la columna «Verificación». La columna «Resultado» se diligencia durante la prueba en el dispositivo ajeno.

| ID | Tipo | Qué cambió | Criterio de terminado | Verificación en la URL | Origen | Resultado |
|---|---|---|---|---|---|---|
| C01 | Nueva | Espacios físicos o digitales con tareas asociadas | Un espacio creado con una tarea asociada se conserva igual al recargar | Espacios → Agregar espacio → nombre y tipo → Guardar espacio → Agregar tarea al espacio → recargar | US-05 (cronograma, semanas 13 y 14) | |
| C02 | Nueva | Escritorio 3D con tres mesas y tarjetas editables | Elegir mesa, colocar tres tarjetas con nombre y guardar; al recargar, la distribución se conserva | Inicio → Escritorio 3D → elegir mesa → agregar tarjetas → Guardar escritorio → recargar | US-05, orden del escritorio (cronograma, semana 12) | |
| C03 | Nueva | Estimación de ancho y fondo de la mesa con una foto y una referencia rectangular | Con una foto y una hoja A4 como referencia, la app muestra ancho y fondo estimados | Escritorio 3D → Cámara y medidas → Tomar foto de la mesa → Referencia rectangular → marcar esquinas | US-05, medir espacio | |
| C04 | Nueva | «Correos y archivos»: pendientes de correo y enlaces a archivos agregados por el usuario | Agregar un correo pendiente y un enlace a archivo, completarlos y verlos como completados | Correos y archivos → Agregar correo pendiente → completar; repetir con un archivo | Entrevista del 13/08 (el desorden digital es el dolor diario) | |
| C05 | Nueva | Tablero de tareas por estado | Mover una tarea entre estados conserva el cambio al recargar | Inicio → Tablero → mover una tarea → recargar | US-02 (cronograma, semana 11) | |
| C06 | Nueva | Agenda de turnos sin cruces de horario | Guarda un turno y rechaza otro en el mismo horario con el mensaje «Ya tienes un turno en ese horario.» | Inicio → Tu agenda → Agregar turno → guardar; crear otro que se cruce | US-02, actividades y turnos | |
| C07 | Edición | Perfil editable con foto; el cambio de correo exige la contraseña actual | Cambiar nombre y foto, cerrar sesión, volver a entrar y verlos guardados | Perfil → Editar mis datos → Guardar datos; Cambiar foto → Guardar foto | US-07 | |
| C08 | Nueva | Recuperación de contraseña con código enviado al correo | Solicitar el código, cambiar la contraseña con él e iniciar sesión con la nueva | Acceso → Olvidé mi contraseña → Código recibido → Nueva contraseña | Necesidad funcional de la cuenta; el Release 1 no permitía recuperar el acceso | |
| C09 | Edición | Actividad de los últimos siete días en la pantalla de racha | Completar una tarea hoy y ver la barra del día con una tarea más | Completar una tarea → Progreso → «Últimos 7 días» | MVP, historia Must Have del dashboard; comprometido en los próximos pasos del Reporte del Release 1 | |
| C10 | Nueva | Lumi, la mascota que se enciende con la racha, y su vestidor | Completar una tarea enciende a Lumi; un conjunto guardado se conserva al recargar | Completar una tarea → Progreso → Vestir a Lumi → Guardar conjunto → recargar | Hipótesis 4 (la racha motiva), validada en el piloto manual de septiembre | |
| C11 | Nueva | Sesión de orden de cinco minutos | Iniciar la sesión con una tarea, pausar, recargar y conservar el tiempo; «Ya completé mi tarea» la marca como hecha | Inicio → «Cinco minutos de orden» → elegir tarea → Empezar cinco minutos → pausar y recargar | Entrevista del 10/08 (no hay un momento fijo para ordenar) | |
| C12 | Nueva | Búsqueda de tareas e historial de completadas | Encontrar una tarea por una palabra del título y ver las completadas en el historial | Inicio → «Buscar tus tareas»; cambiar a «Historial» | Uso continuo: la lista crece con los días | |

### Observaciones de QA sobre cambios que no conviene presentar como update

- **Recordatorios por correo.** La pantalla guarda la configuración, pero el envío real depende del proveedor de correo y de un programador de ejecución. Si en la demo no llega un correo, el cambio puede leerse como «una pantalla sin lógica detrás». Además, la hipótesis 3 (recordatorio diario por correo) quedó invalidada en el piloto manual de septiembre. Presentarlo como mejora contradice esa evidencia.
- **Rediseño visual y bienvenida animada.** Según el enunciado, un cambio visual cuenta solo si responde a un problema que lo justifique.
- **Conexión con Gmail.** Solo funciona para las cuentas de prueba autorizadas del piloto. No es comprobable por un usuario externo en la demo; el criterio de C04 usa los pendientes manuales.
- **Landing.** Se evalúa aparte y no cuenta como update.

## 3. Selección de los cinco updates para el reporte

Al menos dos updates deben nacer de hallazgos reales de la validación del Release 1 y citarlos. Por eso la selección tiene dos partes:

1. **U01 y U02:** cambios que responden a los dos hallazgos de mayor severidad del registro `docs/validacion/registro-release1.xlsx` (hoja «Hallazgos»). Se implementan después de las sesiones, se publican antes del tag `v0.2` y su criterio de terminado reproduce el escenario del hallazgo. Ejemplo de formato: «H1 · Tres de cinco no encontraron el filtro digital → criterio: desde Inicio, el usuario filtra sus tareas digitales en menos de 20 s».
2. **U03 a U05:** cambios ya publicados con origen documentado y criterio comprobable en la URL. En orden de recomendación:
   - C01 Espacios.
   - C02 Escritorio 3D.
   - C09 Últimos 7 días: responde a un compromiso explícito del reporte anterior.
   - Reservas: C06 Agenda, C04 Correos y archivos y C08 Recuperación de contraseña.

Un cambio publicado antes de las sesiones no se registra como nacido de un hallazgo, aunque el hallazgo apunte al mismo problema, porque ese origen sería retroactivo. Puede mencionarse como respuesta existente al hallazgo, indicando su fecha.

Formato de la tabla del reporte:

| # | Tipo | Qué cambió | Origen | Criterio de terminado |
|---|---|---|---|---|
| U01 | | | Hallazgo H_ · _ de _ participantes … | |
| U02 | | | Hallazgo H_ · _ de _ participantes … | |
| U03 | Nueva | Espacios físicos o digitales con tareas asociadas | US-05 | Un espacio creado con una tarea asociada se conserva igual al recargar |
| U04 | Nueva | Escritorio 3D con tres mesas y tarjetas editables | US-05 | Elegir mesa, colocar tres tarjetas y guardar; al recargar, la distribución se conserva |
| U05 | Edición | Actividad de los últimos siete días en la pantalla de racha | MVP, Must Have del dashboard | Completar una tarea hoy suma una tarea a la barra del día |

## 4. Prueba en un dispositivo ajeno al equipo

| Campo | Valor |
|---|---|
| Fecha y hora | |
| Persona dueña del dispositivo y su relación con el equipo | No es integrante |
| Marca, modelo y sistema operativo | |
| Navegador y versión | |
| Conexión (datos móviles o wifi) | |
| URL abierta | https://antilia-delta.vercel.app/ |

| Comprobación | Resultado (✓ / ✗) | Evidencia (captura o minuto del video) |
|---|---|---|
| La landing carga completa en menos de 3 segundos | | |
| «Probar Antilia» lleva al acceso | | |
| Registro de una cuenta nueva | | |
| Crear, completar y ver la racha de una tarea | | |
| U01 cumple su criterio de terminado | | |
| U02 cumple su criterio de terminado | | |
| U03 cumple su criterio de terminado | | |
| U04 cumple su criterio de terminado | | |
| U05 cumple su criterio de terminado | | |

La cuenta creada para esta prueba no se usa como participante de la validación ni se cuenta como visita real de la landing.

## 5. Landing frente a los criterios de la Junta

Revisión del contenido publicado en la URL el 25 de octubre de 2026, en vista de celular (375 × 812).

| Criterio | Contenido en la landing | Estado |
|---|---|---|
| Titular con el problema | «Que el desorden no se lleve tu día.» | Cumple |
| Propuesta de valor en una frase | Antilia reúne tareas, espacios y pendientes de correo para saber por dónde empezar y ver el avance | Cumple |
| Cómo funciona en tres pasos | «Hazle un lugar», «Empieza por algo pequeño», «Mira lo que sí lograste» | Cumple |
| Captura real | Sección «Capturas reales de Antilia» con cuenta de demostración | Cumple |
| Llamado a la acción | «Haz espacio para ti», «Probar Antilia», «Descarga ahora» | Cumple |
| Analítica | Contadores de visitas y clics por día, dispositivo y origen; panel en Perfil → Visitas a la landing, con exportación CSV | Cumple. Falta exportar el CSV para el reporte |
| Se entiende en cinco segundos | Pendiente de comprobar con personas del segmento (prueba de cinco segundos en el plan del Release 2) | Por comprobar |

Para la difusión se usan los enlaces con origen: `?utm_source=whatsapp`, `?utm_source=instagram` y `?utm_source=qr`. Las visitas del equipo y de las pruebas técnicas no se reportan como tráfico real.

## 6. Promesas de la landing frente al producto

| Promesa | Función que la respalda | Estado |
|---|---|---|
| Reúne tareas, espacios y pendientes de correo | Inicio, Espacios (C01), Correos y archivos (C04) | Existe |
| Crear un espacio para el escritorio | C01 | Existe |
| Ubicar un pendiente en el tablero | C05 | Existe |
| Consultar la actividad y encender a Lumi | C09 y C10 | Existe |
| Tres mesas 3D y tarjetas con nombres propios | C02 | Existe |
| Pendientes de correo y enlaces a archivos; Gmail solo para cuentas autorizadas del piloto | C04; el límite de Gmail está declarado | Existe con límite declarado |
| Ropa, peinados y accesorios para Lumi | C10 | Existe |
| Estimar medidas desde una foto con referencia rectangular, sin escaneo 3D | C03; el límite está declarado | Existe con límite declarado |
| APK para Android y web añadida a inicio en iPhone | Distribución en `distribucion/` y botón de descarga | Existe |
| Solo se cuentan visitas por pestaña y clics, sin datos personales | Migración 008 y módulo de la landing | Existe |
| Equipo de cinco integrantes | Sección del equipo | Faltan las fotos de cuatro integrantes |

Ninguna promesa de la landing depende de los recordatorios por correo ni de un escaneo 3D.

## 7. Lista «Antes de subir»

| Condición de la Junta | Responsable | Cómo se comprueba | Estado |
|---|---|---|---|
| La URL pública carga desde un dispositivo que no es de nadie del equipo | QA | Sección 4 diligenciada con evidencia | |
| El video tiene voz en off y está grabado sobre la URL real | Responsable del video | Revisar que no aparezcan localhost, Figma ni capturas estáticas | |
| Existe el tag `v0.2` y todos los integrantes tienen commits | Tech Lead | GitHub → Contributors y Tags; cada commit asociado al correo de la cuenta de GitHub de su autor | |
| Los gastos de las dos semanas están registrados, aunque sean $0 | Responsable del reporte | Tabla de costos con proveedor y plan de cada servicio | |
| Ningún participante de la validación es compañero, familiar o amigo | QA | Hoja «Participantes»: columna «Elegible» en «Sí» para todos | |
| Al menos dos updates citan el hallazgo que los originó | QA y Tech Lead | Hoja «Hallazgos»: columna «Update que lo responde»; tabla de la sección 3 | |
| La landing no promete nada que el producto no haga hoy | QA | Sección 6 | |

El tag `v0.2` se crea solo cuando U01 y U02 están publicados y comprobados en la URL, y cuando los commits de todos los integrantes están en la rama principal.
