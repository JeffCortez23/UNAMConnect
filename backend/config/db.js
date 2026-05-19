const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Verificar conexión al iniciar
pool.connect()
  .then((client) => {
    console.log('✅ Conexión exitosa a PostgreSQL');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
