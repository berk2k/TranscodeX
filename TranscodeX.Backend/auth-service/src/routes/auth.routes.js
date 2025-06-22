const express = require('express');
const { validateController, login, register } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/validate', validateController);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
