const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD.toString(), // Asegura que sea string
  port: process.env.DB_PORT,
});

// Verifica la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  } else {
    console.log('Conexión a PostgreSQL exitosa');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};