const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ArepaIngrediente = sequelize.define('ArepaIngrediente', {
  arepa_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Arepa',
      key: 'arepa_id'
    }
  },
  ingredient_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Ingrediente',
      key: 'ingredient_id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'arepa_ingredients',
  timestamps: false
});

module.exports = ArepaIngrediente;