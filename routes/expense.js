
const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/add-user', expenseController.addUser);

router.get('/get-user', expenseController.getUser);

router.delete('/delete-user/:id', expenseController.deleteUser);

module.exports = router;