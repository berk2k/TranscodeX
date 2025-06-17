const { startConsumer } = require('./consumer');

startConsumer()
  .then(() => console.log('Consumer started'))
  .catch(err => {
    console.error('Failed to start consumer:', err);
    process.exit(1);
  });
