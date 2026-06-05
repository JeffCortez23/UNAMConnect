const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────
app.use(cors());
app.use(express.json());

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

// ── Manejo de rutas no encontradas ───────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Manejo global de errores ─────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Iniciar servidor ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor UNAMConnect corriendo en http://localhost:${PORT}`);
});
