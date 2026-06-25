# UNAMConnect - Backend 🖥️

Este directorio contiene el servidor de la aplicación, el cual utiliza una arquitectura **MVC (Modelo-Vista-Controlador)** para garantizar un código limpio, escalable y profesional.

## 📂 Estructura del Backend

- [**/config**](./config): Conexión con PostgreSQL y configuraciones de arranque.
- [**/models**](./models): **(Capa de Datos)** Contiene las consultas SQL. Aquí se implementan los métodos CRUD y la lógica de acceso a la base de datos.
- [**/controllers**](./controllers): **(Capa de Lógica)** Gestiona las peticiones (req) y respuestas (res). Llama a los modelos para procesar datos.
- [**/routes**](./routes): Definición de los endpoints del API.
- [**/middlewares**](./middlewares): Validación de entradas (express-validator) y control de autenticación JWT.
- [**/services**](./services): Servicios auxiliares de correo electrónico y abstracción de Firebase Admin SDK.
- [**/scripts**](./scripts): Utilidades para la siembra de base de datos, inicialización de usuarios y aleatorización de métricas.

## 🔐 Autenticación y Autorización
Se ha implementado un sistema robusto e híbrido:
- **JWT**: Tokens de sesión firmados con expiración de 8 horas.
- **Firebase Authentication**: Integración nativa a través de scripts de registro y autenticación cliente.
- **BcryptJS**: Hash seguro de contraseñas locales.
- **Ruta de entrada**: `/api/auth/login` y `/api/auth/register`.

## 🛠️ Consultas Dinámicas (PUT)
Los métodos `UPDATE` en los modelos son dinámicos. Esto significa que:
1. Puedes enviar solo los campos que deseas actualizar en el JSON.
2. Los campos virtuales (como `nombre_carrera`) son filtrados automáticamente para evitar errores de base de datos.
3. Evita el error de campos nulos por omisión.

## 🛡️ Validaciones
Se utiliza `express-validator` para asegurar la integridad de los datos de entrada:
- **Auth**: Valida formato de correo y longitud mínima de contraseña.
- **Usuarios**: Protege contra campos vacíos y formatos inválidos.
- **Carreras**: Asegura que los nombres y facultades no estén vacíos.
Si un dato es inválido, el servidor responderá con un código `400 Bad Request` y los detalles del error.

## 📦 Instalación y Configuración
1. Entrar a la carpeta: `cd backend`
2. Instalar dependencias: `npm install`
3. Configurar `.env` (Basado en el archivo `.env` local):
   ```env
   PORT=3000
   DATABASE_URL=postgresql://usuario:password@localhost:5432/UNAMConnect
   JWT_SECRET=tu_clave_secreta_aqui
   FIREBASE_API_KEY=tu_api_key_firebase
   FIREBASE_DEFAULT_PASSWORD=tu_password_por_defecto
   ```
4. Inicializar Base de Datos:
   ```bash
   psql -d UNAMConnect -f init_db.sql
   ```

## 🚀 Ejecución
- **Modo Desarrollo:** `npm run dev`
- **Modo Producción:** `npm start`
