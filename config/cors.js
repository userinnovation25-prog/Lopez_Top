/**
 * Configuración CORS Segura
 * Define qué orígenes pueden acceder a la API
 */

const config = require('./env');

const corsOptions = {
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  maxAge: 86400 // 24 horas en segundos
};

module.exports = corsOptions;
