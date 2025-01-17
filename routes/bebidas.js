const express = require('express');
const router = express.Router();
const { Bebida } = require('../models');

// Obtener todas las bebidas
router.get('/', async (req, res) => {
  try {
    const bebidas = await Bebida.findAll();
    res.json(bebidas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las bebidas' });
  }
});

// Obtener una bebida específica
router.get('/:id', async (req, res) => {
  try {
    const bebidaId = req.params.id;
    const bebida = await Bebida.findByPk(bebidaId);
    if (!bebida) {
      return res.status(404).json({ error: 'Bebida no encontrada' });
    }
    res.json(bebida);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la bebida' });
  }
});

// Crear una nueva bebida
router.post('/', async (req, res) => {
  try {
    const { name, stock, price } = req.body;
    const nuevaBebida = await Bebida.create({ name, stock, price });
    res.status(201).json(nuevaBebida);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la bebida' });
  }
});

// Actualizar una bebida
router.put('/:id', async (req, res) => {
  try {
    const bebidaId = req.params.id;
    const { name, stock, price } = req.body;
    const bebida = await Bebida.findByPk(bebidaId);
    if (!bebida) {
      return res.status(404).json({ error: 'Bebida no encontrada' });
    }
    await bebida.update({ name, stock, price });
    res.json(bebida);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la bebida' });
  }
});

// Eliminar una bebida
router.delete('/:id', async (req, res) => {
  try {
    const bebidaId = req.params.id;
    const bebida = await Bebida.findByPk(bebidaId);
    if (!bebida) {
      return res.status(404).json({ error: 'Bebida no encontrada' });
    }
    await bebida.destroy();
    res.json({ message: 'Bebida eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la bebida' });
  }
});

module.exports = router;
