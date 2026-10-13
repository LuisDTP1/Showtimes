require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const peliculasRoutes = require('./routes/peliculas.routes');
const generosRoutes = require('./routes/generos.routes');
const resenasRoutes = require('./routes/resenas.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const favoritosRoutes = require('./routes/favoritos.routes');
const tmdbRoutes = require('./routes/tmdb.routes');
const criticosRoutes = require('./routes/critico.routes');

app.use('/api/tmdb', tmdbRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/peliculas', peliculasRoutes);
app.use('/api/generos', generosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/criticos', criticosRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Showtimes API — MySQL real' });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, msg: 'Endpoint no encontrado' });
});

// Middleware de errores global: siempre al final, con 4 parametros
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status === 400 ? 400 : 500;
  res.status(status).json({
    ok: false,
    msg: status === 400 ? 'JSON inválido en el cuerpo de la petición' : 'Error interno del servidor'
  });
});

module.exports = app;