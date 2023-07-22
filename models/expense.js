const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    selling: {
        type: Sequelize.STRING,
        allowNull:false,
        
    },
    Category: {
        type: Sequelize.STRING,
        allowNull:false,
        
    }
});

module.exports = Expense;
