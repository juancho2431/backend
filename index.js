// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Importar las rutas de arepas, ingredientes, bebidas, y ventas
const arepaRoutes = require('./routes/arepas');
const ingredienteRoutes = require('./routes/ingredientes');
const bebidaRoutes = require('./routes/bebidas');
const ventasRoutes = require('./routes/ventas');
const empleadosRouter = require('./routes/empleados');
const loginRoutes = require('./routes/auth');

// Middleware para analizar JSON

app.use(express.json());

// Middleware para manejar CORS
app.use(cors());

// Registrar las rutas de la API
app.use('/api/arepas', arepaRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/bebidas', bebidaRoutes);
app.use('/api/ventas', ventasRoutes); // Registrar la ruta de ventas
app.use('/api/empleados', empleadosRouter);
app.use('/api/login', loginRoutes);


// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ha ocurrido un error en el servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
