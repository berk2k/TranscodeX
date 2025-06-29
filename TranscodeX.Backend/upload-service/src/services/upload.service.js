const { uploadToB2 } = require('../utils/b2Client');
const { sendToQueue } = require('../queue/rabbitmqProducer');
const Upload = require('../models/upload.model')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


exports.processUpload = async (file, userId, queueName = process.env.UPLOAD_RABBITMQ_QUEUE) => {
    console.log('--- processUpload called ---');
    console.log('file:', file);
    console.log('userId:', userId);

    try {
        const videoId = uuidv4();
        const filename = `${videoId}${path.extname(file.originalname)}`;
        console.log('Generated filename:', filename);

        const storageKey = await uploadToB2(file.path, filename);
        console.log('Uploaded to B2:', storageKey);

        fs.unlinkSync(file.path); // delete temp file
        console.log('Temp file deleted');

        await Upload.create({
            id: videoId,
            userId: userId,
            original_name: file.originalname,
            mime_type: file.mimetype,
            storage_key: storageKey,
            status: 'pending',
            uploaded_at: new Date()
        });

        console.log('Upload record created in DB');

        const jobPayload = { videoId, storageKey, userId };
        await sendToQueue(queueName, jobPayload);
        console.log('Job sent to queue:', queueName);

        return jobPayload;
    } catch (error) {
        console.error('processUpload error:', error);
        throw error;
    }
};