const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const Downloads = sequelize.define('downloads', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Downloads;
