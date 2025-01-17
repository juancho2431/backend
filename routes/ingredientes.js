const express = require('express');
const router = express.Router();
const { Ingrediente } = require('../models');

// Obtener todos los ingredientes
router.get('/', async (req, res) => {
  try {
    const ingredientes = await Ingrediente.findAll();
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los ingredientes' });
  }
});

// Obtener un ingrediente específico
router.get('/:id', async (req, res) => {
  try {
    const ingredienteId = req.params.id;
    const ingrediente = await Ingrediente.findByPk(ingredienteId);

    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    res.json(ingrediente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el ingrediente' });
  }
});

// Crear un nuevo ingrediente
router.post('/', async (req, res) => {
  const { ingredientes } = req.body;

  if (!ingredientes || !Array.isArray(ingredientes)) {
    return res.status(400).json({ error: 'Debe proporcionar una lista de ingredientes.' });
  }

  try {
    // Iterar sobre los ingredientes y crear cada uno
    for (const ingrediente of ingredientes) {
      await Ingrediente.create({
        name: ingrediente.name,
        stock_current: ingrediente.stock_current,
        stock_minimum: ingrediente.stock_minimum,
      });
    }

    res.status(201).json({ message: 'Ingredientes creados con éxito' });
  } catch (error) {
    console.error('Error al crear el ingrediente:', error);
    res.status(500).json({ error: 'Error al crear el ingrediente' });
  }
});

// routes/ingrediente.js
router.put('/:id', async (req, res) => {
  try {
    const ingredienteId = req.params.id;
    const { name, stock_current, stock_minimum } = req.body;

    console.log('Datos recibidos:', req.body); // Agregar esta línea para depurar

    const ingrediente = await Ingrediente.findByPk(ingredienteId);
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingrediente.update({ name, stock_current, stock_minimum });
    res.json(ingrediente);
  } catch (error) {
    console.error('Error al actualizar el ingrediente:', error);
    res.status(500).json({ error: 'Error al actualizar el ingrediente' });
  }
});



// Eliminar un ingrediente
router.delete('/:id', async (req, res) => {
  try {
    const ingredienteId = req.params.id;

    const ingrediente = await Ingrediente.findByPk(ingredienteId);
    if (!ingrediente) {
      return res.status(404).json({ error: 'Ingrediente no encontrado' });
    }

    await ingrediente.destroy();
    res.json({ message: 'Ingrediente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el ingrediente' });
  }
});

module.exports = router;