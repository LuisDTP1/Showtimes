# Showtimes — Endpoints de la API

Backend construido en Node.js + Express + MySQL. A continuación se listan los 22 endpoints reales implementados para la aplicación.

## 1. Autenticación (`/api/auth`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/register | Registra un usuario |
| POST | /api/auth/login | Inicia sesión (retorna el usuario) |

## 2. Usuarios (`/api/usuarios`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/usuarios/:id | Ver perfil de usuario |
| PUT | /api/usuarios/:id | Editar usuario |
| DELETE | /api/usuarios/:id | Eliminar usuario |
| GET | /api/usuarios/:id/resenas | Reseñas hechas por ese usuario |
| GET | /api/usuarios/:id/favoritos | Películas favoritas de ese usuario |

## 3. Películas (`/api/peliculas`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/peliculas | Catálogo (filtros: `genero`, `en_cartelera`, `busqueda`) |
| POST | /api/peliculas | Crear película |
| GET | /api/peliculas/:id | Detalle de película (con géneros anidados) |
| PUT | /api/peliculas/:id | Editar película |
| DELETE | /api/peliculas/:id | Eliminar película |
| GET | /api/peliculas/:id/resenas | Reseñas de esa película |
| POST | /api/peliculas/:id/resenas | Crear reseña para esa película |
| POST | /api/peliculas/:id/generos | Asociar un género a una película (lo crea automáticamente si no existe) |

## 4. Géneros (`/api/generos`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/generos | Listar géneros |
| GET | /api/generos/:id/peliculas | Películas de ese género |

## 5. Reseñas (`/api/resenas`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| PUT | /api/resenas/:id | Editar reseña |
| DELETE | /api/resenas/:id | Eliminar reseña |
| GET | /api/resenas/:id/comentarios | Comentarios de esa reseña |
| POST | /api/resenas/:id/comentarios | Comentar en esa reseña |

## 6. Comentarios (`/api/comentarios`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| DELETE | /api/comentarios/:id | Eliminar comentario |

## 7. Favoritos (`/api/favoritos`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/favoritos/:peliculaId | Agregar a favoritos |
| DELETE | /api/favoritos/:peliculaId | Quitar de favoritos |

---

## Cómo correr el servidor
```bash
cd backend
npm run dev