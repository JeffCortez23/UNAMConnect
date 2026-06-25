# Componentes Compartidos (Frontend) 🧩

Este directorio contiene componentes reutilizables que son inyectados en múltiples vistas y páginas de la aplicación.

## 📁 Estructura

- **Componentes de UI Comunes**: Elementos visuales reutilizables, modales y barras de carga transversales.

## 🛠️ Cómo Utilizarlos
Al ser declarados como componentes independientes (`standalone: true` en Angular 17+), se pueden importar de forma individual en cualquier otra página o componente agregándolos a la propiedad `imports` de su decorador `@Component`.
