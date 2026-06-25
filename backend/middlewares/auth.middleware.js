const jwt = require('jsonwebtoken');

/**
 * Middleware para requerir autenticación vía JWT
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token faltante o inválido.' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'unamconnect_secret_key_2026';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id: usuario.id_usuario, correo: usuario.correo }
    next();
  } catch (error) {
    console.error('Error al verificar JWT:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

/**
 * Middleware para requerir un rol específico.
 * Depende de que requireAuth haya sido ejecutado previamente.
 */
const requireRole = (rolesPermitidos) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'No autenticado.' });
    }

    try {
      // Necesitamos verificar los roles del usuario desde la BD
      const Usuarios = require('../models/usuarios.model');
      const rolesUsuario = await Usuarios.getRoles(req.user.id);
      
      const tieneRol = rolesUsuario.some(r => rolesPermitidos.includes(r.nombre_rol));

      if (!tieneRol) {
        return res.status(403).json({ error: 'Acceso prohibido. No tienes los permisos necesarios.' });
      }

      next();
    } catch (error) {
      console.error('Error en requireRole:', error);
      return res.status(500).json({ error: 'Error interno de autorización.' });
    }
  };
};

module.exports = {
  requireAuth,
  requireRole
};
