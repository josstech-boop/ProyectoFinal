const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { auth, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - password
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               rol:
 *                 type: string
 *                 enum: [admin, docente, alumno]
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/usuarios', auth, isAdmin, async (req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;

        // Validar rol
        if (!['admin', 'docente', 'alumno'].includes(rol)) {
            return res.status(400).json({ error: 'Rol inválido' });
        }

        // Verificar si el correo ya existe
        const existeUsuario = await Usuario.findOne({ where: { correo } });
        if (existeUsuario) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const usuario = await Usuario.create({
            nombre,
            correo,
            password: hashedPassword,
            rol
        });

        // No devolver la contraseña en la respuesta
        const usuarioResponse = usuario.get({ plain: true });
        delete usuarioResponse.password;

        res.status(201).json(usuarioResponse);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;