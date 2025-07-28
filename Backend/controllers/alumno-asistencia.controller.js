// backend/controllers/alumno-asistencia.controller.js
const db = require('../database');

const getAsistenciasByAlumnoId = async (req, res) => {
  const alumnoId = parseInt(req.params.id, 10);

  // Validar que solo admin o el mismo alumno puedan ver los datos
  if (req.user.rol !== 'admin' && req.user.id !== alumnoId) {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }

  try {
    const query = `
      SELECT fecha, estado 
      FROM asistencias 
      WHERE alumno_id = $1
      ORDER BY fecha DESC
    `;

    const result = await db.query(query, [alumnoId]);

    res.json(result.rows); // Aquí regresa el listado de asistencias
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asistencias' });
  }
};

module.exports = { getAsistenciasByAlumnoId };
