/**
 * Middleware Centralizado de Manejo de Errores
 * Captura y responde a errores de forma consistente
 */

const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Log del error (en producción con logger, aquí usamos console)
  console.error('\n❌ ERROR:', {
    message: err.message,
    status: err.status || err.statusCode || 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  });

  // Determinar status code
  const statusCode = err.statusCode || err.status || 500;

  // Respuesta al cliente
  res.status(statusCode).json({
    error: {
      message: isDevelopment 
        ? err.message 
        : 'Error interno del servidor',
      status: statusCode,
      ...(isDevelopment && { 
        stack: err.stack,
        details: err.details 
      })
    }
  });
};

/**
 * Middleware para capturar rutas no encontradas
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      message: 'Ruta no encontrada',
      status: 404,
      path: req.path,
      method: req.method
    }
  });
};

/**
 * Wrapper para funciones async en rutas (evita try-catch repetido)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
