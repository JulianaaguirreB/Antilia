# Pantallas y alcance de Antilia

Referencia visual: PDF de Figma entregado el 21 de octubre de 2026. El documento contiene 17 pantallas y dos fotografías de los bocetos. Se conserva la organización del diseño con datos reales y las funciones del cronograma de semanas 9 a 16.

| Pantalla de referencia | Implementación |
|---|---|
| Inicio con marca | Bienvenida y acceso desde el ícono iOS |
| Empezar y acceso | Registro y login con correo y contraseña; no se simulan botones de Google o Apple |
| Principal | Progreso y tareas físicas y digitales del usuario |
| Organización física | Espacios, descripción y sus tareas |
| Organización digital | Rutinas digitales y actividad de los últimos siete días |
| Mi racha | Racha, récord y conteos de tareas reales |
| Limpieza de correos | Pendientes con referencias agregadas por el usuario; no es un buzón conectado |
| Métricas y logros | Actividad personal, sin ranking ni personas inventadas |
| Orden del escritorio | Esquema orientativo y tareas físicas reales |
| Mi cuenta | Perfil, tareas hechas y opciones de configuración |
| Modificar perfil | Formulario de edición; cambio de correo exige contraseña |
| Medir espacio | Registro manual de minutos buscando, objetos fuera de lugar y ancho despejado opcional |
| Limpieza de archivos | Pendientes y enlaces; no inspecciona ni elimina archivos del dispositivo |
| Recordatorios | Horarios y borradores; envíos reales requieren proveedor y programador |
| Cerrar sesión | Confirmación y conservación de datos en el servidor |
| Estado general | Porcentaje de tareas completadas y desglose físico y digital; no es un índice validado del desorden |
| Recuperar contraseña | Código privado de un uso; requiere proveedor de correo configurado |

La medición manual da una línea base y un historial para comparar durante el piloto. El equipo debe acordar un protocolo consistente y conseguir evidencia con usuarios reales. Sus resultados no se infieren de una racha ni del número de tareas.

## Servidor y distribución

El cliente iOS incluye la interfaz y llama a la API HTTPS de Vercel. PostgreSQL de Neon guarda los datos por usuario. No utiliza localhost ni incluye claves de la base en el IPA. Cambiar las pantallas requiere generar e instalar un nuevo IPA; los cambios de datos se consultan en el servidor.

La migración `003_measurements.sql` agrega las mediciones; requiere aplicarse antes de usar esa pantalla en producción. Conservar las migraciones anteriores y respaldar antes de cambiar datos reales.

El Excel menciona Firebase Auth, pero el sistema implementado usa JWT y contraseñas con hash. No se cambió el proveedor de identidad para adaptar el diseño. Las hipótesis siguen siendo supuestos por validar; no se inventan tasas de apertura, retención o mejora del desorden.

Equipo: Alejandro Macías, Juan Fernando Herrera, Juliana Aguirre Ballesteros, Samuel Montealegre y Nicolás Silva García.
