# Instalar Antilia en iPhone

[Descargar Antilia para iPhone](https://github.com/JulianaaguirreB/Antilia/raw/refs/heads/developer/distribucion/ios/Antilia-iPhone.ipa)

Este IPA sin firma corresponde al código `b24ce29`, compilado el 21 de octubre de 2026. Incluye el nuevo ícono de constelación, sesiones de cinco minutos y Astra, distribución del escritorio guardada en el servidor, medición fotográfica calibrada y tareas. Requiere iOS 15 o posterior y conexión a internet. No es un paquete para simulador.

1. Descarga el archivo `.ipa` en tu computador.
2. Conecta y desbloquea tu iPhone. Abre Sideloadly y selecciona el dispositivo.
3. Arrastra el IPA a Sideloadly e ingresa tu Apple ID directamente en esa aplicación.
4. Inicia la firma e instalación. Sigue las indicaciones del iPhone para confiar en el perfil y habilitar el modo desarrollador si lo requiere.
5. Abre Antilia desde su ícono e inicia sesión. En Espacios puedes abrir Mi escritorio guardado y Medir espacio. En Progreso aparece Astra.

El archivo no contiene un perfil de Apple ni una cuenta personal. Cada usuario debe firmarlo con su cuenta. La vigencia y renovación dependen del tipo de cuenta. Consulta los requisitos oficiales de Sideloadly: https://sideloadly.io/faq.

La huella SHA-256 está en `Antilia-iPhone.sha256`. En PowerShell puedes comprobarla con `Get-FileHash .\Antilia-iPhone.ipa -Algorithm SHA256`.

La compilación original está en [GitHub Actions](https://github.com/JulianaaguirreB/Antilia/actions/runs/39663523344). El flujo crea un IPA nuevo cuando cambia el frontend en developer; actualizar este archivo distribuido requiere descargar y comprobar esa nueva compilación. Este paquete no se actualiza automáticamente dentro del iPhone.

La cámara mide por proporción con una referencia conocida; no realiza escaneo 3D ni conteo automático de objetos. Los envíos de correo siguen pendientes de configurar proveedor y remitente. La instalación y permisos todavía deben comprobarse en el iPhone físico.
