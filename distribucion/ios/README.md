# Instalar Antilia en iPhone

[Descargar Antilia para iPhone](https://github.com/JulianaaguirreB/Antilia/raw/refs/heads/developer/distribucion/ios/Antilia-iPhone.ipa)

Este IPA sin firma es Antilia **0.3.1, compilación 13**, compilado desde cero con Xcode el 23 de octubre de 2026 a partir del código `dc11773`. Incluye el nuevo diseño inspirado en Lumi, bienvenida animada con escoba y planeta, navegación Correos y archivos, tres mesas 3D, tarjetas con nombres y posiciones, medición fotográfica de ancho y fondo con corrección de perspectiva, tareas, sesiones de orden, Lumi, Gmail de solo lectura y recuperación por correo. Se conecta al servidor público y a los datos existentes de Antilia; requiere iOS 15 o posterior e internet. Es arm64 para un iPhone real, no para simulador.

1. Descarga el archivo `.ipa` en tu computador.
2. Conecta y desbloquea tu iPhone. Abre Sideloadly y selecciona el dispositivo.
3. Arrastra el IPA a Sideloadly e ingresa tu Apple ID directamente en esa aplicación.
4. Inicia la firma e instalación. Sigue las indicaciones del iPhone para confiar en el perfil y habilitar el modo desarrollador si lo requiere.
5. Abre Antilia desde su ícono e inicia sesión. En Espacios puedes abrir Mi escritorio guardado y Medir espacio. En Progreso aparece Lumi.

El archivo no contiene un perfil de Apple ni una cuenta personal. Cada usuario debe firmarlo con su cuenta. La vigencia y renovación dependen del tipo de cuenta. Consulta los requisitos oficiales de Sideloadly: https://sideloadly.io/faq.

La huella SHA-256 está en `Antilia-iPhone.sha256`. En PowerShell puedes comprobarla con `Get-FileHash .\Antilia-iPhone.ipa -Algorithm SHA256`.

La compilación de este paquete está en [GitHub Actions](https://github.com/JulianaaguirreB/Antilia/actions/runs/39969243179). El flujo crea un IPA nuevo cuando cambia el frontend en developer; actualizar este archivo distribuido requiere descargar y comprobar esa nueva compilación. Este paquete no se actualiza automáticamente dentro del iPhone.

La cámara estima ancho y fondo con una referencia rectangular y corrección de perspectiva; no realiza escaneo 3D ni conteo automático de objetos. Puedes introducir manualmente las medidas tomadas con Medidas de Apple. Los modelos 3D son mesas editables incluidas en Antilia. Gmail y la recuperación por SMTP ya están activos en el servidor. En el iPhone, la autorización de Google usa el navegador nativo; al terminar, ciérralo para volver a Antilia y actualizar la conexión. Google mantiene el piloto limitado a sus usuarios de prueba autorizados. La instalación y permisos todavía deben comprobarse en el iPhone físico.


Para actualizar una instalación existente, usa el mismo Apple ID y conserva el identificador `co.antilia.app`. No borres la app que funciona. Este archivo no corrige errores de inicio de sesión de Apple: Sideloadly todavía debe poder autenticar y firmar. Se comprobaron integridad ZIP, plists, arquitectura iPhone, plugins de cámara y navegador, versión y dirección del servidor; la instalación en el dispositivo físico sigue pendiente.
