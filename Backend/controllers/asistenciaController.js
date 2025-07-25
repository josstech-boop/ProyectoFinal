const db = require('../config/db');

const obtenerAlumnosPorGrado = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT u.id, u.nombre 
       FROM alumnos_grados ag
       JOIN usuarios u ON ag.alumno_id = u.id
       WHERE ag.grado_id = $1`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const { rows } = await db.query(
      'UPDATE asistencias SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrarAsistencia = async (req, res) => {
  try {
    const { gradoId, fecha, asistencias } = req.body;
    
    await db.query('BEGIN');
    
    for (const asistencia of asistencias) {
      await db.query(
        `INSERT INTO asistencias (alumno_id, grado_id, fecha, estado)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (alumno_id, fecha) 
         DO UPDATE SET estado = $4`,
        [asistencia.alumnoId, gradoId, fecha, asistencia.estado]
      );
    }
    
    await db.query('COMMIT');
    res.status(201).json({ message: 'Asistencias registradas correctamente' });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

const obtenerHistorialAlumno = async (req, res) => {
  try {
    const { desde, hasta, estado } = req.query;
    const alumnoId = req.usuario.id;
    
    let query = `
      SELECT a.id, a.fecha, a.estado, g.nombre as grado_nombre
      FROM asistencias a
      JOIN grados g ON a.grado_id = g.id
      WHERE a.alumno_id = $1
    `;
    const params = [alumnoId];
    
    if (desde) {
      query += ` AND a.fecha >= $${params.length + 1}`;
      params.push(desde);
    }
    if (hasta) {
      query += ` AND a.fecha <= $${params.length + 1}`;
      params.push(hasta);
    }
    if (estado) {
      query += ` AND a.estado = $${params.length + 1}`;
      params.push(estado);
    }
    
    query += ' ORDER BY a.fecha DESC';
    
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerAlumnosPorGrado,
  registrarAsistencia,
  actualizarAsistencia,
  obtenerHistorialAlumno 
};