const db = require('../database');

// Obtener todos los usuarios con rol 'alumno'
const getAlumnos = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, nombre, correo FROM usuarios WHERE rol = $1',
      ['alumno']
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
};

module.exports = { getAlumnos };
