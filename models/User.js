const { Sequelize, Model, DataTypes } = require('sequelize');
const dbConfig = require("../config/database");
const sequelize = new Sequelize(dbConfig);

const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    // Other model options go here
});
  

module.exports = User;