-- Ejecutar en MySQL Workbench, phpMyAdmin (pestaña SQL) o terminal
CREATE DATABASE IF NOT EXISTS showtimes;
USE showtimes;

-- ==========================
-- USUARIOS
-- ==========================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('usuario', 'critico', 'admin') DEFAULT 'usuario',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- CRITICOS
-- ==========================
CREATE TABLE IF NOT EXISTS criticos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  medio_publicacion VARCHAR(100),
  biografia TEXT,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- GENEROS
-- ==========================
CREATE TABLE IF NOT EXISTS generos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- ==========================
-- PELICULAS
-- ==========================
CREATE TABLE IF NOT EXISTS peliculas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tmdb_id INT,
  titulo VARCHAR(200) NOT NULL,
  sinopsis TEXT,
  anio INT,
  duracion_minutos INT,
  trailer_url VARCHAR(255),
  poster_url VARCHAR(255),
  en_cartelera BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- PELICULA_GENERO (tabla puente, relación N:M)
-- ==========================
CREATE TABLE IF NOT EXISTS pelicula_genero (
  pelicula_id INT NOT NULL,
  genero_id INT NOT NULL,
  PRIMARY KEY (pelicula_id, genero_id),
  FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE,
  FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE CASCADE
);

-- ==========================
-- RESENAS (Soporta usuarios o críticos)
-- ==========================
CREATE TABLE IF NOT EXISTS resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pelicula_id INT NOT NULL,
  usuario_id INT DEFAULT NULL,
  critico_id INT DEFAULT NULL,
  calificacion INT NOT NULL,
  comentario TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (critico_id) REFERENCES criticos(id) ON DELETE CASCADE
);

-- ==========================
-- COMENTARIOS (comentarios sobre una reseña)
-- ==========================
CREATE TABLE IF NOT EXISTS comentarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resena_id INT NOT NULL,
  usuario_id INT NOT NULL,
  texto TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resena_id) REFERENCES resenas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==========================
-- LISTA_FAVORITOS
-- ==========================
CREATE TABLE IF NOT EXISTS lista_favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  pelicula_id INT NOT NULL,
  agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (usuario_id, pelicula_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE
);