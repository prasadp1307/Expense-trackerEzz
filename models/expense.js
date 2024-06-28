const Sequelize = require('sequelize');
const sequelize = require('../database/db');


const Expense = sequelize.define('expense',
    {
        id:{
            type:Sequelize.INTEGER,
            unique:true,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        expenseamount:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        description:{
            type: Sequelize.STRING,
            allowNull:false
        },
        category:{
            type: Sequelize.STRING,
            allowNull:false
        },
        userId:{
            type:Sequelize.INTEGER,
            primaryKey :true
        }
    },{
        timestamps: false
    }
);

module.exports = Expense;

