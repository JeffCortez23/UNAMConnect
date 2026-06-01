# UNAMConnect - Backend 🖥️

Este directorio contiene el servidor de la aplicación, el cual ha sido completamente implementado y fusionado en la rama principal (`main`). Gestiona la lógica de negocio, la conexión con PostgreSQL y expone el API REST necesario para la aplicación.

## 📂 Estructura del Backend

- [**/config**](./config): Configuraciones de base de datos y variables globales.
- [**/controllers**](./controllers): Lógica que procesa las peticiones y genera las respuestas.
- [**/routes**](./routes): Definición de rutas (endpoints) del API REST.
- `index.js`: Punto de entrada de la aplicación.
- `init_db.sql`: Script para inicializar las tablas en PostgreSQL.

## 🛠️ Tecnologías
- **Node.js**: Entorno de ejecución de JavaScript en el servidor.
- **Express**: Framework minimalista para la creación del API.
- **pg (node-postgres)**: Librería para interactuar con la base de datos PostgreSQL.
- **dotenv**: Manejo de variables de entorno seguras.
- **cors**: Habilitación de Cross-Origin Resource Sharing para el frontend.

## 📦 Instalación
1. Entrar a la carpeta: `cd backend`
2. Instalar dependencias: `npm install`
3. Crear un archivo `.env` basado en la configuración de tu base de datos local (puerto, usuario, contraseña).
   - Ejemplo: `DATABASE_URL=postgresql://tu_usuario@localhost:5432/UNAMConnect`

## 🛠️ Notas de Base de Datos (PostgreSQL)
Si al ejecutar el servidor recibes un error de **"permission denied for table ..."**, asegúrate de que el usuario definido en tu `.env` tenga permisos sobre las tablas creadas por el usuario `postgres`.

**Recomendación:** Ejecuta el script de inicialización con tu propio usuario de base de datos para evitar conflictos de propiedad:
```bash
psql -d UNAMConnect -f init_db.sql
```

## 🚀 Ejecución
- **Modo Desarrollo:** `npm run dev` (Inicia con nodemon para reinicio automático).
- **Modo Producción:** `npm start` (Ejecución estándar con node).

## 📄 Scripts Disponibles
- `npm run dev`: Ejecuta el servidor en modo desarrollo.
- `npm start`: Inicia el servidor de producción.
- `npm test`: (Opcional) Ejecuta las pruebas unitarias o de integración.
