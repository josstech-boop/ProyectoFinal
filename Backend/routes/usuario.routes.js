const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usuario.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Solo admin puede gestionar usuarios
router.get('/', checkRole(['admin']), getUsers);
router.post('/', checkRole(['admin']), createUser);
router.put('/:id', checkRole(['admin']), updateUser);
router.delete('/:id', checkRole(['admin']), deleteUser);

module.exports = router;