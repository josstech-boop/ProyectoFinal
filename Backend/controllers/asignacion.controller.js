const db = require('../database');

// Obtener todas las asignaciones con nombres
const getAsignaciones = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT   ag.alumno_id, 
  u.nombre AS alumno_nombre, 
  g.nombre AS grado_nombre
FROM alumnos_grados ag
JOIN usuarios u ON ag.alumno_id = u.id
JOIN grados g ON ag.grado_id = g.id;

    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener asignaciones:', error);
    res.status(500).json({ error: 'Error al obtener asignaciones' });
  }
};

// Crear una nueva asignación
const crearAsignacion = async (req, res) => {
  const { alumno_id, grado_id } = req.body;
  if (!alumno_id || !grado_id) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const result = await db.query(
      'INSERT INTO alumnos_grados (alumno_id, grado_id) VALUES ($1, $2) RETURNING *',
      [alumno_id, grado_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al asignar alumno:', error);
    res.status(500).json({ error: 'Error al asignar alumno' });
  }
};

// Eliminar asignación por ID
const eliminarAsignacion = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM alumnos_grados WHERE id = $1', [id]);
    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    res.status(500).json({ error: 'Error al eliminar asignación' });
  }
};

module.exports = {
  getAsignaciones,
  crearAsignacion,
  eliminarAsignacion
};