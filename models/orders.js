const Sequelize = require('sequelize');
const sequelize = require('../database/db');


const Orders = sequelize.define('order',
    {
        id:{
            type:Sequelize.INTEGER,
            unique:true,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        paymentId:{
            type: Sequelize.STRING,
            allowNull:false
        },
        orderId:{
            type: Sequelize.STRING,
            allowNull:false
        },
        status:{
            type: Sequelize.STRING,
            allowNull:false
        },
        userId:{
            type:Sequelize.INTEGER,
            primaryKey :true
        }
    }
);


module.exports = Orders;

