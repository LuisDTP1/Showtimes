# Showtimes — Endpoints de la API

Backend construido en Node.js + Express. A continuación se listan todos los endpoints definidos para la aplicación de reseñas de películas.

## Autenticación (`/auth`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/register | Registro de usuario |
| POST | /auth/login | Inicio de sesión |
| POST | /auth/logout | Cerrar sesión |
| POST | /auth/refresh | Renovar token |
| POST | /auth/forgot-password | Recuperar contraseña |
| POST | /auth/reset-password | Resetear contraseña |

## Usuarios (`/users`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /users/:id | Perfil de usuario |
| PUT | /users/:id | Actualizar perfil |
| DELETE | /users/:id | Eliminar cuenta |
| GET | /users/:id/reviews | Reseñas hechas por el usuario |
| GET | /users/:id/watchlist | Lista "para ver" del usuario |
| GET | /users/:id/favorites | Favoritos del usuario |
| GET | /users/:id/ratings | Calificaciones dadas por el usuario |

## Películas (`/movies`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /movies | Listado de películas |
| POST | /movies | Crear película (admin) |
| GET | /movies/search | Búsqueda por título |
| GET | /movies/trending | Tendencias |
| GET | /movies/upcoming | Próximos estrenos |
| GET | /movies/now-playing | En cartelera |
| GET | /movies/top-rated | Mejor calificadas |
| GET | /movies/:id | Detalle de una película |
| PUT | /movies/:id | Editar película (admin) |
| DELETE | /movies/:id | Eliminar película (admin) |
| GET | /movies/:id/similar | Películas similares |
| GET | /movies/:id/cast | Reparto |
| GET | /movies/:id/crew | Equipo técnico |
| GET | /movies/:id/trailers | Tráilers/videos |
| GET | /movies/:id/images | Pósters y fotos |
| GET | /movies/:id/scores | Puntaje de críticos y audiencia |
| GET | /movies/:id/reviews | Reseñas de una película |
| POST | /movies/:id/reviews | Crear reseña para una película |
| POST | /movies/:id/rate | Calificar película |
| GET | /movies/:id/rating-distribution | Distribución de calificaciones |
| GET | /movies/:id/tomatometer | Score de críticos |
| GET | /movies/:id/audience-score | Score de audiencia |

## Series (`/tv-shows`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /tv-shows | Listado de series |
| GET | /tv-shows/:id | Detalle de una serie |
| GET | /tv-shows/:id/seasons | Temporadas |
| GET | /tv-shows/:id/seasons/:season/episodes | Episodios de una temporada |

## Reseñas (`/reviews`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /reviews/:id | Detalle de una reseña |
| PUT | /reviews/:id | Editar reseña |
| DELETE | /reviews/:id | Eliminar reseña |
| GET | /reviews/:id/comments | Comentarios de una reseña |
| POST | /reviews/:id/comments | Comentar en una reseña |
| POST | /reviews/:id/like | Dar like a una reseña |
| POST | /reviews/:id/report | Reportar una reseña |

## Críticos (`/critics`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /critics | Listado de críticos |
| POST | /critics/apply | Solicitud para ser crítico verificado |
| GET | /critics/:id | Perfil de crítico |
| GET | /critics/:id/reviews | Reseñas del crítico |

## Personas (`/people`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /people | Listado de actores/directores |
| GET | /people/:id | Perfil de una persona |
| GET | /people/:id/filmography | Filmografía |

## Géneros (`/genres`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /genres | Listado de géneros |
| GET | /genres/:id/movies | Películas por género |

## Listas (`/lists`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /lists | Listas públicas |
| POST | /lists | Crear lista |
| GET | /lists/:id | Ver lista |
| PUT | /lists/:id | Editar lista |
| DELETE | /lists/:id | Eliminar lista |
| POST | /lists/:id/items | Agregar película a la lista |

## Watchlist (`/watchlist`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /watchlist/:movieId | Agregar película a watchlist |
| DELETE | /watchlist/:movieId | Quitar película de watchlist |

## Favoritos (`/favorites`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /favorites/:movieId | Marcar película como favorita |
| DELETE | /favorites/:movieId | Quitar película de favoritos |

## Notificaciones (`/notifications`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /notifications | Listado de notificaciones |
| PUT | /notifications/:id/read | Marcar notificación como leída |
| DELETE | /notifications/:id | Eliminar notificación |

## Búsqueda (`/search`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /search | Búsqueda global (películas, personas, críticos) |

## Administración (`/admin`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /admin/stats | Estadísticas generales |
| GET | /admin/reported-reviews | Reseñas reportadas |
| PUT | /admin/reviews/:id/moderate | Moderar reseña |

---

## Estado actual
Todos los endpoints están **definidos y responden** (`501 Not Implemented`) mediante Express Router. La lógica de negocio y la conexión a base de datos se implementarán en una siguiente etapa.

## Cómo correr el servidor
```bash
cd backend
npm install
npm start
```
Servidor disponible en `http://localhost:3000`.
