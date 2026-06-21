require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./config/database');

const config = require('./config/env');
const corsOptions = require('./config/cors');

const authRoutes = require('./routes/authRoutes');
const contactoRoutes = require('./routes/contactoRoutes');

const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors(corsOptions));

const blockedPaths = [
  '/config',
  '/controllers',
  '/models',
  '/routes',
  '/services',
  '/middlewares',
  '/utils',
  '/node_modules',
  '/.env',
  '/server.js',
  '/seed.js',
  '/package.json',
  '/package-lock.json'
];

app.use((req, res, next) => {
  const requestPath = req.path.toLowerCase();
  if (blockedPaths.some((blockedPath) => requestPath.startsWith(blockedPath))) {
    return res.status(404).end();
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    mensaje: 'Servidor LopezTop está funcionando',
    version: '2.0.0',
    environment: config.app.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/contactos', contactoRoutes);

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

const htmlPages = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/contacto.html': 'contacto.html',
  '/proyectos.html': 'proyectos.html'
};

Object.entries(htmlPages).forEach(([route, fileName]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, fileName));
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.app.port;

if (!process.env.VERCEL && require.main === module) {
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
}

process.on('unhandledRejection', (err) => {
  console.error(' UNHANDLED REJECTION:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error(' UNCAUGHT EXCEPTION:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});

module.exports = app;
