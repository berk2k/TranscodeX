const { uploadToB2 } = require('../utils/b2Client');
const { sendToQueue } = require('../queue/rabbitmqProducer');
const Upload = require('../models/upload.model')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


exports.processUpload = async (file, userId, queueName = process.env.UPLOAD_RABBITMQ_QUEUE, res) => {
  try {
    const videoId = uuidv4();
    const filename = `${videoId}${path.extname(file.originalname)}`;

    let storageKey;
    try {
      storageKey = await uploadToB2(file.path, filename);
    } catch (b2Error) {
      return res.status(500).json({ message: 'B2 upload error', error: b2Error.message });
    }

    try {
      fs.unlinkSync(file.path);
    } catch (fsError) {
      
    }

    try {
      await Upload.create({
        id: videoId,
        userId,
        original_name: file.originalname,
        mime_type: file.mimetype,
        storage_key: storageKey,
        status: 'pending',
        uploaded_at: new Date()
      });
    } catch (dbError) {
      return res.status(500).json({ message: 'Database insert error', error: dbError.message });
    }

    try {
      const jobPayload = { videoId, storageKey, userId };
      await sendToQueue(queueName, jobPayload);
      return jobPayload;
    } catch (queueError) {
      return res.status(500).json({ message: 'Queue sending error', error: queueError.message });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Unknown error during upload processing', error: error.message });
  }
};

