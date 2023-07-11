const express = require('express');

const signupController = require('../controllers/signup');

const router = express.Router();

router.post('/add-user', signupController.addUser);

router.get('/get-user', signupController.getUser);

module.exports = router;

