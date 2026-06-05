// Controlador para la entidad Usuarios
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcryptjs');

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
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password } = req.body;
    
    // Hash de la contraseña si se proporciona, sino usar una por defecto o fallar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'unamconnect2026', salt);

    const nuevoUsuario = await Usuarios.create({
      id_carrera,
      codigo_univ,
      nombres,
      apellidos,
      correo,
      password: hashedPassword
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
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password } = req.body;
    
    const usuarioData = { id_carrera, codigo_univ, nombres, apellidos, correo };

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
