const amqp = require('amqplib');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

let connection = null;
let channel = null;

const QUEUE_NAME = process.env.UPLOAD_RABBITMQ_QUEUE;
const RABBITMQ_URL = process.env.UPLOAD_RABBITMQ_URL;

const initRabbitMQ = async () => {
  if (channel) return; 

  try {
    connection = await amqp.connect(RABBITMQ_URL);
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      channel = null;
    });

    connection.on('close', () => {
      console.error('RabbitMQ connection closed, reconnecting...');
      channel = null;
      setTimeout(initRabbitMQ, 3000); 
    });

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('RabbitMQ connected and queue asserted');
  } catch (error) {
    console.error('RabbitMQ connection failed:', error);
    channel = null;
    
    setTimeout(initRabbitMQ, 5000);
  }
};

const sendToQueue = async (queueName, payload) => {
  if (!channel) await initRabbitMQ();
  if (!channel) throw new Error('RabbitMQ channel is not initialized');

  const startTime = Date.now();
  console.log(`Sending message to ${queueName} at ${startTime}`);

  const buffer = Buffer.from(JSON.stringify(payload));
  channel.sendToQueue(queueName, buffer, { persistent: true });

  const endTime = Date.now();
  console.log(`Message sent to queue [${queueName}] at ${endTime}`);
  console.log(`Message send duration: ${endTime - startTime} ms`);
};


module.exports = { sendToQueue };
