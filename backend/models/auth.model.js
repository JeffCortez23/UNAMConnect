const db = require('../config/db');

const Auth = {
  findByCorreo: async (correo) => {
    const { rows } = await db.query(
      `SELECT u.*, c.nombre_carrera 
       FROM usuarios u
       LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
       WHERE u.correo = $1`,
      [correo]
    );
    return rows[0];
  },

  register: async (userData) => {
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password, ano_ingreso, ciclo_actual, cursos_aprobados } = userData;
    const { rows } = await db.query(
      'INSERT INTO usuarios (id_carrera, codigo_univ, nombres, apellidos, correo, password, ano_ingreso, ciclo_actual, cursos_aprobados) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_usuario, correo, ano_ingreso, ciclo_actual, cursos_aprobados',
      [id_carrera, codigo_univ, nombres, apellidos, correo, password, ano_ingreso, ciclo_actual, JSON.stringify(cursos_aprobados || [])]
    );
    return rows[0];
  }
};

module.exports = Auth;
