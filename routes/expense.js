
const express = require('express');

const expenseController = require('../controllers/expense');

const userauthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-user', userauthentication.authenticate, expenseController.addexpense);

router.get('/get-user', userauthentication.authenticate, expenseController.getexpenses);

router.delete('/delete-user/:expenseid', userauthentication.authenticate, expenseController.deleteexpense);

module.exports = router; 