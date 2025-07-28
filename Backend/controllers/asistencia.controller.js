const pool = require('../database');

// Obtener asistencias con filtros opcionales
const getAsistencias = async (req, res) => {
  const { grado_id, fecha } = req.query;

  let baseQuery = `
    SELECT a.id, u.nombre AS alumno_nombre, g.nombre AS grado_nombre, a.fecha, a.estado
    FROM asistencias a
    INNER JOIN usuarios u ON u.id = a.alumno_id
    INNER JOIN grados g ON g.id = a.grado_id
    WHERE 1 = 1
  `;
  const params = [];

  if (grado_id) {
    params.push(grado_id);
    baseQuery += ` AND a.grado_id = $${params.length}`;
  }

  if (fecha) {
    params.push(fecha);
    baseQuery += ` AND a.fecha = $${params.length}`;
  }

  try {
    const result = await pool.query(baseQuery, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
};

// Registrar nueva asistencia
const crearAsistencia = async (req, res) => {
  const { alumno_id, fecha, estado } = req.body;

  if (!alumno_id || !fecha || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Buscar el grado del alumno desde alumnos_grados
    const gradoQuery = await pool.query(
      'SELECT grado_id FROM alumnos_grados WHERE alumno_id = $1 LIMIT 1',
      [alumno_id]
    );

    if (gradoQuery.rows.length === 0) {
      return res.status(400).json({ error: "Este alumno no está asignado a ningún grado" });
    }

    const grado_id = gradoQuery.rows[0].grado_id;

    // Insertar asistencia
    const insert = await pool.query(
      'INSERT INTO asistencias (alumno_id, grado_id, fecha, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [alumno_id, grado_id, fecha, estado]
    );

    res.status(201).json(insert.rows[0]);

  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    res.status(500).json({ error: "Error al registrar asistencia" });
  }
};

// Eliminar asistencia
const eliminarAsistencia = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM asistencias WHERE id = $1', [id]);
    res.json({ message: 'Asistencia eliminada' });
  } catch (error) {
    console.error("Error al eliminar asistencia:", error);
    res.status(500).json({ error: "Error al eliminar asistencia" });
  }
};

module.exports = {
  getAsistencias,
  crearAsistencia,
  eliminarAsistencia
};