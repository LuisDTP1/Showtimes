const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const logger = require('./middlewares/loggerMiddleware');
const { apiLimiter } = require('./middlewares/rateLimitMiddleware');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.disable('x-powered-by');

// ─── Middlewares globales ───
// CORS_ORIGIN="http://localhost:5173,https://miapp.com" (vacío = permite cualquier origen)
const origenes = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origenes.length ? origenes : true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev')); // Logging (tercero)
  app.use(logger); // Logging (personalizado)
}
app.use(express.json({ limit: '100kb' }));
app.use('/api', apiLimiter);

// ─── Rutas ───
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Showtimes API — MySQL real' });
});

app.use('/api/tmdb', require('./routes/tmdb.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/peliculas', require('./routes/peliculas.routes'));
app.use('/api/generos', require('./routes/generos.routes'));
app.use('/api/resenas', require('./routes/resenas.routes'));
app.use('/api/comentarios', require('./routes/comentarios.routes'));
app.use('/api/favoritos', require('./routes/favoritos.routes'));
app.use('/api/criticos', require('./routes/critico.routes'));

// ─── 404 + middleware de errores global (4 parámetros): siempre al final, después de todas las rutas ───
app.use(notFound);
app.use(errorHandler);

module.exports = app;
