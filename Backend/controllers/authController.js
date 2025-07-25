// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registro de nuevos usuarios (solo admin puede registrar)
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validar roles permitidos
    const rolesPermitidos = ['alumno', 'docente', 'admin'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol no válido' });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await db.query(
      'SELECT * FROM usuarios WHERE correo = $1', 
      [correo]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const nuevoUsuario = await db.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, correo, hashedPassword, rol]
    );

    // Eliminar password del response
    const usuarioResponse = { ...nuevoUsuario.rows[0] };
    delete usuarioResponse.password;

    res.status(201).json(usuarioResponse);

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login de usuarios
const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar usuario
    const usuario = await db.query(
      'SELECT * FROM usuarios WHERE correo = $1', 
      [correo]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(
      password, 
      usuario.rows[0].password
    );

    if (!passwordValido) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.rows[0].id,
        nombre: usuario.rows[0].nombre,
        rol: usuario.rows[0].rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Respuesta sin password
    const usuarioResponse = { ...usuario.rows[0] };
    delete usuarioResponse.password;

    res.json({
      token,
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await db.query(
      'SELECT id, nombre, correo, rol FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario.rows[0]);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil
};