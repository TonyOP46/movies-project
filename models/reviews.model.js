const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const Reviews = sequelize.define('review', {
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
  comment: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'active',
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,  
    allowNull: false
  },
  moviesId: {
    type: DataTypes.INTEGER,  
    allowNull: false
  },
});

module.exports = { Reviews };
