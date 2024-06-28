const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalExpense: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    totalExpense: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.0, 
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = Users;
