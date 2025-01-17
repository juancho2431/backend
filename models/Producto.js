const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Arepa = sequelize.define('Arepa', {
  arepa_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER, // Cambiado a INTEGER para manejar precios sin decimales
    allowNull: false
  }
}, {
  tableName: 'arepas',
  timestamps: false
});

module.exports = Arepa;
