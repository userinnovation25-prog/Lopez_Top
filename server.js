require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

// Importar configuración centralizada
const config = require('./config/env');
const corsOptions = require('./config/cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const contactoRoutes = require('./routes/contactoRoutes');

// Importar middlewares
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// Inicializar Express
const app = express();

// ============================================
// CONECTAR BASE DE DATOS
// ============================================
connectDB();

// ============================================
// MIDDLEWARES DE APLICACIÓN
// ============================================

// Parsear JSON
app.use(express.json());

// Parsear URL-encoded
app.use(express.urlencoded({ extended: true }));

// CORS - Configurado desde config/cors.js
const cors = require('cors');
app.use(cors(corsOptions));

// Servir archivos estáticos
app.use(express.static('public'));

// ============================================
// RUTAS
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor LopezTop está funcionando',
    version: '2.0.0',
    environment: config.app.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contactos', contactoRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware centralizado de errores (DEBE ir al final)
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = config.app.port;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     LOPEZTOP SERVER INICIADO     ║
╠════════════════════════════════════════╣
║ Puerto:          ${PORT}
║ Ambiente:        ${config.app.nodeEnv}
║ Node Version:    ${process.version}
║ Timestamp:       ${new Date().toLocaleString('es-CO')}
╚════════════════════════════════════════╝
  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error(' UNHANDLED REJECTION:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(' UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

module.exports = app;
