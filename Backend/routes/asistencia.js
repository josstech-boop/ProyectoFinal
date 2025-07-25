// const express = require('express');
// const { verificarToken, verificarRol } = require('../middlewares/auth');
// const asistenciaController = require('../controllers/asistenciaController');

// const router = express.Router();

// // Rutas para docentes
// router.get('/grado/:id', verificarToken, verificarRol(['docente']), asistenciaController.obtenerAlumnosPorGrado);
// router.post('/', verificarToken, verificarRol(['docente']), asistenciaController.registrarAsistencia);
// router.put('/:id', verificarToken, verificarRol(['docente']), asistenciaController.actualizarAsistencia);

// // Ruta para alumnos
// router.get('/historial', verificarToken, verificarRol(['alumno']), asistenciaController.obtenerHistorialAlumno);

// module.exports = router;

const express = require('express');
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerAlumnosPorGrado,
  registrarAsistencia,
  actualizarAsistencia,
  obtenerHistorialAlumno// ¡Asegúrate de que este método exista!
} = require('../controllers/asistenciaController');

const router = express.Router();

// Rutas para docentes
router.get('/grado/:id', verificarToken, verificarRol(['docente']), obtenerAlumnosPorGrado);
router.post('/', verificarToken, verificarRol(['docente']), registrarAsistencia);
router.put('/:id', verificarToken, verificarRol(['docente']), actualizarAsistencia); // ← ¡Aquí debe ir una función!

// Ruta para alumnos
router.get('/historial', verificarToken, verificarRol(['alumno']), obtenerHistorialAlumno);

module.exports = router;