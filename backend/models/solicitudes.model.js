const db = require('../config/db');

const Solicitudes = {
  getAll: async () => {
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       ORDER BY s.fecha_postulacion DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       WHERE s.id_solicitud = $1
    `, [id]);
    return rows[0];
  },

  getByUsuario: async (id_usuario) => {
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       WHERE s.id_usuario = $1
       ORDER BY s.fecha_postulacion DESC
    `, [id_usuario]);
    return rows;
  },

  create: async (solicitudData) => {
    const { id_usuario, id_curso, nota_obtenida, url_boleta_notas } = solicitudData;
    const { rows } = await db.query(`
      INSERT INTO solicitudes_tutor (id_usuario, id_curso, nota_obtenida, url_boleta_notas)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id_usuario, id_curso, nota_obtenida, url_boleta_notas]);
    return rows[0];
  },

  update: async (id, solicitudData) => {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(solicitudData)) {
      if (value !== undefined && key !== 'id_solicitud') {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return await Solicitudes.getById(id);

    values.push(id);
    const query = `
      UPDATE solicitudes_tutor 
      SET ${fields.join(', ')} 
      WHERE id_solicitud = $${i} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM solicitudes_tutor WHERE id_solicitud = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Solicitudes;
