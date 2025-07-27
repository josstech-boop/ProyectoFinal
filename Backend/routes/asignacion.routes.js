const express = require('express');
const router = express.Router();
const { getAsignaciones, crearAsignacion, eliminarAsignacion } = require('../controllers/asignacion.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Obtener todas las asignaciones
router.get('/admin/asignaciones', verifyToken, getAsignaciones);

// Crear nueva asignación
router.post('/asignacion-grado', verifyToken, crearAsignacion);

// Eliminar asignación por ID
router.delete('/asignacion-grado/:id', verifyToken, eliminarAsignacion);

module.exports = router;