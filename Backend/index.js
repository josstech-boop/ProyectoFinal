require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const gradoRoutes = require('./routes/grado.routes.js'); // ajusta ruta según estructura
const alumnosGradoRoutes = require('./routes/alumnos-grado.routes');
const alumnoRoutes = require('./routes/alumno.routes');
const asignacionRoutes = require('./routes/asignacion.routes');
const asistenciaRoutes = require('./routes/asistencia.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin/usuarios', usuarioRoutes);
app.use('/api/admin/alumnos-grado', alumnosGradoRoutes);
app.use('/api/admin/grados', gradoRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api', asignacionRoutes);
app.use('/api', asistenciaRoutes);



// Iniciar servidor
const PORT = process.env.PORT || 5000;
db.connect().then(() => {
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
});
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);