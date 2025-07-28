const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middlewares/auth.middleware'); // Para proteger la ruta

// GET /api/docente/grados - Ver grados del docente logeado
router.get('/grados', auth, async (req, res) => {
  try {
    const docenteId = req.user.id; // ID del docente logeado (viene del middleware auth)

    // Consulta SQL
    const query = `
      SELECT g.id, g.nombre 
      FROM docentes_grados dg
      JOIN grados g ON dg.grado_id = g.id
      WHERE dg.docente_id = $1
      ORDER BY g.nombre ASC
    `;
    
    const { rows } = await pool.query(query, [docenteId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener grados del docente:', error);
    res.status(500).json({ error: 'Error al cargar grados' });
  }
});

// GET /api/docente/todos - Para admin: ver TODOS los docentes con sus grados
router.get('/todos', auth, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') { // Solo admin puede ver esto
      return res.status(403).json({ error: 'No autorizado' });
    }

    const query = `
      SELECT 
        u.id AS docente_id,
        u.nombre AS docente_nombre,
        g.id AS grado_id, 
        g.nombre AS grado_nombre
      FROM docentes_grados dg
      JOIN usuarios u ON dg.docente_id = u.id AND u.rol = 'docente'
      JOIN grados g ON dg.grado_id = g.id
      ORDER BY u.nombre, g.nombre
    `;
    
    const { rows } = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener docentes y grados:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;