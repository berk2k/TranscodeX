const amqp = require('amqplib');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


let channel;

const initRabbitMQ = async () => {
    try{
        const connection = await amqp.connect(process.env.UPLOAD_RABBITMQ_URL)
        channel = await connection.createChannel();
        await channel.assertQueue(process.env.UPLOAD_RABBITMQ_QUEUE, { durable: true });
        console.log('RabbitMQ connected and queue asserted');
    }
    catch(error){
        console.error('RabbitMQ connection failed:', error);
        throw error;
    }
}

const sendToQueue = async (queueName, payload) => {
    if (!channel) {
        await initRabbitMQ();
    }

    const buffer = Buffer.from(JSON.stringify(payload));
    channel.sendToQueue(queueName, buffer, { persistent: true });
    console.log(`Message sent to queue [${queueName}]:`, payload);
};

module.exports = { sendToQueue };

