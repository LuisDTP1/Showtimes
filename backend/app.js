const express = require('express');
const app = express();

app.use(express.json());

// Importación de rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const tvShowRoutes = require('./routes/tvshows');
const reviewRoutes = require('./routes/reviews');
const criticRoutes = require('./routes/critics');
const peopleRoutes = require('./routes/people');
const genreRoutes = require('./routes/genres');
const listRoutes = require('./routes/lists');
const watchlistRoutes = require('./routes/watchlist');
const favoriteRoutes = require('./routes/favorites');
const notificationRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');

// Montaje de rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/tv-shows', tvShowRoutes);
app.use('/reviews', reviewRoutes);
app.use('/critics', criticRoutes);
app.use('/people', peopleRoutes);
app.use('/genres', genreRoutes);
app.use('/lists', listRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/notifications', notificationRoutes);
app.use('/search', searchRoutes);
app.use('/admin', adminRoutes);

// Ruta de salud
app.get('/', (req, res) => {
  res.json({ message: 'Movie Review API - esqueleto de endpoints' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
