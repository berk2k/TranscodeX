const { uploadToB2 } = require('../utils/b2Client');
const { sendToQueue } = require('../queue/rabbitmqProducer');
const Upload = require('../models/upload.model')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


exports.processUpload = async (file, userId, queueName = process.env.UPLOAD_RABBITMQ_QUEUE) => {
    const videoId = uuidv4()
    const filename = `${videoId}${path.extname(file.originalname)}`;

    const storageKey = await uploadToB2(file.path, filename);

    fs.unlinkSync(file.path); //delete local file 

    await Upload.create({
        id: videoId,
        userId: userId,
        original_name: file.originalname,
        mime_type: file.mimetype,
        storage_key: storageKey,
        status: 'pending',
        uploaded_at: new Date()
    });

    const jobPayload = { videoId, storageKey, userId };
    await sendToQueue(queueName, jobPayload); // rabbitMQ

    return jobPayload;
};