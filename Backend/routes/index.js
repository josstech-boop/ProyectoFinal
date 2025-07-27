const express = require('express');
const path = require('path');
const router = express.Router();

// Servir archivos estáticos del frontend
router.use(express.static(path.join(__dirname, '../../frontend/src')));

// Ruta para dashboard
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/src/pages/dashboard.html'));
});



module.exports = router;