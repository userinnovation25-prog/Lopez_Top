const { verificarToken, extraerToken } = require('../utils/jwt');

/**
 * Middleware de autenticación
 * Verifica JWT token y adjunta usuario al request
 */
const autenticar = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const error = new Error('No hay token de autenticación');
      error.statusCode = 401;
      throw error;
    }

    const token = extraerToken(authHeader);
    if (!token) {
      const error = new Error('Formato de token inválido. Usa "Bearer {token}"');
      error.statusCode = 401;
      throw error;
    }

    const decoded = verificarToken(token);
    req.usuario = decoded;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

/**
 * Middleware para verificar rol de administrador
 * Debe ir después de autenticar
 */
const requiereAdmin = (req, res, next) => {
  try {
    if (!req.usuario || req.usuario.rol !== 'admin') {
      const error = new Error('Acceso denegado. Solo administradores pueden acceder.');
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 403;
    next(error);
  }
};

module.exports = { autenticar, requiereAdmin };
