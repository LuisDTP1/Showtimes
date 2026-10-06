// 404 para rutas inexistentes
const notFound = (req, res) => {
  res.status(404).json({ ok: false, error: `Endpoint no encontrado: ${req.method} ${req.originalUrl}` });
};

// Manejador central de errores (debe registrarse al final en app.js)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, error: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, error: 'El cuerpo de la petición es demasiado grande' });
  }
  // Errores de MySQL
  if (err.errno === 1062) {
    return res.status(409).json({ ok: false, error: 'Ya existe un registro con esos datos (duplicado)' });
  }
  if (err.errno === 1452) {
    return res.status(400).json({ ok: false, error: 'Referencia inválida: el registro relacionado no existe' });
  }
  if (err.errno === 4025 || err.errno === 3819) {
    return res.status(400).json({ ok: false, error: 'Un valor no cumple las restricciones de la base de datos' });
  }

  const status = err.status || 500;
  if (status >= 500) console.error(`[${req.method} ${req.originalUrl}]`, err);
  const msg =
    status >= 500 && process.env.NODE_ENV === 'production' && !err.status
      ? 'Error interno del servidor'
      : err.message;
  res.status(status).json({ ok: false, error: msg });
};

module.exports = { notFound, errorHandler };
