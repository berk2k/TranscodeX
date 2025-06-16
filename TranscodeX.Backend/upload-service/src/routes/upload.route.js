const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');




const upload = multer({ dest: 'temp/' }); // store it in temp folder

router.post('/upload', upload.single('file'), uploadController.handleUpload);
router.patch('/:id/status', uploadController.updateUploadStatus);

module.exports = router;
