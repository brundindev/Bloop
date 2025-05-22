# 🔄 Bloop - Red Social Moderna

Bloop es una aplicación de red social moderna inspirada en Twitter, desarrollada con las últimas tecnologías web y siguiendo las mejores prácticas de desarrollo.

## 🚀 Características Principales

- **Autenticación segura** con Firebase Authentication (Google OAuth)
- **Feed personalizado** de publicaciones
- **Sistema de seguimiento** de usuarios
- **Publicaciones con imágenes** y textos
- **Interacciones completas**: likes, comentarios, reposts
- **Perfiles de usuario** personalizables
- **Modo oscuro/claro** según preferencia del usuario
- **Diseño responsive** para cualquier dispositivo
- **Animaciones fluidas** con Framer Motion
- **Interfaz moderna** con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Empaquetador**: Vite
- **Routing**: React Router
- **Iconos**: Heroicons
- **Fecha/Hora**: date-fns

## 📂 Arquitectura del Proyecto

```
src/
├── assets/           # Imágenes, iconos, etc.
├── components/       # Componentes reutilizables
│   ├── ui/           # Componentes de UI básicos
│   ├── post/         # Componentes relacionados con posts
│   └── ...
├── context/          # Contextos para gestión de estado global
├── hooks/            # Hooks personalizados
├── layouts/          # Componentes de layout
├── pages/            # Componentes de página
├── services/         # Configuración y servicios externos
├── types/            # Definiciones de tipos TypeScript
└── utils/            # Funciones de utilidad
```

## 🏗️ Arquitectura de Carpetas

La arquitectura del proyecto está diseñada para ser modular, escalable y fácil de mantener:

- **Separación de responsabilidades**: Cada carpeta tiene un propósito claro
- **Componentes modulares**: Los componentes son pequeños, reutilizables y con una única responsabilidad
- **Organización por características**: Los componentes relacionados se agrupan juntos
- **Gestión de estado**: Utilizamos context API para el estado global
- **Tipado estricto**: TypeScript para prevenir errores en tiempo de compilación

## 🔧 Instalación y Ejecución

1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/bloop.git
cd bloop
```

2. Instala las dependencias
```bash
npm install
```

3. Ejecuta el proyecto en modo desarrollo
```bash
npm run dev
```

4. Construye para producción
```bash
npm run build
```

## 🔒 Seguridad y Buenas Prácticas

- **Reglas de seguridad** en Firestore y Storage
- **Validación** tanto en cliente como en servidor
- **Protección de rutas** para usuarios autenticados
- **Gestión de errores** consistente
- **Codificación defensiva** para manejar casos extremos
- **Mensajes de error** amigables para el usuario

## 🌐 Escalabilidad

El proyecto está diseñado para escalar a millones de usuarios:

- **Carga perezosa** de componentes para reducir el tamaño inicial
- **División de código** por rutas y características
- **Optimización de imágenes** y recursos
- **Cacheo eficiente** para reducir peticiones
- **Índices de Firestore** para consultas eficientes
- **Estrategias de paginación** para grandes volúmenes de datos

## 📱 Soporte Móvil

La aplicación está diseñada con enfoque "mobile-first":

- **Diseño responsive** que se adapta a cualquier tamaño de pantalla
- **Interfaz táctil** optimizada
- **Tamaño de botones** adecuado para interacción móvil
- **Gestos nativos** donde es apropiado

## 📚 Recursos Adicionales

- [Documentación de React](https://reactjs.org/)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Framer Motion](https://www.framer.com/motion/)

## 🔮 Roadmap Futuro

- Implementación de búsqueda de usuarios y posts
- Sistema de mensajería privada
- Notificaciones push
- PWA para instalación en dispositivos
- Compartir posts en otras redes sociales
- Multimedia mejorada (videos, GIFs)
- Analíticas y métricas avanzadas

## 📄 Licencia

MIT
