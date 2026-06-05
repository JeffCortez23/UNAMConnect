const db = require('../config/db');

const Notificaciones = {
  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM notificaciones ORDER BY fecha_envio DESC');
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query('SELECT * FROM notificaciones WHERE id_notificacion = $1', [id]);
    return rows[0];
  },

  getByUsuario: async (id_usuario) => {
    const { rows } = await db.query(
      'SELECT * FROM notificaciones WHERE id_usuario = $1 ORDER BY fecha_envio DESC',
      [id_usuario]
    );
    return rows;
  },

  create: async (notificacionData) => {
    const { id_usuario, mensaje } = notificacionData;
    const { rows } = await db.query(
      'INSERT INTO notificaciones (id_usuario, mensaje) VALUES ($1, $2) RETURNING *',
      [id_usuario, mensaje]
    );
    return rows[0];
  },

  update: async (id, notificacionData) => {
    const { id_usuario, mensaje, leido } = notificacionData;
    const { rows } = await db.query(
      'UPDATE notificaciones SET id_usuario = $1, mensaje = $2, leido = $3 WHERE id_notificacion = $4 RETURNING *',
      [id_usuario, mensaje, leido, id]
    );
    return rows[0];
  },

  marcarLeida: async (id) => {
    const { rows } = await db.query(
      'UPDATE notificaciones SET leido = true WHERE id_notificacion = $1 RETURNING *',
      [id]
    );
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM notificaciones WHERE id_notificacion = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Notificaciones;
