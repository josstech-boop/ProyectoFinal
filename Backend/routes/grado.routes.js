const express = require('express');
const router = express.Router();
const db = require('../database'); // ajusta la ruta según tu proyecto
const verificarToken = require('../middlewares/auth.middleware'); // middleware de autenticación

// GET todos los grados
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM grados ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener grados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST nuevo grado
router.post('/', verificarToken, async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    const result = await db.query(
      'INSERT INTO grados(nombre) VALUES($1) RETURNING *',
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear grado:', error);
    if (error.code === '23505') { // Violación de restricción unique
      return res.status(400).json({ error: 'El nombre del grado ya existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT actualizar grado
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    await db.query('UPDATE grados SET nombre=$1 WHERE id=$2', [nombre, id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al actualizar grado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE grado
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM grados WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar grado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;