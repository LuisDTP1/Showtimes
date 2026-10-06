// Middleware personalizado GLOBAL (app.use): registra cada request con fecha, método y URL
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pasar al siguiente middleware
};

module.exports = logger;
