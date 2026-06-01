# Componentes y Lógica de UNAMConnect (Frontend) 🧩

Este es el directorio donde reside la lógica principal de la aplicación Angular. Está organizado siguiendo las mejores prácticas de modularidad y escalabilidad.

## 📁 Organización Sugerida

- **Components**: Interfaces de usuario (ej: Header, Footer, Login, Dashboard).
- **Services**: Lógica para interactuar con el backend (API) y manejo de datos.
- **Models**: Definición de interfaces y clases de TypeScript para los datos (Usuarios, Asesorías, etc.).
- **Guards**: Protección de rutas (ej: solo para usuarios autenticados).

## 🚀 Cómo empezar
Para crear un nuevo componente, utiliza el Angular CLI desde la raíz del frontend:
```bash
ng generate component nombre-del-componente
```

Para un nuevo servicio:
```bash
ng generate service services/nombre-del-servicio
```

---
*Asegúrate de importar los nuevos componentes en sus módulos correspondientes.*
