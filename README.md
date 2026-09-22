# 🎬 Showtimes — Backend API

API REST desarrollada para la gestión de una cartelera de cine, películas, géneros y reseñas de usuarios, utilizando una arquitectura modular en capas conectada a una base de datos relacional.

## 🚀 Tecnologías utilizadas
* **Node.js** & **Express** — Entorno de ejecución y framework web para Node.
* **MySQL2** — Conector optimizado con soporte para Promesas y *pool* de conexiones.
* **Dotenv** — Gestión segura de variables de entorno.
* **Nodemon** — Reinicio automático del servidor en entorno de desarrollo.

## 📁 Estructura del Proyecto
```text
backend/
├── src/
│   ├── config/       # Configuración de la base de datos (Pool MySQL)
│   ├── controllers/  # Lógica de negocio de las peticiones
│   ├── models/       # Consultas SQL seguras (Prepared Statements)
│   ├── routes/       # Definición de rutas y endpoints
│   ├── services/     # Servicios externos (ej. consumo de la API de TMDB)
│   └── app.js        # Configuración principal de Express y middlewares
├── .env              # Variables de entorno (Credenciales de BD)
├── .gitignore        # Archivos ignorados por Git
├── index.js          # Punto de entrada de la aplicación
├── package-lock.json # Registro exacto de versiones de dependencias instaladas
└── package.json      # Dependencias y scripts del proyecto