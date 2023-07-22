const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
//const express = require('express');

const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.selling')), 'totalExpenses'] ],
            include: [
                { 
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['totalExpenses', 'DESC']]

        })
       
        res.status(200).json(leaderboardofusers)
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    getUserLeaderBoard
}