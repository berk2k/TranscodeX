const { VideoMetadata } = require('../models/metadata.model');
const { downloadFile } = require('../utils/download');
const { extractMetadata } = require('../utils/extract');
const path = require('path');
const tempDir = require('os').tmpdir();

exports.handleMetadataJob = async ({ videoId, storageKey }) => {
  const tempFilePath = path.join(tempDir, `${videoId}-processed.mp4`);

  try {
    console.log(`[${videoId}] Metadata processing started.`);

    const signedUrl = await generateSignedUrl(storageKey);
    await downloadFile(signedUrl, tempFilePath);

    const meta = await extractMetadata(tempFilePath);

    await VideoMetadata.create({
      video_id: videoId,
      duration: meta.duration,
      width: meta.width,
      height: meta.height,
      codec: meta.codec,
      size: meta.size
    });

    console.log(`[${videoId}] Metadata saved successfully.`);
  } catch (err) {
    console.error(`[${videoId}] Metadata error:`, err);
  } finally {
    fs.existsSync(tempFilePath) && fs.unlinkSync(tempFilePath);
  }
};
