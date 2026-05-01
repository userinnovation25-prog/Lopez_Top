/**
 * Utilidades para JWT
 * Funciones centralizadas para generar y verificar tokens
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Genera JWT token
 */
const generarToken = (payload) => {
  try {
    const token = jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    return token;
  } catch (error) {
    throw new Error('Error al generar token: ' + error.message);
  }
};

/**
 * Verifica y decodifica JWT token
 */
const verificarToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    throw new Error('Token inválido');
  }
};

/**
 * Extrae token del header Authorization
 */
const extraerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7); // Elimina "Bearer "
};

module.exports = {
  generarToken,
  verificarToken,
  extraerToken
};
