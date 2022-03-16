const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const ActorsinMoviesact = sequelize.define('actorsinMoviesact', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
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

module.exports = {ActorsinMoviesact };
