const express = require('express');
const app = express();

app.use(express.json());

// Importación de rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const movieRoutes = require('./routes/movies.routes');
const tvShowRoutes = require('./routes/tvshows.routes');
const reviewRoutes = require('./routes/reviews.routes');
const criticRoutes = require('./routes/critics.routes');
const peopleRoutes = require('./routes/people.routes');
const genreRoutes = require('./routes/genres.routes');
const listRoutes = require('./routes/lists.routes');
const watchlistRoutes = require('./routes/watchlist.routes');
const favoriteRoutes = require('./routes/favorites.routes');
const notificationRoutes = require('./routes/notifications.routes');
const searchRoutes = require('./routes/search.routes');
const adminRoutes = require('./routes/admin.routes');

// Montaje de rutas bajo /api (consistente con el resto del curso)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tv-shows', tvShowRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/critics', criticRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de salud
app.get('/', (req, res) => {
  res.json({ message: 'Showtimes API — almacenamiento en memoria (Módulo 05)' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: 'Endpoint no encontrado' });
});

module.exports = app;
