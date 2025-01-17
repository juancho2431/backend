// routes/login.js
const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleado');

// Ruta para manejar el inicio de sesión
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar un empleado con el nombre de usuario y contraseña proporcionados
    const empleado = await Empleado.findOne({ where: { usuario: username, contraseña: password } });
    if (!empleado) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    // Si se encuentra el empleado, devolver la información necesaria
    res.json({ username: empleado.usuario, role: empleado.rol });
  } catch (error) {
    console.error('Error al autenticar:', error);
    res.status(500).json({ error: 'Error al autenticar' });
  }
});

module.exports = router;
