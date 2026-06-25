# Carpeta de Configuración (Backend) ⚙️

Este directorio contiene los archivos de configuración global necesarios para el correcto funcionamiento del servidor de UNAMConnect.

## 📄 Archivos Principales

- [**db.js**](./db.js): Contiene la lógica de conexión a la base de datos PostgreSQL utilizando el pool de conexiones de `pg`. Lee las credenciales y URLs desde las variables de entorno para mayor seguridad.
- [**prerequisites.config.js**](./prerequisites.config.js): Define y centraliza la matriz de prerrequisitos de los cursos de la universidad, expuesta dinámicamente mediante la API REST para el control de matrícula y flujos del estudiante.

## 🔧 Uso
Para modificar la conexión a la base de datos, asegúrate de actualizar el archivo `.env` en la raíz del servidor backend.
