const db = require('../database');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        // Verifica que la consulta SQL sea correcta
        const { rows } = await db.query('SELECT id, nombre, correo, rol FROM usuarios');
        console.log("Usuarios encontrados en DB:", rows.length); // Debug
        
        // Asegúrate de enviar el formato correcto
        res.json(rows);
    } catch (error) {
        console.error("Error en getUsers:", error);
        res.status(500).json({ 
            error: 'Error al obtener usuarios',
            details: error.message
        });
    }
};

// Crear un nuevo usuario (solo admin)
const createUser = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  // Validar roles permitidos
  const rolesPermitidos = ['admin', 'docente', 'alumno'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ error: 'Rol no válido' });
  }

  try {
    // Verificar si el correo ya existe
    const userExists = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar usuario
    const newUser = await db.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol',
      [nombre, correo, hashedPassword, rol]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol } = req.body;

  try {
    const { rows } = await db.query(
      'UPDATE usuarios SET nombre = $1, correo = $2, rol = $3 WHERE id = $4 RETURNING id, nombre, correo, rol',
      [nombre, correo, rol, id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};