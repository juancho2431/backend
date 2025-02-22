// models/VentaDetalle.js

// Importamos DataTypes de Sequelize para definir los tipos de datos.
const { DataTypes } = require('sequelize');
// Importamos la instancia de Sequelize configurada en '../config/db'.
// Asegúrate de que este archivo esté configurado para conectarse a tu base de datos local.
const sequelize = require('../config/db');

/**
 * Modelo "VentaDetalle" que representa la tabla "venta_detalles" en la base de datos.
 * Este modelo se utiliza para almacenar los detalles de cada venta, incluyendo la
 * referencia a la venta, el producto, la cantidad y el precio.
 */
const VentaDetalle = sequelize.define('VentaDetalle', {
  // Clave primaria de la tabla, autoincrementable.
  venta_detalle_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Campo que almacena el ID de la venta a la que pertenece este detalle.
  // Se define como clave foránea que hace referencia a la tabla "ventas".
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas', // Asegúrate de que este nombre coincida con el nombre real de la tabla de ventas.
      key: 'ventas_id', // Campo de la tabla "ventas" que se usa como referencia.
    },
  },
  // Campo que almacena el ID del producto vendido.
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Campo que especifica el tipo de producto.
  // Esto puede ser útil si se manejan diferentes categorías de productos en la venta.
  tipo_producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Campo que indica la cantidad de productos vendidos en este detalle.
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // Campo que almacena el precio del producto en el momento de la venta.
  precio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  // Especificamos el nombre real de la tabla en la base de datos.
  tableName: 'venta_detalles',
  // Desactivamos la creación automática de las columnas 'createdAt' y 'updatedAt'.
  timestamps: false,
});

// Exportamos el modelo para poder usarlo en otras partes de la aplicación.
module.exports = VentaDetalle;
