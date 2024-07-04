const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const Forgotpasswords = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
    expiresby: {
        type: Sequelize.DATE
    },
    userId: {
        type: Sequelize.UUID,
        allowNull: false
    }
});

module.exports = Forgotpasswords;
