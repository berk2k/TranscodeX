const { uploadToB2 } = require('../utils/b2Client');
const { sendToQueue } = require('../queue/rabbitmqProducer');
const path = require('path');
const fs = require('fs');

exports.processUpload = async (file) => {
    const videoId = uuidv4()
    const filename = `${videoId}${path.extname(file.originalname)}`;

    const storageKey = await uploadToB2(file.path, filename);

    fs.unlinkSync(file.path); //delete local file 

    await Upload.create({
        id: videoId,
        original_name: file.originalname,
        mime_type: file.mimetype,
        storage_key: storageKey,
        status: 'pending',
        uploaded_at: new Date()
    });

    const jobPayload = { videoId, storageUrl };
    await sendToQueue(process.env.RABBITMQ_QUEUE, jobPayload); // rabbitMQ

    return jobPayload;
};