const express = require('express');
const router = express.Router();
const db = require('../database');
const verificarToken = require('../middlewares/auth.middleware');


// GET todos los grados con el docente asignado (si existe)
router.get('/', verificarToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.id, g.nombre, dg.docente_id
      FROM grados g
      LEFT JOIN docentes_grados dg ON g.id = dg.grado_id
      ORDER BY g.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener grados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST nuevo grado con asignación de docente opcional
router.post('/', verificarToken, async (req, res) => {
  const { nombre, docente_id } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      'INSERT INTO grados(nombre) VALUES($1) RETURNING *',
      [nombre]
    );

    const grado = result.rows[0];

    if (docente_id) {
      // Asegurarte que docente_id sea número
      const docenteIdNum = Number(docente_id);
      if (isNaN(docenteIdNum)) {
        throw new Error('docente_id debe ser un número válido');
      }
      console.log(`Asignando docente_id ${docenteIdNum} al grado_id ${grado.id}`);
      await client.query(
        'INSERT INTO docentes_grados(grado_id, docente_id) VALUES ($1, $2)',
        [grado.id, docenteIdNum]
      );
    }

    await client.query('COMMIT');

    res.status(201).json(grado);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear grado:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El nombre del grado ya existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// PUT actualizar grado y asignación docente
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, docente_id } = req.body;

  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE grados SET nombre=$1 WHERE id=$2',
      [nombre, id]
    );

    // Eliminar relación previa (si existe)
    await client.query(
      'DELETE FROM docentes_grados WHERE grado_id=$1',
      [id]
    );

    if (docente_id) {
      const docenteIdNum = Number(docente_id);
      if (isNaN(docenteIdNum)) {
        throw new Error('docente_id debe ser un número válido');
      }
      console.log(`Actualizando docente_id ${docenteIdNum} para grado_id ${id}`);
      await client.query(
        'INSERT INTO docentes_grados(grado_id, docente_id) VALUES ($1, $2)',
        [id, docenteIdNum]
      );
    }

    await client.query('COMMIT');

    res.sendStatus(204);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar grado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// DELETE grado (opcionalmente eliminar relaciones)
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Eliminar relaciones primero para evitar FK error
    await client.query('DELETE FROM docentes_grados WHERE grado_id=$1', [id]);

    // Eliminar grado
    await client.query('DELETE FROM grados WHERE id=$1', [id]);

    await client.query('COMMIT');
    res.sendStatus(204);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar grado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

module.exports = router;