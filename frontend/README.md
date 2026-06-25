# UNAMConnect - Frontend 🎨

Este directorio contiene la aplicación cliente SPA (Single Page Application) desarrollada en **Angular 17+**. Proporciona una interfaz moderna, responsiva y con una estética glassmorphic premium optimizada tanto para temas claros como oscuros.

## 📂 Estructura del Frontend

- [**/public**](./public): Contiene activos estáticos como el logotipo de la universidad, iconos del sistema y favicon.
- [**/src**](./src): Contiene el código fuente principal de la aplicación.
  - [**/app**](./src/app): Lógica de componentes, servicios inyectables, interfaces de datos (modelos) y enrutadores.
- `angular.json`: Configuración del CLI de Angular.
- `package.json`: Scripts y dependencias (Bootstrap, Bootstrap Icons, Firebase, etc.).

## 🛠️ Tecnologías y Características
- **Angular 17/18**: SPA con soporte nativo para **Signals** para un manejo reactivo y eficiente del estado.
- **Sass (SCSS)**: Hojas de estilo estructuradas con soporte para variables CSS dinámicas y adaptables a temas.
- **Estética Liquid Glass**: Efectos de desenfoque translúcido, gradientes y micro-animaciones interactivas.
- **Lazy Loading**: Enrutamiento optimizado mediante carga perezosa para reducir los tiempos de carga inicial.
- **Seguridad y Control de Errores**: Interceptores HTTP globales para adjuntar tokens de autenticación JWT y atrapar fallos del servidor mediante notificaciones tipo Toast.

## 📦 Instalación y Uso
1. Entrar a la carpeta: `cd frontend`
2. Instalar dependencias: `npm install`
3. Ejecutar el servidor de desarrollo: `npm start` (o `ng serve`)
4. Abrir en el navegador: `http://localhost:4200`

## 🚀 Despliegue en Red Local
La aplicación está configurada para vincularse al host IP `0.0.0.0`, permitiendo a otros dispositivos conectados en la misma red local (LAN) acceder a través del puerto `4200`.
