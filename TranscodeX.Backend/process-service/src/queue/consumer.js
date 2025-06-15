const amqp = require('amqplib');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const { handleJob } = require('../services/jobProcessor');

const RABBITMQ_URL = process.env.UPLOAD_RABBITMQ_URL;
const QUEUE_NAME = process.env.UPLOAD_RABBITMQ_QUEUE;

const startConsumer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          try {
            const job = JSON.parse(msg.content.toString());
            console.log('Received job:', job);

            await handleJob(job);

            channel.ack(msg); 
          } catch (err) {
            console.error('Job processing failed:', err);
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
  }
};

module.exports = { startConsumer };
