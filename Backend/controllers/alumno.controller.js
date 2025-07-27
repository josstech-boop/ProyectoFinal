const pool = require('../database');

exports.getAlumnosByGrado = async (req, res) => {
  try {
    const { gradoId } = req.params;
    const query = `
      SELECT u.id, u.nombre, u.apellido 
      FROM usuarios u
      INNER JOIN alumnos_grados ag ON u.id = ag.alumno_id
      WHERE ag.grado_id = $1 AND u.rol = 'alumno'
    `;
    const { rows } = await pool.query(query, [gradoId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};