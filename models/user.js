const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Users = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name: {
        type:Sequelize.STRING,
        allowNull:false
    },
    email: {
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password: {
        type:Sequelize.STRING, 
        allowNull:false
        
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalExpenses:{
        type:Sequelize.INTEGER,
        defaultValue: 0
    }

})

module.exports = Users;