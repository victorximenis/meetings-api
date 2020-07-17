const { Sequelize, Model, DataTypes } = require('sequelize');
const dbConfig = require("../config/database");
const sequelize = new Sequelize(dbConfig);

const Workshop = sequelize.define('Workshop', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    places: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{

});

module.exports = Workshop;