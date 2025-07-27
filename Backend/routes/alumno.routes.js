const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { getAlumnos } = require('../controllers/alumno.controller');

// Proteger todas las rutas con token
router.use(verifyToken);

// Ruta: GET /api/alumnos
router.get('/', getAlumnos);

module.exports = router;