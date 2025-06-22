const express = require('express');
const router = express.Router();
const jobController = require('../controllers/process.controller');

router.post('/process', jobController.processJob);

module.exports = router;
