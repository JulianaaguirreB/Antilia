# Escritorio 3D y medición · versión 0.3.0

En **Espacios → Mi escritorio** puedes elegir una mesa recta, una oficina con cajonera o una mesa en L. Las tres son modelos geométricos 3D incluidos en la app, sin descargas de modelos externos. Introduce ancho, fondo y altura; la mesa en L usa alas del 44 % de sus dimensiones exteriores. Es una plantilla de distribución, no una reproducción exacta de un mueble comercial.

## Distribución personal

Agrega hasta 24 tarjetas con nombres propios, por ejemplo «Portátil», «Despertador» o «Libreta». Cada tarjeta guarda su tamaño en centímetros, color, giro y posición. Puedes arrastrarlas sobre la mesa, tocar una ubicación o usar los controles de posición. Cambia a **Girar y acercar** para explorar el modelo y a **Desde arriba** para colocar objetos con más claridad. **Plano** permite seguir editando si el teléfono no dispone de WebGL.

Toca **Guardar escritorio** para conservar el diseño en tu cuenta. Los escritorios anteriores siguen disponibles y se interpretan inicialmente como mesas rectas de 75 cm de altura. Las tarjetas representan superficies planas: no escanean objetos ni impiden superposiciones entre ellos. El editor mantiene las tarjetas dentro del tablero y fuera del hueco de la mesa en L cuando su tamaño permite colocarlas.

## Ancho y fondo desde una foto

1. Coloca una hoja A4 plana sobre una mesa rectangular, sin doblarla. También puedes utilizar otra referencia rectangular de dimensiones conocidas.
2. Fotografía el tablero completo con buena luz y sus cuatro esquinas visibles.
3. Marca las cuatro esquinas de la referencia: superior izquierda, superior derecha, inferior derecha e inferior izquierda. Repite el mismo orden para el tablero.
4. Revisa el ancho y el fondo estimados, aplícalos y guarda el escritorio.

El cálculo usa una homografía plana para compensar la perspectiva. Descarta cuadriláteros cruzados, puntos degenerados y resultados incompatibles con un rectángulo. La fotografía permanece en el dispositivo. La distorsión de lente, referencias pequeñas o dobladas y una selección imprecisa alteran las medidas. No es ARKit, LiDAR ni un escaneo 3D. Comprueba con una cinta métrica antes de comprar muebles o hacer encajes.

Para una mesa en L introduce las dimensiones exteriores manualmente. En iPhone puedes medir primero con **Medidas de Apple** y escribir aquí sus resultados: Apple no transfiere los valores automáticamente a Antilia. [Guía de Apple](https://support.apple.com/es-co/guide/iphone/iphd8ac2cfea/ios).

## Servidor y verificación

La migración `006_desk_models.sql` añade únicamente `model` y `height_cm` a los escritorios, sin modificar su distribución. Vercel aplica las migraciones pendientes antes de promover una compilación de producción; las vistas previas no migran producción. Cada migración es transaccional y usa el bloqueo del migrador existente.

`node qa/desk-math.cjs` comprueba perspectiva y colocación en L. `node qa/desk3d.cjs` prueba los tres modelos, persistencia real tras recarga, tarjetas y medición en la vista local. Las pruebas del backend comprueban validación y aislamiento por usuario. La cámara nativa y la instalación requieren además comprobarse en teléfonos físicos.
