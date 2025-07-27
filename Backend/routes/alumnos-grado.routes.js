const express = require('express');
const router = express.Router();
const { crearAsignacion } = require('../controllers/asignacion.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/admin/alumnos-grado', verifyToken, crearAsignacion);

module.exports = router;