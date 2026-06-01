// Controlador para la entidad Usuarios
const db = require('../config/db');

// Obtener todos los usuarios (con nombre de carrera)
const obtenerUsuarios = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT u.*, c.nombre_carrera
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       ORDER BY u.id_usuario`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT u.*, c.nombre_carrera
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       WHERE u.id_usuario = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const { id_carrera, codigo_univ, nombres, apellidos, correo } = req.body;
    const { rows } = await db.query(
      `INSERT INTO usuarios (id_carrera, codigo_univ, nombres, apellidos, correo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_carrera, codigo_univ, nombres, apellidos, correo]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar un usuario existente
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_carrera, codigo_univ, nombres, apellidos, correo } = req.body;
    const { rows } = await db.query(
      `UPDATE usuarios
       SET id_carrera = $1, codigo_univ = $2, nombres = $3, apellidos = $4, correo = $5
       WHERE id_usuario = $6 RETURNING *`,
      [id_carrera, codigo_univ, nombres, apellidos, correo, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Obtener los roles de un usuario
const obtenerRolesDeUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT r.*
       FROM usuario_roles ur
       JOIN roles r ON ur.id_rol = r.id_rol
       WHERE ur.id_usuario = $1`,
      [id]
    );
    res.json(rows);
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
    const { rows } = await db.query(
      'INSERT INTO usuario_roles (id_usuario, id_rol) VALUES ($1, $2) RETURNING *',
      [id, id_rol]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al asignar rol al usuario:', error);
    res.status(500).json({ error: 'Error al asignar rol al usuario' });
  }
};

// Eliminar un rol de un usuario
const eliminarRolDeUsuario = async (req, res) => {
  try {
    const { id, idRol } = req.params;
    const { rows } = await db.query(
      'DELETE FROM usuario_roles WHERE id_usuario = $1 AND id_rol = $2 RETURNING *',
      [id, idRol]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rol de usuario no encontrado' });
    }
    res.json(rows[0]);
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
