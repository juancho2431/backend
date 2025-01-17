// models/VentaDetalle.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VentaDetalle = sequelize.define('VentaDetalle', {
  venta_detalle_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  venta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ventas', // Cambiado a minúsculas para coincidir con el nombre de la tabla
      key: 'ventas_id',
    },
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'venta_detalles',
  timestamps: false,
});

module.exports = VentaDetalle;
