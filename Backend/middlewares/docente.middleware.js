const jwt = require('jsonwebtoken');
const pool = require('./database');

// Middleware para verificar si es admin
const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
};

// Middleware para verificar si es docente o admin
const isDocenteOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.user;
    
    // Verificar si es admin (puede ver todo)
    if (req.user.rol === 'admin') return next();
    
    // Verificar si es docente y tiene permiso
    if (req.user.rol === 'docente') {
      // Para rutas donde el docente solo puede ver sus datos
      if (req.params.docente_id && req.params.docente_id !== id) {
        return res.status(403).json({ error: 'Solo puedes acceder a tus datos' });
      }
      return next();
    }
    
    res.status(403).json({ error: 'Acceso no autorizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error de verificación de permisos' });
  }
};

// Middleware específico para docentes-grados
const checkDocenteGrado = async (req, res, next) => {
  if (req.user.rol === 'admin') return next();
  
  try {
    const { docente_id, grado_id } = req.params;
    const result = await pool.query(
      'SELECT 1 FROM docentes_grados WHERE docente_id = $1 AND grado_id = $2',
      [docente_id || req.user.id, grado_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'No tienes asignado este grado' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar asignación' });
  }
};

module.exports = {
  isAdmin,
  isDocenteOrAdmin,
  checkDocenteGrado
};