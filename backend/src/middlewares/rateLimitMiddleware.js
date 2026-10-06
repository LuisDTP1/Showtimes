const rateLimit = require('express-rate-limit');

const base = { standardHeaders: 'draft-8', legacyHeaders: false };

// Límite general para toda la API
const apiLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: { ok: false, error: 'Demasiadas solicitudes, intenta más tarde' },
});

// Más estricto para login/registro (frena fuerza bruta)
const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { ok: false, error: 'Demasiados intentos de autenticación, intenta en 15 minutos' },
});

module.exports = { apiLimiter, authLimiter };
