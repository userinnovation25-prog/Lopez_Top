/**
 * Validadores Reutilizables
 * Funciones centralizadas para validar datos
 */

const validator = require('validator');

/**
 * Valida email
 */
const validarEmail = (email) => {
  if (!email || !validator.isEmail(email)) {
    throw new Error('Email inválido o vacío');
  }
  return validator.normalizeEmail(email);
};

/**
 * Valida contraseña (mínimo 6 caracteres)
 */
const validarContrasena = (contrasena, minLength = 6) => {
  if (!contrasena || contrasena.length < minLength) {
    throw new Error(`La contraseña debe tener mínimo ${minLength} caracteres`);
  }
  return contrasena;
};

/**
 * Valida nombre (no vacío, sin caracteres especiales)
 */
const validarNombre = (nombre) => {
  if (!nombre || nombre.trim().length === 0) {
    throw new Error('El nombre no puede estar vacío');
  }
  const nombreLimpio = validator.trim(nombre);
  if (nombreLimpio.length < 2) {
    throw new Error('El nombre debe tener al menos 2 caracteres');
  }
  return nombreLimpio;
};

/**
 * Valida celular internacional (flexible, acepta múltiples formatos)
 */
const validarCelular = (celular) => {
  if (!celular) {
    throw new Error('El celular no puede estar vacío');
  }
  // Permite números con +, -, espacios y paréntesis
  if (!validator.isMobilePhone(celular, ['es-CO', 'es-AR', 'es-MX'], { strictMode: false })) {
    throw new Error('Celular inválido. Usa formato internacional o nacional');
  }
  return validator.trim(celular);
};

/**
 * Valida mensaje (no vacío, con longitud razonable)
 */
const validarMensaje = (mensaje, maxLength = 1000) => {
  if (!mensaje || mensaje.trim().length === 0) {
    throw new Error('El mensaje no puede estar vacío');
  }
  const mensajeLimpio = validator.trim(mensaje);
  if (mensajeLimpio.length > maxLength) {
    throw new Error(`El mensaje no puede exceder ${maxLength} caracteres`);
  }
  return validator.escape(mensajeLimpio); // Escape para prevenir XSS
};

/**
 * Valida MongoDB ObjectId
 */
const validarObjectId = (id) => {
  if (!validator.isMongoId(id)) {
    throw new Error('ID inválido');
  }
  return id;
};

/**
 * Middleware para capturar errores de validación
 */
const handleValidationError = (error) => {
  const err = new Error(error.message);
  err.statusCode = 400;
  err.details = { field: 'validation', message: error.message };
  throw err;
};

module.exports = {
  validarEmail,
  validarContrasena,
  validarNombre,
  validarCelular,
  validarMensaje,
  validarObjectId,
  handleValidationError
};
