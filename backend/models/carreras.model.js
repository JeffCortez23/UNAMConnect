const db = require('../config/db');

const Carreras = {
  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM carreras ORDER BY id_carrera');
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query('SELECT * FROM carreras WHERE id_carrera = $1', [id]);
    return rows[0];
  },

  create: async (carreraData) => {
    const { nombre_carrera, facultad } = carreraData;
    const { rows } = await db.query(
      'INSERT INTO carreras (nombre_carrera, facultad) VALUES ($1, $2) RETURNING *',
      [nombre_carrera, facultad]
    );
    return rows[0];
  },

  update: async (id, carreraData) => {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(carreraData)) {
      if (value !== undefined && key !== 'id_carrera') {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return await Carreras.getById(id);

    values.push(id);
    const query = `
      UPDATE carreras 
      SET ${fields.join(', ')} 
      WHERE id_carrera = $${i} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM carreras WHERE id_carrera = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Carreras;
