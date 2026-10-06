-- Para bases de datos que YA existen (si creas la BD desde cero, usa Database.sql).
-- Si falla por duplicados, borra primero las reseñas repetidas.
USE showtimes;
ALTER TABLE resenas
  ADD UNIQUE KEY uq_resena_usuario (pelicula_id, usuario_id),
  ADD UNIQUE KEY uq_resena_critico (pelicula_id, critico_id),
  ADD CONSTRAINT chk_calificacion CHECK (calificacion BETWEEN 1 AND 5);
