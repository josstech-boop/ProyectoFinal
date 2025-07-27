const express = require('express');
const router = express.Router();
const { auth, isAlumno } = require('../middlewares/auth.middleware');
const { Asistencia, Usuario, Grado } = require('../models');

// Historial de asistencias para el alumno logueado
router.get('/historial', auth, isAlumno, async (req, res) => {
  try {
    const historial = await Asistencia.findAll({
      where: { alumno_id: req.usuario.id },
      include: [
        { model: Grado, as: 'grado', attributes: ['nombre'] }
      ],
      order: [['fecha', 'DESC']] // Ordenar por fecha más reciente
    });

    // Calcular porcentaje de asistencia
    const total = historial.length;
    const presentes = historial.filter(a => a.estado === 'presente').length;
    const porcentaje = total > 0 ? ((presentes / total) * 100).toFixed(2) : 0;

    res.json({ historial, porcentaje });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

module.exports = router;