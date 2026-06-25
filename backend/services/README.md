# Capa de Servicios Externos (Backend) ☁️

Este directorio centraliza la integración con plataformas y servicios de terceros.

## 📂 Archivos Principales

- [**firebase.service.js**](./firebase.service.js): 
  - Inicializa Firebase Admin SDK utilizando credenciales del sistema local.
  - Abstrae los métodos para interactuar con la consola de Firebase.
- [**email.service.js**](./email.service.js):
  - Provee la interfaz para el envío de correos electrónicos transaccionales del portal (códigos OTP para recuperación de contraseña, alertas de confirmación de asesorías y avisos de nuevas postulaciones).
