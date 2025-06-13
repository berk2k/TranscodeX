const uploadService = require('../services/upload.service');

exports.handleUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadService.processUpload(req.file);
        res.status(200).json({ message: 'Upload successful', data: result });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
