# UNAMConnect - Frontend Client 🎓

Este es el cliente web Single Page Application (SPA) para el sistema UNAMConnect. Está desarrollado utilizando **Angular** (v17+) implementando el patrón reactivo mediante **Signals** para un control del estado ágil y eficiente.

## 🛠️ Stack Tecnológico
* **Framework:** Angular 17 (Standalone Components & Signals)
* **Estilos:** CSS Vanilla (a la medida, glassmorfismo premium)
* **Iconos:** Bootstrap Icons
* **Ruteo & Guards:** Angular Router con Guards asíncronos (`guestGuard`, `roleGuard`)
* **Cliente HTTP:** HttpClient (con interceptores para adjuntar token JWT y manejar errores)

## 📋 Requisitos Previos
* Node.js v18 o superior
* Angular CLI instalado de forma global (`npm install -g @angular/cli`)

## 🚀 Instalación y Ejecución

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar Servidor de Desarrollo local (con recarga automática/Hot-Reload)**:
   ```bash
   npm start
   ```
   *Acceso por defecto:* [http://localhost:4200/](http://localhost:4200/)

3. **Compilar para Producción**:
   ```bash
   npm run build
   ```
   *Los archivos optimizados se generarán en la carpeta `dist/` para ser servidos de forma estática.*

## ⚙️ Variables de Entorno (`environment.ts`)
Configura el endpoint del backend en `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // O la URL del tunel de localtunnel
};
```

## 📂 Arquitectura del Proyecto
* `src/app/guards/`: Controladores de acceso para rutas (`role.guard.ts`, `guest.guard.ts`).
* `src/app/interceptors/`: Interceptores HTTP globales para adjuntar token Bearer JWT de forma automática en cada petición saliente.
* `src/app/pages/`: Dashboards interactivos especializados:
  * `/auth/login/` y `/auth/register/`: Pantallas de inicio de sesión y registro público.
  * `/dashboard/student/`: Panel para que los alumnos busquen tutores, soliciten asesorías, califiquen y chateen.
  * `/dashboard/tutor/`: Panel para que los tutores aprueben asesorías, definan sus horarios y respondan mensajes.
  * `/dashboard/moderator/`: Panel de administración del sistema para validar nuevos tutores, revisar historiales académicos y ver estado del servidor.
* `src/app/services/`: Consumo de la API centralizada (`auth.service.ts`, `theme.service.ts`, `notification.service.ts`).
