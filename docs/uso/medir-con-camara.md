# Medir espacio con cámara

En Android e iPhone, abre **Espacios → Mi escritorio → Medir ancho y fondo con cámara**. La cámara nativa se solicita solo al tocar **Tomar foto de la mesa**; también puedes elegir una foto. En web, el selector del teléfono ofrece captura o biblioteca según el navegador. Si deniegas el permiso, puedes revisarlo en Ajustes o introducir las medidas manualmente.

Coloca una hoja A4 plana sobre un tablero rectangular y fotografía todas sus esquinas con buena iluminación. Marca primero las cuatro esquinas de la referencia y después las cuatro del tablero, siempre en este orden: superior izquierda, superior derecha, inferior derecha e inferior izquierda. Introduce el tamaño correcto de la referencia; no presupongas que cualquier hoja es A4.

El resultado muestra ancho y fondo estimados. **Usar ancho y fondo** los aplica al escritorio; **Guardar escritorio** conserva ambas dimensiones y el diseño en tu cuenta. En **Medir espacio**, la misma herramienta permite copiar solo el ancho al registro de organización, junto con los minutos y conteos manuales.

El cálculo corrige la perspectiva con una homografía plana y rechaza referencias degeneradas o esquinas incoherentes. No usa ARKit ni LiDAR, no identifica objetos y no determina su cantidad. Una referencia pequeña, una hoja doblada o la distorsión de la lente pueden alterar el resultado. Comprueba con una cinta métrica si necesitas precisión para instalar o comprar muebles. La foto se procesa localmente y no se sube al servidor.

Para una mesa en L, mide el ancho y fondo exteriores e introdúcelos manualmente. En iPhone puedes usar **Medidas de Apple** y transcribir los centímetros al formulario: no hay transferencia automática entre ambas apps.

Las pruebas `qa/desk-math.cjs` y `qa/desk3d.cjs` comprueban una fotografía sintética de 120 × 70 cm con perspectiva, la aplicación de ambos valores y su persistencia al recargar. Se verificó el guardado y el aislamiento por usuario en la API. Captura, cancelación y permisos siguen necesitando verificación en Android e iPhone físicos. Para el piloto, registra medida real, estimación, diferencia, iluminación y posición del teléfono; no atribuyas precisión validada antes de medirla.

[Guía completa del editor 3D y sus límites](../ESCRITORIO_3D.md).
