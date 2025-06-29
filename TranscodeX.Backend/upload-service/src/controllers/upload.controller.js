const uploadService = require('../services/upload.service');
const Upload = require('../models/upload.model');

exports.handleUpload = async (req, res) => {
    try {
        console.log('---- Upload Request Received ----');
        console.log('Headers:', req.headers);
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);

        if (!req.file) {
            console.log('No file found in request.');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.headers['x-user-id'];
        if (!userId) {
            console.log('Missing x-user-id header.');
            return res.status(401).json({ message: 'Unauthorized: User ID missing from headers' });
        }

        console.log('Calling processUpload...');
        const result = await uploadService.processUpload(req.file, userId);
        console.log('Upload success:', result);
        res.status(200).json({ message: 'Upload successful', data: result });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateUploadStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'processing', 'completed', 'failed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const upload = await Upload.findByPk(id);
    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    upload.status = status;
    await upload.save();

    return res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
