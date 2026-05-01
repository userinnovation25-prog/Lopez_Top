/**
 * Validación y Configuración de Variables de Entorno
 * Asegura que todas las variables requeridas estén definidas
 */

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
const optionalEnvVars = ['NODE_ENV', 'CORS_ORIGIN', 'LOG_LEVEL'];

// Validar variables obligatorias
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`\nERROR CRÍTICO: Variable de entorno "${varName}" no está definida`);
    console.error('Asegúrate de tener un archivo .env correctamente configurado.\n');
    process.exit(1);
  }
});

// Validar JWT_SECRET con longitud mínima
if (process.env.JWT_SECRET.length < 20) {
  console.warn('\nADVERTENCIA: JWT_SECRET es muy corta. Recomendado mínimo 32 caracteres.\n');
}

// Configuración centralizada
const config = {
  // App
  app: {
    port: parseInt(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  },

  // Database
  database: {
    mongoUri: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME || 'lopeztop'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug'
  }
};

module.exports = config;
