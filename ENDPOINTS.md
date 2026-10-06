# Showtimes — Endpoints de la API

Node.js + Express + MySQL. Respuestas siempre en JSON: `{ ok: true, data }` o `{ ok: false, error }`.

**Autenticación (JWT + bcrypt):** `register` y `login` devuelven `{ ok, token, usuario }`. El token se envía en cada petición protegida:
`Authorization: Bearer <token>`

- Sin token → **401** `Token requerido`
- Token alterado o expirado → **403** `Token inválido o expirado` (hay que volver a hacer login)
- Sin permiso (rol/autoría) → **403**

El middleware `verificarToken` deja el payload en `req.usuario` = `{ id, email, tipo, rol }` (la contraseña nunca va en el token).

**Acceso:** 🌐 público · 🔑 cualquier cuenta con sesión · 👤 solo el dueño de la cuenta (o admin) · ✍️ solo el autor (o admin) · 🛡️ solo admin

## Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | /api/auth/register | 🌐 | Registra un usuario `{nombre, email, password}` → `201 {token, usuario}` (el rol siempre es `usuario`) |
| POST | /api/auth/login | 🌐 | `{email, password, tipo?}` (`tipo: "critico"` para críticos) → `{token, usuario}` |
| POST | /api/auth/logout | 🌐 | Cierra sesión (el cliente descarta el token) |
| GET | /api/auth/me | 🔑 | Datos de la sesión actual |

## Usuarios (`/api/usuarios`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | /api/usuarios/:id | 👤 | Ver perfil |
| PUT / PATCH | /api/usuarios/:id | 👤 | Editar `nombre`, `email`, `password` |
| DELETE | /api/usuarios/:id | 👤 | Eliminar cuenta |
| GET | /api/usuarios/:id/resenas | 🌐 | Reseñas hechas por el usuario |
| GET | /api/usuarios/:id/favoritos | 👤 | Películas favoritas |
| POST | /api/usuarios/:id/favoritos | 👤 | Agregar favorito `{pelicula_id}` |
| DELETE | /api/usuarios/:id/favoritos/:pelicula_id | 👤 | Quitar favorito |

## Películas (`/api/peliculas`)
Cada película incluye los puntajes: `criticos_total / _promedio / _porcentaje` (Tomatometer) y `publico_total / _promedio / _porcentaje` (Audience Score). El porcentaje es el % de reseñas con calificación ≥ 3.

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | /api/peliculas | 🌐 | Catálogo. Query: `genero`, `en_cartelera`, `busqueda`, `orden` (`recientes`\|`criticos`\|`publico`\|`titulo`), `pagina`, `limite` |
| GET | /api/peliculas/cartelera | 🌐 | Solo las que están en cartelera |
| GET | /api/peliculas/:id | 🌐 | Detalle + tráiler + géneros + puntajes |
| POST | /api/peliculas | 🛡️ | Crear. Con `tmdb_id` se completa todo desde TMDB (título, sinopsis, póster, tráiler, géneros) |
| PUT / PATCH | /api/peliculas/:id | 🛡️ | Editar |
| DELETE | /api/peliculas/:id | 🛡️ | Eliminar |
| POST | /api/peliculas/:id/generos | 🛡️ | Asociar género `{generoId, nombre?}` |
| GET | /api/peliculas/:id/resenas | 🌐 | Reseñas (con `tipo_autor`: `usuario` / `critico`) |
| POST | /api/peliculas/:id/resenas | 🔑 | Crear reseña `{calificacion (1-5), comentario?}`. El autor sale del token. Una por persona y película |

## Géneros (`/api/generos`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | /api/generos | 🌐 | Listar géneros |
| GET | /api/generos/:id/peliculas | 🌐 | Películas de un género |

## Reseñas (`/api/resenas`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| PUT / PATCH | /api/resenas/:id | ✍️ | Editar `calificacion` y/o `comentario` |
| DELETE | /api/resenas/:id | ✍️ | Eliminar |
| GET | /api/resenas/:id/comentarios | 🌐 | Comentarios de la reseña |
| POST | /api/resenas/:id/comentarios | 🔑 (solo usuarios) | Comentar `{texto}` |

## Comentarios (`/api/comentarios`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| DELETE | /api/comentarios/:id | ✍️ | Eliminar comentario |

## Favoritos — atajo (`/api/favoritos`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | /api/favoritos/:peliculaId | 🔑 (usuarios) | Agregar a favoritos de la sesión actual |
| DELETE | /api/favoritos/:peliculaId | 🔑 (usuarios) | Quitar de favoritos |

## Críticos (`/api/criticos`)
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | /api/criticos/login | 🌐 | Login de crítico → `{token, usuario}` |
| GET | /api/criticos | 🌐 | Listar críticos |
| GET | /api/criticos/:id | 🌐 | Ver crítico |
| POST | /api/criticos | 🛡️ | Dar de alta un crítico |
| PUT / PATCH | /api/criticos/:id | 👤 (el propio crítico) / 🛡️ | Editar |
| DELETE | /api/criticos/:id | 👤 / 🛡️ | Eliminar |

## TMDB (`/api/tmdb`) — consulta a la API externa
| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | /api/tmdb/cartelera?page= | 🌐 | Películas en cines ahora |
| GET | /api/tmdb/buscar?q=&page= | 🌐 | Buscar por título |
| GET | /api/tmdb/:tmdbId | 🌐 | Detalle + imágenes + tráilers |

## Códigos de error
`400` datos inválidos · `401` sin token · `403` token inválido/vencido o sin permiso · `404` no existe · `409` duplicado · `429` demasiadas peticiones · `502` falla TMDB

---
## Cómo correr el servidor
```bash
cd backend
cp .env.example .env     # y completa los valores (JWT_SECRET larga y aleatoria)
npm install
npm run dev
```
Para tener un **admin**: regístrate normalmente y luego en MySQL: `UPDATE usuarios SET rol='admin' WHERE email='tu@correo.com';` (vuelve a hacer login para obtener un token nuevo).

## Probar con Postman
Importa `Showtimes.postman_collection.json`. Orden: **Register → Login** (el script guarda el token en `{{token}}` y el id en `{{usuarioId}}`) y luego cualquier ruta protegida: la colección ya usa *Auth → Bearer Token* con `{{token}}`. Para crear películas o críticos haz login con la cuenta admin.
