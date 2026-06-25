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

  getByUsuario: async (id_usuario, rol_destino) => {
    if (rol_destino) {
      const { rows } = await db.query(
        'SELECT * FROM notificaciones WHERE id_usuario = $1 AND rol_destino = $2 ORDER BY fecha_envio DESC',
        [id_usuario, rol_destino]
      );
      return rows;
    }
    const { rows } = await db.query(
      'SELECT * FROM notificaciones WHERE id_usuario = $1 ORDER BY fecha_envio DESC',
      [id_usuario]
    );
    return rows;
  },

  create: async (notificacionData) => {
    const { id_usuario, mensaje, rol_destino } = notificacionData;
    const { rows } = await db.query(
      'INSERT INTO notificaciones (id_usuario, mensaje, rol_destino) VALUES ($1, $2, $3) RETURNING *',
      [id_usuario, mensaje, rol_destino || 'alumno']
    );
    return rows[0];
  },

  update: async (id, notificacionData) => {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(notificacionData)) {
      if (value !== undefined && key !== 'id_notificacion') {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return await Notificaciones.getById(id);

    values.push(id);
    const query = `
      UPDATE notificaciones 
      SET ${fields.join(', ')} 
      WHERE id_notificacion = $${i} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
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
