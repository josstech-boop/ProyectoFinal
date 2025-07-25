const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { 
  registrarUsuario, 
  loginUsuario,
  obtenerPerfil
} = require('../controllers/authController');
const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const usuario = await Usuario.crear(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/profile', obtenerPerfil); // Requiere middleware de autenticación

// Login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  
  try {
    const usuario = await Usuario.buscarPorCorreo(correo);
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;