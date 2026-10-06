// Envuelve un controller async: cualquier error/rechazo llega a errorHandler vía next()
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
