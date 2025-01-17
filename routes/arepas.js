const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { Arepa, Ingrediente, ArepaIngrediente, Ventas, VentaDetalle } = require('../models');

// Obtener todas las arepas con sus ingredientes
router.get('/', async (req, res) => {
  console.log('Intentando obtener todas las arepas...'); // Añadir mensaje de inicio
  try {
    const arepas = await Arepa.findAll({
      include: {
        model: Ingrediente,
        through: {
          attributes: ['amount'],
        },
      },
    });
    console.log('Arepas obtenidas:', arepas); // Añadir mensaje para verificar si se obtuvieron las arepas
    res.json(arepas);
  } catch (error) {
    console.error('Error al obtener las arepas:', error); // Añadir error detallado en consola
    res.status(500).json({ error: 'Error al obtener las arepas', detalle: error.message });
  }
});

// Obtener una arepa específica con sus ingredientes
router.get('/:id', async (req, res) => {
  console.log(`Intentando obtener la arepa con id: ${req.params.id}`); // Añadir mensaje de inicio
  try {
    const arepaId = req.params.id;
    const arepa = await Arepa.findByPk(arepaId, {
      include: {
        model: Ingrediente,
        through: {
          attributes: ['amount'],
        },
      },
    });

    if (!arepa) {
      console.log(`Arepa con id ${arepaId} no encontrada`); // Añadir mensaje si no se encuentra
      return res.status(404).json({ error: 'Arepa no encontrada' });
    }

    console.log('Arepa encontrada:', arepa); // Añadir mensaje para verificar si se encontró la arepa
    res.json(arepa);
  } catch (error) {
    console.error('Error al obtener la arepa:', error);
    res.status(500).json({ error: 'Error al obtener la arepa', detalle: error.message });
  }
});

// Crear una nueva arepa con sus ingredientes
router.post('/', [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('price').isInt({ min: 1 }).withMessage('El precio debe ser un número entero positivo'),
], async (req, res) => {
  console.log('Intentando crear una nueva arepa...'); // Añadir mensaje de inicio
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array()); // Añadir mensaje de error de validación
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, price, ingredientes } = req.body;

    // Crear la arepa
    const nuevaArepa = await Arepa.create({ name, price });
    console.log('Arepa creada:', nuevaArepa); // Añadir mensaje de éxito al crear la arepa

    // Agregar ingredientes a la arepa
    if (ingredientes && ingredientes.length > 0) {
      console.log('Intentando agregar ingredientes a la arepa...'); // Añadir mensaje para añadir ingredientes
      for (const ingrediente of ingredientes) {
        await ArepaIngrediente.create({
          arepa_id: nuevaArepa.arepa_id,
          ingredient_id: ingrediente.id,
          amount: ingrediente.amount,
        });
      }
    }

    res.status(201).json(nuevaArepa);
  } catch (error) {
    console.error('Error al crear la arepa:', error);
    res.status(500).json({ error: 'Error al crear la arepa', detalle: error.message });
  }
});

// Actualizar una arepa y sus ingredientes
router.put('/:id', [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('price').isInt({ min: 1 }).withMessage('El precio debe ser un número entero positivo'),
], async (req, res) => {
  console.log(`Intentando actualizar la arepa con id: ${req.params.id}`); // Añadir mensaje de inicio
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Errores de validación:', errors.array()); // Añadir mensaje de error de validación
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const arepaId = req.params.id;
    const { name, price, ingredientes } = req.body;

    // Buscar la arepa
    const arepa = await Arepa.findByPk(arepaId);
    if (!arepa) {
      console.log(`Arepa con id ${arepaId} no encontrada`); // Añadir mensaje si no se encuentra
      return res.status(404).json({ error: 'Arepa no encontrada' });
    }

    // Actualizar la arepa
    await arepa.update({ name, price });
    console.log('Arepa actualizada:', arepa); // Añadir mensaje de éxito al actualizar la arepa

    // Actualizar ingredientes
    if (ingredientes && ingredientes.length > 0) {
      console.log('Intentando actualizar ingredientes de la arepa...'); // Añadir mensaje para actualizar ingredientes
      await ArepaIngrediente.destroy({ where: { arepa_id: arepaId } });

      for (const ingrediente of ingredientes) {
        await ArepaIngrediente.create({
          arepa_id: arepaId,
          ingredient_id: ingrediente.id,
          amount: ingrediente.amount,
        });
      }
    }

    res.json(arepa);
  } catch (error) {
    console.error('Error al actualizar la arepa:', error);
    res.status(500).json({ error: 'Error al actualizar la arepa', detalle: error.message });
  }
});

// Eliminar una arepa y sus ingredientes
router.delete('/:id', async (req, res) => {
  console.log(`Intentando eliminar la arepa con id: ${req.params.id}`); // Añadir mensaje de inicio
  try {
    const arepaId = req.params.id;

    // Buscar la arepa
    const arepa = await Arepa.findByPk(arepaId);
    if (!arepa) {
      console.log(`Arepa con id ${arepaId} no encontrada`); // Añadir mensaje si no se encuentra
      return res.status(404).json({ error: 'Arepa no encontrada' });
    }

    // Eliminar la arepa
    await arepa.destroy();
    console.log('Arepa eliminada correctamente'); // Añadir mensaje de éxito al eliminar la arepa

    res.json({ message: 'Arepa eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la arepa:', error);
    res.status(500).json({ error: 'Error al eliminar la arepa', detalle: error.message });
  }
});

module.exports = router;
