const express = require('express');
const router = express.Router();
const {
  getAsistencias,
  crearAsistencia,
  eliminarAsistencia
} = require('../controllers/asistencia.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

router.use(verifyToken);
router.use(checkRole(['admin', 'docente']));

router.get('/admin/asistencias', getAsistencias);
router.post('/admin/asistencias', crearAsistencia);
router.delete('/admin/asistencias/:id', eliminarAsistencia);

module.exports = router;
