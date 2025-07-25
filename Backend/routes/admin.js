// routes/admin.js
const express = require('express');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  crearGrado,
  listarUsuarios,
  generarReporteGrado
} = require('../controllers/adminController');

const router = express.Router();

// Rutas de administrador
router.post('/grados', verificarToken, verificarRol(['admin']), crearGrado);
router.get('/usuarios', verificarToken, verificarRol(['admin']), listarUsuarios);
router.get('/reportes/grado/:id', verificarToken, verificarRol(['admin']), generarReporteGrado);

module.exports = router;