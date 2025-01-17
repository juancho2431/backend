// models/Ventas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado'); // Importa el modelo de Empleado si es necesario

const Ventas = sequelize.define('Ventas', {
  ventas_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  cliente: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metodo_pago: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vendedor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Empleado,
      key: 'empleado_id'
    },
    allowNull: true
  }
}, {
  tableName: 'ventas',
  timestamps: false
});

// Relación con el modelo de Empleado (vendedor)

module.exports = Ventas;
