const db = require('../config/db');

const Roles = {
  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM roles ORDER BY id_rol');
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query('SELECT * FROM roles WHERE id_rol = $1', [id]);
    return rows[0];
  },

  create: async (rolData) => {
    const { nombre_rol } = rolData;
    const { rows } = await db.query(
      'INSERT INTO roles (nombre_rol) VALUES ($1) RETURNING *',
      [nombre_rol]
    );
    return rows[0];
  },

  update: async (id, rolData) => {
    const { nombre_rol } = rolData;
    const { rows } = await db.query(
      'UPDATE roles SET nombre_rol = $1 WHERE id_rol = $2 RETURNING *',
      [nombre_rol, id]
    );
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM roles WHERE id_rol = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Roles;
