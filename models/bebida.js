const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bebida = sequelize.define('Bebida', {
  bebida_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER, // Cambiado a INTEGER para manejar precios sin decimales
    allowNull: false
  }
}, {
  tableName: 'bebidas',
  timestamps: false
});

module.exports = Bebida;
