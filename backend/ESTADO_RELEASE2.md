# Avance y pendientes de Release 2

Revisión del 16 de octubre de 2026. Es un avance de desarrollo, no una declaración de entrega completa.

## Alcance de semanas 9 a 15

| Semana | Avance implementado |
|---|---|
| 9 | Registro, login, validación de datos y acceso protegido |
| 10 | Creación, consulta y edición de tareas físicas y digitales |
| 11 | Estados de tareas, turnos y persistencia al recargar |
| 12 | Configuración de recordatorios, verificación de correo, historial y reintentos |
| 13 | Rachas y estadísticas personales por fecha de Bogotá |
| 14 | Espacios, organización física, pendientes de correos y archivos, tablero y archivo de pendientes |
| 15 | Integración de pantallas, manejo de errores, protección entre usuarios, migraciones repetibles y pruebas |

Los recordatorios son programados por horario: todavía no aprenden hábitos. No hay conexión a Gmail, sincronización de archivos, cámara 3D ni gráficos colectivos. El tablero, los turnos y las estadísticas se actualizan al consultar o realizar cambios; no se implementó sincronización instantánea entre dispositivos.

## Cambios candidatos a updates

Solo podrán contarse cuando estén en la URL pública y sean comprobables por el usuario. No se les asignan hallazgos inventados.

| # | Cambio | Criterio observable | Origen |
|---|---|---|---|
| 1 | Crear y editar espacios | Se conserva el nombre al recargar | Alcance de organización física |
| 2 | Tablero de tareas | Mover pendiente a en curso y hecho guarda el estado | Alcance de organización digital |
| 3 | Agenda | Guarda un turno y rechaza horarios cruzados | Alcance de actividades y turnos |
| 4 | Editar perfil | Guarda nombre; exige contraseña para cambiar correo | Alcance de cuenta |
| 5 | Organizar correos y archivos como pendientes | Guarda un pendiente con enlace HTTPS | Bocetos del equipo |
| 6 | Configurar recordatorios | Guarda borrador; con servicios reales permite activar y consultar envíos | Alcance de recordatorios |

## Evidencia técnica local

Pasaron 16 pruebas de backend, 33 comprobaciones de API existentes y 13 comprobaciones del recorrido móvil. La compilación de producción pasó. Se revisaron capturas de espacios, tablero y recordatorios. Las pruebas incluyen aislamiento de datos, horarios concurrentes, recuperación de acceso, caducidad de códigos y prevención de envíos duplicados. Esto no reemplaza una validación con usuarios reales.

## Pendientes para entregar el 25 de octubre

- Configurar correo real y programador; comprobar entrega real y recuperación de acceso.
- Publicar las mejoras con una base preparada y comprobar la URL desde un celular ajeno al equipo.
- Validar con al menos cinco personas del segmento, sin compañeros, familiares ni amigos; registrar tareas, resultados y SUS.
- Priorizar hallazgos reales y vincular al menos dos cambios visibles con sus identificadores.
- Preparar la landing pública con captura real, llamada a la acción y analítica. No cuenta como update.
- Preparar video narrado de dos a tres minutos y reporte PDF con tabla de updates y costos, aunque sean cero.
- Definir usuarios y tareas de validación del 26 de octubre al 8 de noviembre.
- Verificar contribuciones de todos y crear el tag v0.2 cuando corresponda a la entrega comprobada.

No se creó v0.2 ni se publicaron estas mejoras sobre main en este avance.
