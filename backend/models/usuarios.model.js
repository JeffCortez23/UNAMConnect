const db = require('../config/db');

const Usuarios = {
  getAll: async () => {
    const { rows } = await db.query(
      `SELECT u.id_usuario, u.id_carrera, u.codigo_univ, u.nombres, u.apellidos, u.correo, c.nombre_carrera
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       ORDER BY u.id_usuario`
    );
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(
      `SELECT u.id_usuario, u.id_carrera, u.codigo_univ, u.nombres, u.apellidos, u.correo, c.nombre_carrera
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       WHERE u.id_usuario = $1`,
      [id]
    );
    return rows[0];
  },

  getByCorreo: async (correo) => {
    const { rows } = await db.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );
    return rows[0];
  },

  create: async (usuarioData) => {
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password } = usuarioData;
    const { rows } = await db.query(
      `INSERT INTO usuarios (id_carrera, codigo_univ, nombres, apellidos, correo, password)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario, id_carrera, codigo_univ, nombres, apellidos, correo`,
      [id_carrera, codigo_univ, nombres, apellidos, correo, password]
    );
    return rows[0];
  },

  update: async (id, usuarioData) => {
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password } = usuarioData;
    
    let query = `UPDATE usuarios SET id_carrera = $1, codigo_univ = $2, nombres = $3, apellidos = $4, correo = $5`;
    let values = [id_carrera, codigo_univ, nombres, apellidos, correo];

    if (password) {
      query += `, password = $6 WHERE id_usuario = $7 RETURNING id_usuario, id_carrera, codigo_univ, nombres, apellidos, correo`;
      values.push(password, id);
    } else {
      query += ` WHERE id_usuario = $6 RETURNING id_usuario, id_carrera, codigo_univ, nombres, apellidos, correo`;
      values.push(id);
    }

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *',
      [id]
    );
    return rows[0];
  },

  getRoles: async (id) => {
    const { rows } = await db.query(
      `SELECT r.*
       FROM usuario_roles ur
       JOIN roles r ON ur.id_rol = r.id_rol
       WHERE ur.id_usuario = $1`,
      [id]
    );
    return rows;
  },

  addRol: async (id, id_rol) => {
    const { rows } = await db.query(
      'INSERT INTO usuario_roles (id_usuario, id_rol) VALUES ($1, $2) RETURNING *',
      [id, id_rol]
    );
    return rows[0];
  },

  removeRol: async (id, idRol) => {
    const { rows } = await db.query(
      'DELETE FROM usuario_roles WHERE id_usuario = $1 AND id_rol = $2 RETURNING *',
      [id, idRol]
    );
    return rows[0];
  }
};

module.exports = Usuarios;
