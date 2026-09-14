const express = require('express');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const peliculasRoutes = require('./routes/peliculas.routes');
const generosRoutes = require('./routes/generos.routes');
const resenasRoutes = require('./routes/resenas.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const favoritosRoutes = require('./routes/favoritos.routes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/peliculas', peliculasRoutes);
app.use('/api/generos', generosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/favoritos', favoritosRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Showtimes API — MySQL real' });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, msg: 'Endpoint no encontrado' });
});

module.exports = app;
