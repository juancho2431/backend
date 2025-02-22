const express = require('express');
const router = express.Router();
const { Producto, Bebida, Ingrediente, Ventas, VentaDetalle, Empleado } = require('../models');
const sequelize = require('../config/db');
console.log('Modelo Ventas:', Ventas);

/**
 * GET '/' - Obtener todas las ventas
 * Se listan las ventas incluyendo los detalles, donde cada detalle puede tener
 * un producto (antes llamado arepa) o una bebida.
 */
router.get('/', async (req, res) => {
  console.log('Intentando obtener todas las ventas...');
  try {
    const ventas = await Ventas.findAll({
      include: [
        {
          model: VentaDetalle,
          as: 'VentaDetalles',
          include: [
            {
              model: Producto,   // Usamos Producto en lugar de Arepa
              as: 'producto',    // Asegúrate de que la asociación esté definida con este alias
              attributes: ['name', 'price'],
              required: false
            },
            {
              model: Bebida,
              as: 'bebida',
              attributes: ['name', 'price'],
              required: false
            }
          ]
        }
      ]
    });

    

    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});

/**
 * GET '/:ventaId' - Obtener una venta específica por ID
 * Se obtiene la venta con sus detalles y la información del vendedor.
 */
router.get('/:ventaId', async (req, res) => {
  const { ventaId } = req.params;
  try {
    console.log('Intentando obtener la venta con ventaId:', ventaId);

    const venta = await Ventas.findByPk(ventaId, {
      attributes: ['ventas_id', 'fecha', 'total', 'cliente', 'metodo_pago'],
      include: [
        {
          model: VentaDetalle,
          as: 'VentaDetalles',
          include: [
            {
              model: Producto,   // Usamos Producto en lugar de Arepa
              as: 'producto',    // Debe coincidir con el alias definido en la asociación
              attributes: ['name', 'price'],
              required: false
            },
            {
              model: Bebida,
              as: 'bebida',
              attributes: ['name', 'price'],
              required: false
            }
          ]
        },
        {
          model: Empleado,
          as: 'vendedor',
          attributes: ['nombre', 'apellido'],
        }
      ]
    });

    if (!venta) {
      console.log('Venta no encontrada para ventaId:', ventaId);
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    console.log('Resultado de la consulta:', JSON.stringify(venta, null, 2));
    res.json(venta);
  } catch (error) {
    console.error('Error al obtener la venta:', error.message);
    res.status(500).json({ error: 'Error al obtener la venta', detalle: error.message });
  }
});

/**
 * POST '/' - Crear una nueva venta
 * Se espera recibir en el body los datos de la venta y un array de detalles.
 * Se utiliza una transacción para crear la venta, sus detalles y actualizar el stock.
 */
router.post('/', async (req, res) => {
  const { fecha, total, metodo_pago, cliente, vendedor_id, detalles } = req.body;

  if (!fecha || !total || !metodo_pago || !cliente || !vendedor_id || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ message: 'Debe proporcionar fecha, total, método de pago, cliente, vendedor y detalles válidos para la venta.' });
  }

  try {
    await sequelize.transaction(async (transaction) => {
      // Crear la venta principal
      const venta = await Ventas.create({
        fecha,
        total,
        metodo_pago,
        cliente,
        vendedor_id
      }, { transaction });

      // Procesar cada detalle de la venta
      for (const detalle of detalles) {
        const { tipo_producto, producto_id, cantidad, precio } = detalle;
        if (!producto_id || !cantidad || !precio) {
          throw new Error('Debe proporcionar todos los datos para cada detalle de la venta.');
        }

        // Crear el registro del detalle
        await VentaDetalle.create({
          venta_id: venta.ventas_id,
          producto_id,
          tipo_producto,
          cantidad,
          precio,
        }, { transaction });

        // Actualizar el stock según el tipo de producto
        if (tipo_producto === 'arepa') {
          // Ahora usamos Producto.findByPk en lugar de Arepa.findByPk
          const producto = await Producto.findByPk(producto_id, {
            include: {
              model: Ingrediente,
              through: {
                attributes: ['amount'],
              },
            },
            transaction,
          });

          if (producto && producto.Ingredientes) {
            for (const ingrediente of producto.Ingredientes) {
              const cantidadNecesaria = ingrediente.ProductoIngrediente.amount * cantidad;
              if (ingrediente.stock_current < cantidadNecesaria) {
                throw new Error(`Stock insuficiente para el ingrediente: ${ingrediente.name}`);
              }
              ingrediente.stock_current -= cantidadNecesaria;
              await ingrediente.save({ transaction });
            }
          }
        } else if (tipo_producto === 'bebida') {
          const bebida = await Bebida.findByPk(producto_id, { transaction });
          if (bebida && bebida.stock < cantidad) {
            throw new Error(`Stock insuficiente para la bebida: ${bebida.name}`);
          }
          bebida.stock -= cantidad;
          await bebida.save({ transaction });
        }
      }
    });

    res.status(201).json({ message: 'Venta creada con éxito' });
  } catch (error) {
    console.error('Error al crear la venta:', error);
    res.status(500).json({ message: 'Error al crear la venta', detalle: error.message });
  }
});

/**
 * DELETE '/:ventaId' - Eliminar una venta por ID
 */
router.delete('/:ventaId', async (req, res) => {
  const { ventaId } = req.params;
  try {
    console.log('Intentando eliminar la venta con ventaId:', ventaId);
    const venta = await Ventas.findByPk(ventaId);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    await venta.destroy();
    res.json({ message: 'Venta eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la venta:', error);
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
});

module.exports = router;
