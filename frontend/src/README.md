# Código Fuente Principal (Frontend) 💻

Este directorio es el núcleo de la aplicación Angular. Aquí se encuentra todo el código que se compila y empaqueta para generar la interfaz de usuario de UNAMConnect.

## 📁 Estructura Principal

- [**/app**](./app): Contiene las páginas, componentes, servicios y enrutadores.
- [**index.html**](./index.html): Contenedor HTML de la SPA de Angular.
- [**main.ts**](./main.ts): Punto de entrada TypeScript que realiza el arranque de la aplicación.
- [**styles.scss**](./styles.scss): Estilos globales y reglas de scrollbars personalizadas con soporte para temas claros y oscuros.
- [**proxy.conf.json**](../proxy.conf.json): Configuración del proxy inverso de desarrollo para redirigir peticiones API al backend.

## 🛠️ Desarrollo
Para añadir nuevas funcionalidades, debes trabajar dentro de la subcarpeta [**/app**](./app) utilizando arquitectura limpia basada en Signals y componentes autónomos.
