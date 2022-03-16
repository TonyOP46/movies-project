const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const Movies = sequelize.define('movie', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  duration: {
    type: DataTypes.TIME,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'active',
    allowNull: false
  },
});

module.exports = { Movies };