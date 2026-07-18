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
    const userRes = await db.query(
      'SELECT id_carrera, ciclo_actual, cursos_aprobados FROM usuarios WHERE id_usuario = $1',
      [id_usuario]
    );
    const user = userRes.rows[0];
    const careerId = user ? user.id_carrera : 1;
    const cicloActual = user ? (user.ciclo_actual || 10) : 10;
    const cursosAprobados = user ? (user.cursos_aprobados || []) : [];

    const query = `
      SELECT s.id_solicitud, s.id_usuario, s.id_curso, s.nota_obtenida, s.url_boleta_notas, s.estado_solicitud, s.fecha_postulacion,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       WHERE s.id_usuario = $1
       
      UNION
      
      SELECT 
         -(c.id_curso) AS id_solicitud,
         $1 AS id_usuario,
         c.id_curso,
         20.00 AS nota_obtenida,
         'auto' AS url_boleta_notas,
         'aprobada' AS estado_solicitud,
         NOW() AS fecha_postulacion,
         u.nombres || ' ' || u.apellidos AS nombre_solicitante,
         c.nombre_curso
       FROM cursos c
       JOIN usuarios u ON u.id_usuario = $1
       WHERE c.id_carrera = $2 AND c.ciclo < $3
         AND c.id_curso NOT IN (SELECT id_curso FROM solicitudes_tutor WHERE id_usuario = $1)
         AND c.id_curso = ANY($4::int[])
         
       ORDER BY fecha_postulacion DESC
    `;
    const { rows } = await db.query(query, [id_usuario, careerId, cicloActual, cursosAprobados]);
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

    // Solo permitir columnas reales de la tabla
    const allowedColumns = ['id_usuario', 'id_curso', 'nota_obtenida', 'url_boleta_notas', 'estado_solicitud', 'fecha_postulacion', 'motivo_rechazo'];

    for (const [key, value] of Object.entries(solicitudData)) {
      if (value !== undefined && allowedColumns.includes(key)) {
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
