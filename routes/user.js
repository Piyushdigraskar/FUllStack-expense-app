const express = require('express');

const userController = require('../controllers/user');

const expenseController = require('../controllers/expense');

const userauthentication = require('../middleware/auth');

const router = express.Router();

router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.get('/download', userauthentication.authenticate, expenseController.downloadexpense)

module.exports = router; 

