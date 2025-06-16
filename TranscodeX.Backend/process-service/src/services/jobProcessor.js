const path = require('path');
const fs = require('fs');
const { generateSignedUrl, uploadToB2 } = require('../utils/b2Client');
const { downloadFile } = require('../utils/download');
const { transcodeVideo } = require('../utils/ffmpeg');
const { updateUploadStatus } = require('../utils/uploadServiceClient');

const tempDir = path.resolve(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

exports.handleJob = async ({ videoId, storageKey }) => {
  const originalFilePath = path.join(tempDir, `${videoId}-original`);
  const processedFilePath = path.join(tempDir, `${videoId}-processed.mp4`);
  const processedStorageKey = `${videoId}-processed.mp4`;

  try {
    console.log(`[${videoId}] Process started`);

    const signedUrl = await generateSignedUrl(storageKey);

    await downloadFile(signedUrl, originalFilePath);

    await transcodeVideo(originalFilePath, processedFilePath);

    await uploadToB2(processedFilePath, processedStorageKey);

    await updateUploadStatus(videoId, 'completed');

    console.log(`[${videoId}] completed`);
  } catch (error) {
    console.error(`[${videoId}] error:`, error);
    await updateStatus(videoId, 'failed');
  } finally {
    [originalFilePath, processedFilePath].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  }
};
