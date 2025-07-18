const amqp = require('amqplib');
const path = require('path');
const { handleMetadataJob } = require('../services/metadata.service');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

let connection = null;
let channel = null;

const QUEUE_NAME = process.env.PROCESSED_RABBITMQ_QUEUE;
const RABBITMQ_URL = process.env.UPLOAD_RABBITMQ_URL;

let retryCount = 0;
const MAX_RETRIES = 5;

const startConsumer = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    retryCount = 0;

    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      channel = null;
    });

    connection.on('close', () => {
      console.error('RabbitMQ connection closed, reconnecting...');
      channel = null;

      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(startConsumer, 3000);
      } else {
        console.error(`Max retry count (${MAX_RETRIES}) reached. Stopping reconnect attempts.`);
      }
    });

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.prefetch(5);
    console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const job = JSON.parse(msg.content.toString());
          console.log('Received job:', job);

          await handleMetadataJob(job);
          channel.ack(msg);
        } catch (err) {
          console.error('Job processing failed:', err);
          channel.nack(msg, false, true);
        }
      }
    }, { noAck: false });
  } catch (error) {
    console.error('RabbitMQ connection error:', error);

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(startConsumer, 5000);
    } else {
      console.error(`Max retry count (${MAX_RETRIES}) reached. Stopping reconnect attempts.`);
    }
  }
};

module.exports = { startConsumer };