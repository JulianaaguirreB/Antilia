# Release 3 en preparación

Estado técnico actualizado: 3 de noviembre de 2026. Los apartados de publicación conservan el historial de cada avance. Entrega: 8 de noviembre a las 23:59 de Bogotá; demo: 12 de noviembre. El primer bloque técnico está publicado en Vercel y en developer. La validación académica y los cambios basados en hallazgos siguen pendientes; no se creó el tag v0.3.

## Primer update de instrumentación

Instrumentación de registro, activación y regreso con panel privado y embudo. Origen: requisito de la Junta, no un hallazgo de validación inventado. Cuenta como un solo update, incluyendo su panel y exportación.

Criterio de terminado técnico: una visita medida, una cuenta creada y las dos acciones de activación aparecen en el panel sin duplicarse con recargas o solicitudes concurrentes; el regreso se cuenta al abrir la app con sesión iniciada en otro día de Bogotá. El panel actualiza cada 15 segundos si está visible y permite exportar evidencia CSV.

La ruta de eventos en producción aceptó una visita clasificada como prueba. El inicio real de medición lo fija la migración de la base publicada; registro, activación y regreso se guardan con la actividad nueva, sin reconstruir historial. Los números de la vista local son datos de demostración; no se presentan como participantes del segmento ni resultados de producción.

## Qué se mide

- Registro: el servidor guarda el evento dentro de la transacción que crea la cuenta. El correo de bienvenida conserva su funcionamiento y su reintento independiente.
- Activación: una cuenta registrada durante la medición crea un espacio y completa una tarea, en cualquier orden. Se cuenta una vez por cuenta, con acciones posteriores al inicio de la medición.
- Regreso: la app visible comunica actividad autenticada; el servidor compara la fecha con el último día medido y registra como máximo un regreso por cuenta y día de Bogotá. Las recargas del mismo día no son nuevos regresos.
- Visita: una sesión aleatoria por pestaña, sin huella del dispositivo. No equivale a una persona única. El origen queda limitado a directo, WhatsApp, Instagram, QR u otro.

Las cuentas existentes empiezan a medirse cuando vuelven a abrir el cliente actualizado. No se inventan registros ni activaciones anteriores. El APK 0.3.5 incorpora el aviso de actividad y el panel. Los IPA que no se hayan reconstruido con este código siguen necesitando una actualización.

## Unidades del embudo

El embudo sigue sesiones con visita, registro y activación dentro del rango elegido. Una sesión con varias cuentas representa una conversión por paso, para evitar porcentajes superiores al 100 %. Las cuentas nuevas y las activadas también se muestran por separado como cuentas únicas. Los registros sin visita dentro del periodo quedan fuera del embudo de sesiones y aparecen como una cifra aparte.

El mayor abandono se identifica por cantidad de sesiones perdidas. No es una prueba de su causa. Una activación posterior al corte no se atribuye a un periodo anterior. Se conserva el panel de contadores históricos de landing, sin convertir esos agregados en personas o eventos detallados.

## Acceso y privacidad

El panel se abre desde Perfil, Analítica y embudo, o #/analitica. El servidor exige sesión, correo verificado y pertenencia a LANDING_ANALYTICS_ADMINS. No basta con ocultar el botón. No se muestran correos, identificadores de cuentas ni contenido de tareas en el feed o el CSV.

La landing y Privacidad ofrecen un control de medición para ese dispositivo. Se respetan DNT y GPC. Desactivar la medición afecta eventos futuros; no borra eventos existentes. Los eventos usan identificador interno de cuenta y sesión de pestaña, fecha, tipo, origen y clase de dispositivo. No incluyen contraseñas, IP, contenido laboral o mensajes de Gmail.

Las cuentas administradoras y las marcadas por el equipo se separan del público. Las visitas vinculadas a esos registros también se reclasifican. Las pruebas anónimas sin marca no pueden reconocerse automáticamente: usar ?analytics_test=1 desde el primer acceso. Ese modo se conserva en la pestaña y afecta su grupo de medición.

## Comprobaciones

- npm run test:release3 --prefix backend: 38 pruebas del servidor, incluidas deduplicación, concurrencia, privacidad, correo verificado, autorización, primer origen y rollback si falla una conversión. Se fuerza un error controlado en una prueba para verificar que no queda una tarea completada sin su evento; ese error esperado no indica un fallo de la suite.
- node qa/analytics-context.cjs: sesión estable, origen permitido, modo prueba, DNT, GPC y preferencia local.
- qa/release3-analytics.cjs: recorrido real local por la interfaz, sin respuestas de API simuladas; visita, registro, activación, CSV sin datos personales, actualización automática, filtros, navegación y exclusión de medición. Anchuras 320, 390 y 768.
- npm run build --prefix frontend: compilación del cliente.

Todo usa bases PostgreSQL locales aisladas y correo desactivado o transporte simulado. No hay envíos de prueba externos ni datos de participantes fabricados.

## Para completar la entrega

Se necesitan los resultados reales de validación de R2 y las tareas de R1 para definir al menos tres updates basados en hallazgos identificables. Con instrumentación y comparación implementadas, faltan al menos tres updates por seleccionar desde hallazgos reales y comprobar; no se cuentan partes del panel como varios cambios. La comparación debe incluir éxitos por tarea, tiempos promedio, SUS de ambos ciclos, dos participantes que repitan y las mejoras y retrocesos observados.

También faltan el video narrado sobre la URL pública, el protocolo final con usuarios agendados, costos reales del periodo, comprobación externa de acceso y participación auténtica de todos los integrantes. La instrumentación no sustituye esas evidencias. El tag v0.3 se prepara cuando se apruebe el alcance final y estén listos los cinco updates.

## Publicación comprobada el 3 de noviembre

- URL pública: https://antilia-delta.vercel.app/
- Panel privado: https://antilia-delta.vercel.app/#/analitica. Requiere cuenta autorizada con correo verificado.
- Despliegue: dpl_BFkihEE2rHhWxMc6bUqawiZ14GGo, con el código de a6ebde2.
- APK: https://antilia-delta.vercel.app/downloads/antilia.apk?v=7, versión 0.3.5, compilación 7, 10470087 bytes.
- SHA-256 del APK: ba31f5974b1aa0040919cd5c1c40da6e6b6edd69c952644be7a40a5f2155ee0a.
- Firma y alineación verificadas; conserva la firma de distribución anterior. La comprobación en teléfono Android físico sigue pendiente.
- La descarga real en la URL pública coincide con esa huella y las cabeceras de APK. El evento de comprobación quedó marcado como test, fuera del grupo del público. No se crearon cuentas sintéticas en producción ni se enviaron mensajes de prueba.
- Las rutas del panel y de actividad devuelven 401 sin sesión. Las 38 pruebas del servidor y los recorridos de interfaz se realizaron en entornos locales aislados.

La instrumentación cuenta como un update y la comparación se registra como otro candidato. La entrega completa y el tag v0.3 siguen pendientes de al menos tres cambios desde hallazgos y de las evidencias reales de validación.


## Comparación de validaciones

Segundo avance técnico: sección privada `#/comparacion`, accesible desde el embudo. Permite registrar el protocolo original de tres a cinco tareas, con criterios y fecha; transcribir sesiones R1/R2 mediante códigos de participante y referencias de evidencia; calcular SUS con las diez respuestas originales y comparar éxito y tiempo promedio por tarea. Cuenta como candidato a un segundo update verificable, con origen en el requisito de comparación de la Junta; no se atribuye a un hallazgo inexistente.

Los participantes repetidos se identifican mediante el mismo código en ambos ciclos. Se exige permiso para guardar la sesión; los registros fuera del segmento, relacionados con el equipo o asistidos se conservan fuera de las métricas. La comparación avisa si no hay cinco participantes elegibles por ciclo y dos repetidos. El SUS se expresa en puntos, nunca como porcentaje. Los promedios de tiempo incluyen éxitos y fallos; las diferencias pueden mostrar retrocesos.

La exportación CSV incluye el resumen, códigos, referencias y respuestas SUS, sin nombres ni correos. Las correcciones y exclusiones conservan una revisión de los datos anteriores en la base. El protocolo queda inmutable para no cambiar las tareas retrospectivamente; si hay otra versión debe registrarse aparte. Estos registros manuales no se mezclan con el embudo automático.

Verificación local: las 38 pruebas del servidor pasaron. `qa/release3-comparison.cjs` comprobó el recorrido de protocolo, sesiones, SUS, repetidos, corrección, exclusión y restauración, exportación protegida de fórmulas y ausencia de desbordes en 320, 390 y 768 píxeles. Solo se usaron ejemplos claramente marcados en la base local con correo desactivado. La herramienta no acredita por sí sola que la validación se haya ejecutado.

Quedan por definir y construir al menos tres updates desde hallazgos reales de R2. No se creó el tag v0.3.


## Publicación de la comparación comprobada

El 3 de noviembre se publicó el código de `6271f2f` en el despliegue `dpl_8Tdj4SphAT43x24CCgQYhYzesw9f`, con alias https://antilia-delta.vercel.app. Los logs confirman la migración 011 completada y la compilación correcta. La landing responde 200 y `/api/validation/protocols` responde 401 sin sesión. No se cargaron sesiones ficticias en producción.

La comparación está en https://antilia-delta.vercel.app/#/comparacion para cuentas autorizadas. El APK 0.3.6, compilación 8, se descarga desde https://antilia-delta.vercel.app/downloads/antilia.apk?v=8. Tamaño: 10474183 bytes. SHA-256: f18f5767686d695af80f5a9c8c82247455782f2e36c30190f3996b83a22421ad. La descarga pública coincide con esa huella; se comprobaron cabeceras de archivo Android, firma previa, alineación de 16 KB y recursos compilados. La instalación física sigue pendiente. El IPA no se modificó en este bloque.


## Alcance técnico para la entrega

Se completaron cinco cambios verificables. La validación R2 no se ha realizado, según confirmó el equipo; por eso no se declara cumplido el requisito de tres cambios nacidos de esa validación. El material recibido tiene las cinco respuestas del 25 de octubre identificadas como validación R1 en el reporte, SUS promedio 77,5. No contiene tiempos medidos ni tasas observadas de éxito. No se importaron opiniones de facilidad como éxitos o tiempos en el panel.

| # | Cambio | Origen real | Criterio verificable |
| --- | --- | --- | --- |
| 01 | Instrumentación y embudo privado | Requisito de la Junta R3 | Visita, registro, activación y regreso se guardan con acciones nuevas; panel y CSV separan pruebas del público. |
| 02 | Comparación R1/R2 | Requisito de la Junta R3 | Con un mismo protocolo y sesiones reales calcula SUS, éxito, tiempo y repetidos; vacío muestra Sin datos; correcciones y exclusiones conservan historial. |
| 03 | Recorrido guiado accionable y acceso destacado en Inicio | H1/H2 de R1 como antecedente, decisión de producto pendiente de revalidar | Desde Inicio se crea espacio, se agrega una tarea asociada y se completa sin salir del recorrido; tres pasos se reconstruyen desde la cuenta al recargar. |
| 04 | Espacios localizables y recuperables | H3 de R1: una respuesta neutral sobre crear/encontrar espacios | Busca por nombre/descripción sin tildes, filtra por tipo, ordena, muestra pendientes y completadas; restaura un archivado sin perder historial ni exponer cuentas ajenas. |
| 05 | Bandeja unificada de pendientes | H1/H2 de R1 como antecedente, decisión de producto pendiente de revalidar | Reúne pendientes físicos y digitales; busca por tarea/espacio y filtra estado, fecha de Bogotá y espacio; permite crear, editar y completar desde la lista. |

No se cuentan subcomponentes de instrumentación como updates separados. Los cambios 03–05 usan antecedentes conocidos o decisiones de producto, no hallazgos de R2. Tener cinco cambios técnicos no demuestra el cumplimiento académico completo.

Rutas para la demo: `#/primeros-pasos`, `#/espacios`, `#/pendientes`, `#/analitica` y `#/comparacion`. La guía también se abre desde Perfil. Las tarjetas nuevas no modifican el cuadro de racha ni el vestidor de Lumi. La guía mantiene su avance por datos guardados en la cuenta, no por marcas ficticias en el navegador.

Comprobaciones: 39 pruebas backend aprobadas, incluidos aislamiento y restauración de espacios con tareas; `qa/release3-experience.cjs` ejecuta el recorrido por la interfaz contra base local aislada con correo desactivado, filtros vacíos, búsqueda sin tildes, recarga, racha y restauración. Anchos 320/390/768 sin desbordes. La navegación Android se comprobó con puente simulado (`qa/android-back.cjs`); el teléfono físico sigue pendiente.

La URL de producción y el APK contienen el código de la entrega. Quedan fuera del alcance de código la ejecución real de las validaciones, al menos dos participantes repetidos, las evidencias y tiempos originales, el video narrado, el plan final con usuarios agendados, costos reales y los commits auténticos de cada integrante. El equipo debe resolver además la diferencia entre las tareas del protocolo R1 y las nuevas tareas propuestas para R2 antes de afirmar que las métricas son comparables. No se completan esos datos automáticamente.


## Paquete técnico v0.3

APK 0.3.7, compilación 9: 10478279 bytes; SHA-256 401ca0b5ff5c76a3dbafc24acd9f2522f1b2c08b7ae3f2ce08d1e6d736a00fe1. Mantiene firma anterior y alineación de 16 KB. La etiqueta v0.3 identifica el código y los cinco cambios técnicos enumerados; no acredita validaciones, video ni los tres orígenes de R2 pendientes. El IPA distribuido no se actualiza con este bloque.


## Publicación final del código — 5 de noviembre de 2026

Rama developer publicada; etiqueta v0.3 en 894b56f. Despliegue de producción dpl_BJQxbXezqp3r42p371cG6b3zqy32, alias https://antilia-delta.vercel.app. La API health informa v0.3. La landing carga (200), el paquete público contiene primeros-pasos, pendientes, comparación y analítica, y las rutas de datos privados devuelven 401 sin sesión.

La descarga pública https://antilia-delta.vercel.app/downloads/antilia.apk?v=9 coincide con el APK firmado 0.3.7, compilación 9, y su SHA-256 registrado. La prueba de descarga confirmó botón Android, cabeceras de APK y ausencia del instalador incompatible en iPhone. No se crearon cuentas de prueba ni registros de validación ficticios en producción. Las pruebas con acciones de usuarios se realizaron solo en local.

El código técnico está publicado; la instalación física Android y las condiciones académicas pendientes se mantienen declaradas. La etiqueta no sustituye la validación R2 ni sus hallazgos.
