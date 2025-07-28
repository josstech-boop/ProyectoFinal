const express = require('express');
const router = express.Router();
const pool = require('../database');  // Ajusta la ruta según tu estructura
const { register } = require('../controllers/usuario.controller');  
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAlumnos // Asegúrate de que esta función esté definida en tu controlador
} = require('../controllers/usuario.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

// Obtener todos los usuarios con rol 'alumno'
router.get('/admin/alumnos', verifyToken, getAlumnos);

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Solo admin puede gestionar usuarios
router.get('/', checkRole(['admin']), getUsers);
router.post('/', checkRole(['admin']), createUser);
router.put('/:id', checkRole(['admin']), updateUser);
router.delete('/:id', checkRole(['admin']), deleteUser);




module.exports = router;
