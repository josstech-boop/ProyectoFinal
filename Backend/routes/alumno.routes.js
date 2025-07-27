const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/alumno.controller');

router.get('/grados/:gradoId/alumnos', alumnoController.getAlumnosByGrado);

module.exports = router;