const express = require('express');
const router = express.Router();
const jobController = require('../controllers/process.controller');

router.post('/process-job', jobController.processJob);

module.exports = router;
