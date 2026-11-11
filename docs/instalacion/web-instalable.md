# Antilia en el celular

Antilia es una aplicación web instalable (PWA). Usa la misma cuenta y el mismo backend de la web. No es una app nativa ni se distribuye como APK o desde Play Store. Necesita internet para consultar y guardar tareas; el computador del equipo puede permanecer apagado.

## Android

1. Abre https://antilia-delta.vercel.app en Chrome, fuera del navegador interno de WhatsApp.
2. Toca **Instalar Antilia en este dispositivo** si aparece. También puedes abrir el menú ⋮ y elegir **Instalar aplicación** o **Agregar a pantalla de inicio**.
3. Confirma y abre Antilia desde su ícono. Debe abrir en su propia ventana, sin la barra de direcciones.

## iPhone

1. Abre https://antilia-delta.vercel.app en Safari.
2. Toca **Compartir → Agregar a pantalla de inicio**. Si aparece **Abrir como app**, actívalo.
3. Confirma **Agregar** y abre Antilia desde el ícono.

Si no aparece la opción, confirma que abriste el enlace en el navegador del celular y no dentro de otra aplicación. Los nombres del menú dependen del navegador y su versión.

## Prueba para la demo

En un celular ajeno al equipo: instalar, abrir desde el ícono, iniciar sesión, crear una tarea, completarla, comprobar la racha, cerrar y volver a abrir. Al desactivar internet y volver a abrir, debe aparecer un aviso claro; después de recuperar conexión, tocar **Volver a intentar**. No se guardan tareas sin internet ni se almacena la API en caché.

Registrar modelo del celular, sistema, navegador, fecha y resultado. Una emulación no reemplaza esta prueba. Las comprobaciones técnicas automatizadas pasaron 13 casos: manifiesto, íconos, requisitos de Chromium, ayuda, cancelación, detección de instalación, ancho móvil, pantalla sin red y recuperación.

Para repetirlas: compilar el frontend, iniciar su servidor de vista previa y ejecutar `node qa/instalacion.mjs` con `BASE_URL` apuntando a ese servidor. Las pruebas del diálogo de instalación simulan el evento; la revisión de requisitos usa Chromium real. El escenario de iPhone verifica las instrucciones por dispositivo, no la instalación real en Safari.

Esta implementación no activa correo automático, notificaciones push ni sincronización de archivos. Esas funciones no se obtienen solamente al instalar la app.

Equipo: Alejandro Macías, Juan Fernando Herrera, Juliana Aguirre Ballesteros, Samuel Montealegre y Nicolás Silva García.
