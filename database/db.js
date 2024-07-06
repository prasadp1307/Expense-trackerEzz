const { Sequelize } = require('sequelize');
// // const app = express();
// const dotenv = require('dotenv').config();


// console.log(process.env)

// const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.PASSWORD,{
//     host: process.env.DB_HOST,
//     dialect: 'mysql'
// })

// module.exports = sequelize;

const dotenv = require('dotenv').config();

console.log("DB Name:", process.env.DB_NAME);
console.log("DB Username:", process.env.DB_USERNAME);
console.log("DB Password:", process.env.PASSWORD);
console.log("DB Host:", process.env.DB_HOST);

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

module.exports = sequelize;
