const getAsistenciasByAlumnoId = async (req, res) => {
  const requestedId = req.params.id;
  const user = req.user;

  // Si es alumno, sólo puede ver sus asistencias
  if (user.rol.toLowerCase() === 'alumno' && user.id.toString() !== requestedId) {
    return res.status(403).json({ error: 'Acceso prohibido: no puedes ver asistencias de otros alumnos' });
  }

  try {
    // Aquí tu lógica para obtener asistencias desde la base de datos, por ejemplo:
    const asistencias = await db.query(
      'SELECT * FROM asistencias WHERE alumno_id = $1',
      [requestedId]
    );
    res.json(asistencias.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAsistenciasByAlumnoId };
