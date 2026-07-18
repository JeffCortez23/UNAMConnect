# UNAMConnect - Backend API 🚀

Este es el servidor API REST que proporciona la lógica de negocio, acceso a datos e integraciones de seguridad para el sistema UNAMConnect. Está desarrollado utilizando Node.js, Express y PostgreSQL bajo una arquitectura limpia **MVC**.

## 🛠️ Stack Tecnológico
* **Core:** Node.js, Express
* **Base de Datos:** PostgreSQL (Cliente relacional `pg`)
* **Autenticación & Seguridad:** JSON Web Tokens (JWT), BcryptJS (contraseñas locales) y Firebase Admin SDK (para sincronización con Firebase Auth)
* **Gestión de Archivos:** Multer (local) + Firebase Storage Admin (producción)
* **Notificaciones por Correo:** Nodemailer (servicio de mensajería OTP)

## 📋 Requisitos Previos
* Node.js v18 o superior
* PostgreSQL v14 o superior
* Cuenta de Firebase con un proyecto configurado (para Auth y Storage)

## ⚙️ Configuración del Entorno (`.env`)
Crea un archivo `.env` en la raíz de esta carpeta (`/backend`) con las siguientes variables:

```env
PORT=3000
JWT_SECRET=tu_jwt_secret_seguro

# Base de Datos PostgreSQL
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contrasena_postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=unamconnect

# Configuración de Firebase Admin (Pegar credenciales de serviceAccountKey.json o en formato env)
FIREBASE_PROJECT_ID=unamconnect-xxxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@unamconnect-xxxx.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=unamconnect-xxxx.appspot.com

# Configuración de Email (Nodemailer OTP)
EMAIL_USER=tu_correo_de_soporte@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_gmail
```

## 🚀 Instalación y Ejecución

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en Desarrollo (con recarga automática de Nodemon y Túnel localtunnel)**:
   ```bash
   npm run dev
   ```

3. **Ejecutar en Producción**:
   ```bash
   npm start
   ```

## 📂 Estructura de Carpetas MVC
* `config/`: Conexión de base de datos PostgreSQL.
* `controllers/`: Lógica de control y procesamiento de solicitudes.
* `middlewares/`: Autenticación JWT, control de acceso por roles y límite de peticiones (Rate Limiter).
* `models/`: Consultas SQL y definición de modelos de datos.
* `routes/`: Enrutamiento y definición de endpoints públicos/privados de la API.
* `services/`: Lógica de interacción con Firebase, envío de emails (Nodemailer).
* `uploads/`: Almacenamiento local temporal de boletas de notas / historial académico.
