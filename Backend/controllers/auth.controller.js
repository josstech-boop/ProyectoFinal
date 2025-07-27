const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Función para registrar usuarios
const register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await db.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol',
      [nombre, correo, hashedPassword, rol]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para login
const login = async (req, res) => {
  const { correo, password } = req.body;
  try {
    const user = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (!user.rows[0]) return res.status(400).json({ error: 'Credenciales inválidas' });
    
    const validPass = await bcrypt.compare(password, user.rows[0].password);
    if (!validPass) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.rows[0].id, rol: user.rows[0].rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };