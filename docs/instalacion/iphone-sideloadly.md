# Antilia para iPhone con Sideloadly

La app iOS usa las pantallas incluidas en el paquete y consulta el backend HTTPS de Antilia en Vercel. No requiere que el computador esté encendido para usarla. Necesita internet para consultar y guardar tareas.

## Generar el IPA

La compilación está en GitHub Actions, flujo **Crear IPA de Antilia**. Se ejecuta en macOS con Xcode 26 y genera un binario para dispositivos iOS, no para simulador. Al terminar correctamente, el artefacto **Antilia-iPhone-Sideloadly** contiene `Antilia-sin-firma.ipa` y su hash SHA-256. El IPA necesita firma antes de instalarse; Sideloadly realiza ese paso con la cuenta del usuario.

## Instalar

1. Descarga y extrae el artefacto de la compilación correcta.
2. Abre Sideloadly oficial en Windows. Sigue sus requisitos de iTunes e iCloud: https://sideloadly.io/faq.
3. Conecta el iPhone por cable, desbloquéalo y acepta **Confiar en este computador** si aparece.
4. Selecciona tu iPhone y arrastra `Antilia-sin-firma.ipa` a Sideloadly.
5. Ingresa tu Apple ID directamente en Sideloadly e inicia la instalación. No compartas contraseña ni códigos con el equipo ni los guardes en GitHub.
6. Sigue las indicaciones de confianza del perfil y modo desarrollador que muestre iOS. Las restricciones y la renovación de la firma dependen de tu cuenta y versión de iOS.
7. Abre Antilia desde el ícono, inicia sesión, crea y completa una tarea y verifica la racha. Cierra y vuelve a abrir para comprobar persistencia.

No se ha comprobado una instalación física hasta realizar esos pasos en el iPhone. Generar el IPA no demuestra que ya esté instalado. No hay publicación en App Store ni se incluyen servicios de correo que aún no estén configurados.

Equipo: Alejandro Macías, Juan Fernando Herrera, Juliana Aguirre Ballesteros, Samuel Montealegre y Nicolás Silva García.
