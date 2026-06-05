const db = require('../config/db');

const Auth = {
  findByCorreo: async (correo) => {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return rows[0];
  },

  register: async (userData) => {
    const { id_carrera, codigo_univ, nombres, apellidos, correo, password } = userData;
    const { rows } = await db.query(
      'INSERT INTO usuarios (id_carrera, codigo_univ, nombres, apellidos, correo, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario, correo',
      [id_carrera, codigo_univ, nombres, apellidos, correo, password]
    );
    return rows[0];
  }
};

module.exports = Auth;
