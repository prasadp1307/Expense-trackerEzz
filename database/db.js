const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('trackerexp', 'root', 'Sayali@1323', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize;