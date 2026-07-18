// Controlador para la entidad Usuarios
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcryptjs');

// ── Sanitización de URLs ─────────────────────────────
// Solo se permiten URLs de dominios de confianza (Firebase Storage, etc.)
const TRUSTED_URL_DOMAINS = [
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  // En producción agregar CDN propio si se usa
];

/**
 * Valida que una URL sea de un dominio de confianza.
 * @param {string} url - La URL a validar
 * @returns {{ valid: boolean, error?: string }}
 */
function sanitizeUrl(url) {
  if (!url) return { valid: true }; // Campo opcional, si no viene está ok
  try {
    const parsed = new URL(url);
    // Solo permitir HTTPS (excepto en desarrollo)
    if (parsed.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      return { valid: false, error: 'Las URLs deben usar HTTPS.' };
    }
    // En desarrollo, permitir localtunnel, localhost y 127.0.0.1
    const allowedLocalDomains = ['localhost', '127.0.0.1'];
    const isLocalOrTunnel = process.env.NODE_ENV !== 'production' && 
      (allowedLocalDomains.includes(parsed.hostname) || parsed.hostname.endsWith('.loca.lt'));

    // Verificar que el dominio esté en la lista de confianza o sea local/tunnel
    const isDomainTrusted = TRUSTED_URL_DOMAINS.some(domain => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)) || isLocalOrTunnel;
    if (!isDomainTrusted) {
      return { valid: false, error: `Dominio no permitido: ${parsed.hostname}. Solo se aceptan archivos subidos a Firebase Storage.` };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, error: 'URL con formato inválido.' };
  }
}

// Obtener todos los usuarios (con nombre de carrera)
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.getAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.getById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password, ano_ingreso, ciclo_actual, url_historial_academico } = req.body;

    // Sanitizar URL del historial académico
    const urlCheck = sanitizeUrl(url_historial_academico);
    if (!urlCheck.valid) {
      return res.status(400).json({ error: urlCheck.error });
    }
    if (!password) {
      return res.status(400).json({ error: 'La contraseña es obligatoria para registrar un usuario.' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await Usuarios.create({
      id_carrera,
      codigo_univ,
      nombres,
      apellidos,
      correo,
      password: hashedPassword,
      ano_ingreso,
      ciclo_actual,
      url_historial_academico
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar un usuario existente
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password, ano_ingreso, ciclo_actual, cursos_aprobados, url_historial_academico } = req.body;

    // Sanitizar URL del historial académico
    const urlCheck = sanitizeUrl(url_historial_academico);
    if (!urlCheck.valid) {
      return res.status(400).json({ error: urlCheck.error });
    }

    const usuarioData = { id_carrera, codigo_univ, nombres, apellidos, correo, ano_ingreso, ciclo_actual, cursos_aprobados, url_historial_academico };

    // Validar que si ciclo_actual > 1, obligatoriamente se requiere url_historial_academico
    if (ciclo_actual !== undefined && Number(ciclo_actual) > 1) {
      const existingUser = await Usuarios.getById(id);
      const docUrl = url_historial_academico || (existingUser ? existingUser.url_historial_academico : null);
      if (!docUrl) {
        return res.status(400).json({
          error: 'Es obligatorio adjuntar tu boleta de notas o historial académico para declarar un ciclo mayor a 1.'
        });
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      usuarioData.password = await bcrypt.hash(password, salt);
    }

    const usuarioActualizado = await Usuarios.update(id, usuarioData);
    
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await Usuarios.delete(id);
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioEliminado);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Obtener los roles de un usuario
const obtenerRolesDeUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const roles = await Usuarios.getRoles(id);
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles del usuario:', error);
    res.status(500).json({ error: 'Error al obtener roles del usuario' });
  }
};

// Asignar un rol a un usuario
const asignarRolAUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_rol } = req.body;
    const nuevoRolUsuario = await Usuarios.addRol(id, id_rol);
    res.status(201).json(nuevoRolUsuario);
  } catch (error) {
    console.error('Error al asignar rol al usuario:', error);
    res.status(500).json({ error: 'Error al asignar rol al usuario' });
  }
};

// Eliminar un rol de un usuario
const eliminarRolDeUsuario = async (req, res) => {
  try {
    const { id, idRol } = req.params;
    const rolEliminado = await Usuarios.removeRol(id, idRol);
    if (!rolEliminado) {
      return res.status(404).json({ error: 'Rol de usuario no encontrado' });
    }
    res.json(rolEliminado);
  } catch (error) {
    console.error('Error al eliminar rol del usuario:', error);
    res.status(500).json({ error: 'Error al eliminar rol del usuario' });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRolesDeUsuario,
  asignarRolAUsuario,
  eliminarRolDeUsuario,
};
