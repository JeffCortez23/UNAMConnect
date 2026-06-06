# UNAMConnect - Backend 🖥️

Este directorio contiene el servidor de la aplicación, el cual utiliza una arquitectura **MVC (Modelo-Vista-Controlador)** para garantizar un código limpio, escalable y profesional.

## 📂 Estructura del Backend

- [**/config**](./config): Conexión con PostgreSQL.
- [**/models**](./models): **(Capa de Datos)** Contiene las consultas SQL. Aquí se implementan los métodos CRUD y la lógica de acceso a la base de datos.
- [**/controllers**](./controllers): **(Capa de Lógica)** Gestiona las peticiones (req) y respuestas (res). Llama a los modelos para procesar datos.
- [**/routes**](./routes): Definición de los endpoints del API.
- `index.js`: Punto de entrada de la aplicación.
- `init_db.sql`: Script actualizado con el campo de contraseñas y datos iniciales.

## 🔐 Autenticación
Se ha implementado un sistema de autenticación basado en:
- **JWT**: Tokens de sesión con expiración de 8 horas.
- **BcryptJS**: Hash de contraseñas para máxima seguridad.
- **Ruta**: `/api/auth/login` y `/api/auth/register`.

## 🛠️ Consultas Dinámicas (PUT)
Los métodos `UPDATE` en los modelos son dinámicos. Esto significa que:
1.  Puedes enviar solo los campos que deseas actualizar en el JSON.
2.  Los campos virtuales (como `nombre_carrera`) son filtrados automáticamente para evitar errores de base de datos.
3.  Evita el error de campos nulos por omisión.

## 📦 Instalación
1.  Entrar a la carpeta: `cd backend`
2.  Instalar dependencias: `npm install`
3.  Configurar `.env`:
    ```env
    DATABASE_URL=postgresql://usuario:password@localhost:5432/UNAMConnect
    JWT_SECRET=tu_clave_secreta_aqui
    ```
4.  Inicializar BD (Si aún no tienes la tabla de passwords):
    ```bash
    psql -d UNAMConnect -f init_db.sql
    ```

## 🚀 Ejecución
- **Modo Desarrollo:** `npm run dev`
- **Modo Producción:** `npm start`
