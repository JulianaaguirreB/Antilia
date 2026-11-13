# Validación final y candidato de lanzamiento

Corte de preparación del 13 de noviembre de 2026. Entrega el 15 de noviembre a las 23:59, Bogotá. Segmento confirmado por el equipo: personal administrativo de empresas medianas de Bogotá.

## Congelamiento

El candidato conserva el código de aplicación de main 48f75fa770042d708875c506c23ffd9ac8a5a195. Desde el 9 de noviembre el historial recibido agrega documentación y registros. Esta preparación no añade funcionalidades. El APK distribuido es 0.3.7, compilación 9; su fecha de construcción y alcance se conservan en distribucion/android/verificacion.json. La validación web debe registrar la URL inmutable del candidato y el dispositivo de cada sesión. El IPA y el APK no se presentan como recompilados en esta entrega.

## Evidencia disponible y población

El Reporte R3 actualizado, Antilia_Release3.pdf, clasifica las cinco respuestas del 25 de octubre como R2, según la aclaración del equipo sobre el cronograma. Reporta SUS 77,5, igual a la referencia R1. Las fuentes previas atribuían esa encuesta a R1. Conservar esta diferencia de atribución; los mismos registros no prueban dos muestras independientes.

El mismo informe documenta siete respuestas R3 del 8 de noviembre. SUS individual 100; 100; 87,5; 100; 100; 80; 100. La media calculada es 95,36. Tres declararon uso previo de R1 y cuatro eran nuevos. Cinco trabajan en microempresas, una en empresa pequeña y una en mediana. Esta muestra sirve como evidencia exploratoria; falta reunir seis participantes elegibles del segmento, con al menos tres nuevos. Confirmar perfil administrativo e independencia de la persona de empresa mediana antes de contarla.

Las encuestas aportan percepción y SUS. El éxito observado y los tiempos históricos por tarea siguen sin registro en los archivos recibidos. No derivar éxito de una respuesta favorable ni reconstruir tiempos a partir de límites.

## Uso instrumentado

CSV verificable del 3 de noviembre: grupo público, 8 sesiones de landing, 5 sesiones con registro, 3 con activación y 0 cuentas con regreso. Ventana efectiva aproximada de 34 minutos. Conversión por sesiones 62,5 % de visita a registro y 60 % de registro a activación. El cero de regreso corresponde a ese corte inicial, sin una ventana posterior de observación.

El pitch reporta 110 visitas, 20 registros y 16 activados, pero falta su CSV con periodo, grupo y unidades para unir esas cifras al reporte final. El pitch cita SUS 84,0; el informe R3 actualizado permite reconstruir 95,36. Usar la fuente trazable y explicitar las diferencias. La ruta del panel es #/analitica.

## Errores conocidos

| ID | Severidad | Reproducción o alcance | Recuperación |
| --- | --- | --- | --- |
| RC-01 | 2 Moderado | Respuesta de completar perdida en TaskRows; reintentar devuelve 404 y conserva tarjeta pendiente. Reproducido localmente. | Recargar reconcilia el estado guardado. |
| RC-02 | 3 para integración externa | Gmail requiere cuentas del piloto autorizadas. | Pendientes manuales disponibles. |
| RC-03 | 1 Menor | Inicio conserva guía anterior y recorrido nuevo. | Se puede usar el recorrido paso a paso. |
| RC-04 | 2 para consolidación | El panel de comparación admite R1/R2, sin una serie R3. | Hoja externa de tres ciclos. |
| RC-05 | 2 Moderado | Dos de siete respuestas exploratorias reportan dificultad con 3D en móvil. | Ajustar con cuidado o usar computador. |

Escala 4 bloquea el trabajo principal; 3 dificulta gravemente una función; 2 requiere recuperación; 1 afecta claridad. La prueba técnica disponible cubre compilación y 39 pruebas backend, más recorrido local real por interfaz en 320/390/768. Las pruebas técnicas no certifican seis usuarios del segmento ni la instalación física Android.

## Protocolo para el cierre

Seis sesiones efectivas y una reserva adicional. Al menos tres usuarios nunca han visto Antilia. Sin compañeros, familia o amigos. Sesión presencial o pantalla compartida en entorno real; consentimiento para notas o grabación. Mantener las cinco tareas base del protocolo R1 y su criterio original; tareas exploratorias adicionales se registran aparte.

T1 crear cuenta y llegar a Inicio en dos minutos. T2 crear una tarea física y otra digital en treinta segundos cada una. T3 completar la física e informar la racha correcta desde Inicio. T4 mostrar solo tareas del computador en veinte segundos. T5 encontrar el récord de racha en treinta segundos. Los usuarios recurrentes requieren una identidad de prueba autorizada para repetir registro sin borrar sus datos; documentar ese condicionamiento.

Registrar por intento inicio, fin, segundos, éxito por criterio, ayuda, bloqueo y referencia de evidencia. Al final, aplicar las diez preguntas SUS en su orden y conservar respuestas. Repetir el mismo código solo cuando exista correspondencia personal verificada. Las encuestas históricas sin código trazable no se emparejan por su orden.

## Plan del MVP del 22 de noviembre

Los cinco primeros cambios se derivan de la encuesta exploratoria R3 y de revisión de interfaz. Validar su prioridad con la muestra objetivo. El sexto nace de un fallo técnico reproducido. Se planean para el MVP, sin implementarse durante la validación.

| # | Cambio | Hallazgo y fuente | Criterio |
| --- | --- | --- | --- |
| 01 | Precisión táctil de tarjetas 3D | HF-01: dos de siete reportan dificultad; tabla 12C. | Mover dos tarjetas en Android web y recuperar posiciones guardadas al recargar. |
| 02 | Claridad al guardar y completar correo | HF-02: una de siete reporta dificultad; tabla 12C. | Crear y completar correo en una secuencia con confirmación y persistencia. |
| 03 | Filtros visibles y conservados | HF-03: percepción de unificación 4,29/5; tabla 12B. | Volver a Pendientes conservando tipo, estado, espacio y resultados. |
| 04 | Ubicación clara tras restaurar | HF-04: percepción de espacios 4,43/5; tabla 12B. | Restaurar y abrir el espacio desde la confirmación con contador correcto. |
| 05 | Orientación contextual única | HF-05: continuidad 4,57/5 y duplicación observada en main. | Identificar una acción principal y retomar espacio/tarea desde Perfil. |
| 06 | Reconciliar estado tras error de red | HT-01: reproducción técnica RC-01. | Perder respuesta y recuperar estado completado sin duplicación ni bucle de 404. |

## Cierre humano de la entrega

Faltan la muestra objetivo, cronometraje y éxito por tarea, el CSV actualizado de uso y regreso, la prueba desde dispositivo ajeno, el video narrado de Juan Fernando y Nicolás con permisos o recreaciones identificadas y los gastos reales del 9 al 15 de noviembre. El último periodo económico documentado con cero desembolsos es el de R3. No asumir cero en un periodo posterior por falta de comprobantes.

La viabilidad revisada recibida usa una hipótesis de suscripción por usuario de 15.000 COP/mes, 37 pagadores de equilibrio operativo y 101 con adquisición. El pitch conserva 34 y 93. Adoptar la revisión como referencia de la hipótesis comercial vigente y mantener el cobro B2B por oficina como experimento posterior. La demanda empresarial y la recuperación de inversión requieren sus propias evidencias.



## Publicación del candidato comprobada

Tag v1.0-rc en a2a224a141a84853d20e7899876886ef97da671a, publicado el 13 de noviembre. El código de aplicación coincide con main 48f75fa. Despliegue dpl_DoQrvnPM87YbGyk65WrwkDwKpjpX en estado Ready. La URL https://antilia-delta.vercel.app/ responde 200, la API health responde ok y las rutas privadas de analítica y comparación responden 401 sin sesión. Health conserva v0.3 porque no se modificó el código congelado.

Vercel protege el enlace de despliegue antilia-44qkqsne1-antilia1.vercel.app y el alias antilia-v10-rc.vercel.app con autenticación de la cuenta. Las sesiones externas usan la URL pública de producción mientras se mantiene el congelamiento. Registrar commit, versión y fecha junto con cada evidencia.

El reporte actualizado Antilia_Release3.pdf, aportado después del pitch, confirma siete respuestas R3 el 8 de noviembre con SUS 95,36. Solo una corresponde a empresa mediana; el segmento continúa limitado a empresas medianas por confirmación del equipo. Las cinco primeras mejoras planeadas son hipótesis a contrastar con el segmento. La precisión táctil 3D tiene dos dificultades declaradas, correos una y la unificación recibe 4,29/5. Los datos todavía no incluyen tiempos observados por tarea.

Los documentos de validación final preparados conservan estas limitaciones. No se publicó una encuesta ficticia ni se cambiaron funcionalidades durante esta preparación.
