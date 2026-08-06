const express = require('express');
const cors = require('cors');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error("❌ CRITICAL ERROR: JWT_SECRET environment variable is not defined!");
  process.exit(1);
}

const { generalLimiter } = require('./middlewares/rateLimit');

const app = express();
// Confiar en el proxy de Render para que el rate limiter identifique las IPs reales
// (elimina el warning ERR_ERL_UNEXPECTED_X_FORWARDED_FOR y evita límites compartidos entre usuarios)
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────
const allowedOrigins = [
  'http://localhost:4200',     // Angular dev server
  'http://127.0.0.1:4200',
  'http://localhost:3000',     // Backend sirve frontend compilado
  'http://127.0.0.1:3000',
  'https://unamconnect.onrender.com'
];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (mismo servidor), desde locales, túneles (*.loca.lt) o subdominios de Render (*.onrender.com)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.loca.lt') || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  },
  credentials: true
}));
app.use(generalLimiter);
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Servir frontend compilado en producción
const path = require('path');
const frontendDistPath = path.join(__dirname, '../frontend/dist/frontend/browser');
app.use(express.static(frontendDistPath));

// ── Rutas ────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const carrerasRoutes = require('./routes/carreras.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const rolesRoutes = require('./routes/roles.routes');
const cursosRoutes = require('./routes/cursos.routes');
const solicitudesRoutes = require('./routes/solicitudes.routes');
const tutoresCursosRoutes = require('./routes/tutoresCursos.routes');
const horariosRoutes = require('./routes/horarios.routes');
const asesoriasRoutes = require('./routes/asesorias.routes');
const valoracionesRoutes = require('./routes/valoraciones.routes');
const recursosRoutes = require('./routes/recursos.routes');
const notificacionesRoutes = require('./routes/notificaciones.routes');
const mensajesRoutes = require('./routes/mensajes.routes');
const uploadRoutes = require('./routes/upload.routes');

app.use('/api/auth', authRoutes);
app.use('/api/carreras', carrerasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/solicitudes-tutor', solicitudesRoutes);
app.use('/api/tutores-cursos', tutoresCursosRoutes);
app.use('/api/horarios-tutor', horariosRoutes);
app.use('/api/asesorias', asesoriasRoutes);
app.use('/api/valoraciones', valoracionesRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/upload', uploadRoutes);

// ── Endpoint de Salud del Sistema (Métricas Reales) ──
app.get('/api/health', async (req, res) => {
  const db = require('./config/db');
  const fs = require('fs');
  
  fs.statfs('/', async (err, stats) => {
    let usage = '0%';
    if (!err && stats) {
      const total = stats.blocks * stats.bsize;
      const free = stats.bavail * stats.bsize;
      const used = total - free;
      usage = Math.round((used / total) * 100) + '%';
    }
    try {
      await db.query('SELECT 1');
      res.json({
        server: 'Operativo',
        database: 'Operativo',
        storage: usage
      });
    } catch (dbErr) {
      res.json({
        server: 'Operativo',
        database: 'Fuera de línea (' + dbErr.message + ')',
        storage: usage
      });
    }
  });
});

// ── Ruta raíz ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    mensaje: '🎓 UNAMConnect API REST',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/carreras',
      '/api/usuarios',
      '/api/roles',
      '/api/cursos',
      '/api/solicitudes-tutor',
      '/api/tutores-cursos',
      '/api/horarios-tutor',
      '/api/asesorias',
      '/api/valoraciones',
      '/api/recursos',
      '/api/notificaciones',
    ],
  });
});

// ── Manejo de SPA routing para el frontend ───────────
app.get('*any', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// ── Manejo de rutas no encontradas (solo para API) ───
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta de API no encontrada' });
});

// ── Manejo global de errores ─────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Iniciar servidor ─────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor UNAMConnect corriendo en http://localhost:${PORT}`);

  // Levantar túnel público automático con localtunnel si estamos en desarrollo
  if (process.env.NODE_ENV === 'development') {
    const { exec } = require('child_process');
    const tunnel = exec('npx localtunnel --port 3000');
    tunnel.stdout.on('data', (data) => {
      console.log(`\n==================================================`);
      console.log(`🌍 TÚNEL PÚBLICO ACTIVO PARA COMPAÑERAS:`);
      console.log(`   ${data.toString().trim()}`);
      console.log(`==================================================\n`);
    });
    tunnel.stderr.on('data', (data) => {
      console.error(`⚠️ Error en localtunnel:`, data.toString());
    });
  } else {
    console.log('ℹ️ Entorno de producción detectado o NODE_ENV no es development. Túnel localtunnel desactivado.');
  }
});
