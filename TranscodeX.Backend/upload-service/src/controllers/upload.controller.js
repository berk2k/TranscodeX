const uploadService = require('../services/upload.service');
const Upload = require('../models/upload.model');

exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing from headers' });
    }

    const result = await uploadService.processUpload(req.file, userId, process.env.UPLOAD_RABBITMQ_QUEUE, res);

    if (result && !result.message) {
      return res.status(200).json({ message: 'Upload successful', data: result });
    }
    // processUpload hata ile dönerse response zaten gitmiş olur, buraya genelde gelmez
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error at handleUpload', error: error.message });
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
