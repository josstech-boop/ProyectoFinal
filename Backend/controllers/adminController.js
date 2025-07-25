// controllers/adminController.js
const db = require('../config/db');

// CRUD para grados
const crearGrado = async (req, res) => {
  try {
    const { nombre } = req.body;
    const { rows } = await db.query(
      'INSERT INTO grados (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CRUD para usuarios
const listarUsuarios = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, nombre, correo, rol FROM usuarios'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    const { rows } = await db.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol',
      [nombre, correo, password, rol]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Asignación de docentes a grados
const asignarDocenteGrado = async (req, res) => {
  try {
    const { docente_id, grado_id } = req.body;
    await db.query(
      'INSERT INTO docentes_grados (docente_id, grado_id) VALUES ($1, $2)',
      [docente_id, grado_id]
    );
    res.status(201).json({ message: 'Docente asignado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reportes
const generarReporteGrado = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await db.query(`
      SELECT 
        g.nombre as grado,
        COUNT(CASE WHEN a.estado = 'presente' THEN 1 END) as presentes,
        COUNT(CASE WHEN a.estado = 'ausente' THEN 1 END) as ausentes,
        COUNT(CASE WHEN a.estado = 'justificado' THEN 1 END) as justificados
      FROM grados g
      LEFT JOIN asistencias a ON g.id = a.grado_id
      WHERE g.id = $1
      GROUP BY g.nombre
    `, [id]);
    
    res.json(reporte.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearGrado,
  listarUsuarios,
  crearUsuario,
  asignarDocenteGrado,
  generarReporteGrado
};