const bcrypt = require('bcryptjs');
const db = require('../config/db');

class Usuario {
  static async crear({ nombre, correo, password, rol }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO usuarios(nombre, correo, password, rol) VALUES($1, $2, $3, $4) RETURNING *',
      [nombre, correo, hashedPassword, rol]
    );
    return rows[0];
  }

  static async buscarPorCorreo(correo) {
    const { rows } = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return rows[0];
  }

  // Más métodos según necesidad...
}

module.exports = Usuario;