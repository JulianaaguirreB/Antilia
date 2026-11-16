# Antilia · el universo de Lumi

La versión 0.3.1 toma como referencia el cielo azul oscuro, los acentos dorados y los detalles de constelación de la racha. El resto de las pantallas incorpora cabeceras de cielo nocturno, papel claro para trabajar, tipografía Nunito Sans servida localmente y controles cómodos en celular. La racha conserva su tipografía Inter y sus estilos anteriores: no se modificó el componente de Lumi ni su lógica.

## Nombres que explican la función

La entrada de navegación antes llamada **Digital** se llama **Correos y archivos**. Incluye Gmail, pendientes de correo y enlaces, archivos y carpetas que el usuario organiza. Se conservaron los valores internos de los tipos de tarea y las rutas para no alterar datos existentes.

## Bienvenida

Al iniciar una sesión del navegador aparece el logo de Antilia con un indicador de preparación. Cuando el acceso está listo, una escoba vectorial inspirada en el logo vuela hacia un planeta y aparece **the space is yours**. La secuencia se puede saltar, respeta movimiento reducido y no se repite al cambiar de pantalla ni recargar durante la misma sesión. No muestra porcentajes de carga ficticios.

## Pantallas

Inicio, acceso, registro, recuperación, bienvenida, espacios, tareas, correos y archivos, agenda, recordatorios, perfil, privacidad, sesión de orden, mediciones, métricas y escritorio 3D comparten el nuevo lenguaje visual. La pantalla de la racha queda fuera del tema para conservar su aspecto. Su etiqueta de navegación a correos cambia igual que en el resto de la app.

## Comprobación

- `qa/redesign.cjs`: pantallas públicas y privadas con datos simulados, tamaños 320/390/430, bienvenida, navegación y movimiento reducido.
- `qa/streak-design-preserved.cjs before` y `after`: compara la imagen de la tarjeta de Lumi, con fecha fija y animaciones detenidas. Las capturas quedan locales y excluidas de Git.
- `qa/recorrido-release2.mjs`: registro local, tareas, bandeja, agenda, perfil, mediciones y persistencia real en la base de pruebas.

Las pruebas automatizadas no sustituyen la comprobación táctil y de cámara en teléfonos físicos.
