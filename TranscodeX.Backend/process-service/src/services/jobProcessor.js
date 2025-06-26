const path = require('path');
const fs = require('fs');
const { generateSignedUrl, uploadToB2 } = require('../utils/b2Client');
const { downloadFile } = require('../utils/download');
const { transcodeVideo } = require('../utils/ffmpeg');
const { updateUploadStatus } = require('../utils/uploadServiceClient');
const { createJob, updateJobStatus } = require('../services/job.service')
const {sendToQueue} = require('../queue/producer')

const tempDir = path.resolve(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

exports.handleJob = async ({ videoId, storageKey, userId }) => {
  const originalFilePath = path.join(tempDir, `${videoId}-original`);
  const processedFilePath = path.join(tempDir, `${videoId}-processed.mp4`);
  const processedStorageKey = `${videoId}-processed.mp4`;

  let job = null;

  try {
    console.log(`[${videoId}] Process started`);

    const signedUrl = await generateSignedUrl(storageKey);

    job = await createJob({ videoId, storageKey, userId });


    await downloadFile(signedUrl, originalFilePath);
    await transcodeVideo(originalFilePath, processedFilePath);
    await uploadToB2(processedFilePath, processedStorageKey);
    await updateJobStatus(job.id, 'completed');
    await updateUploadStatus(videoId, 'completed');

    const jobPayload = { videoId, processedStorageKey };
    await sendToQueue(process.env.PROCESSED_RABBITMQ_QUEUE,jobPayload)


    console.log(`[${videoId}] completed`);
  } catch (error) {
    console.error(`[${videoId}] error:`, error);

    if (job?.id) {
      await updateJobStatus(job.id, 'failed', {
        error_message: error.message
      });
    }
  } finally {
    [originalFilePath, processedFilePath].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
};
