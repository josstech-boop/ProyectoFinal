require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const gradoRoutes = require('./routes/grado.routes.js'); // ajusta ruta según estructura
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin/usuarios', usuarioRoutes);

app.use('/api/admin/grados', gradoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
db.connect().then(() => {
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
});
