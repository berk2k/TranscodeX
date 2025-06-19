const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function extractMetadata(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');

      if (!videoStream) return reject(new Error('No video stream found'));

      resolve({
        duration: metadata.format.duration,
        width: videoStream.width,
        height: videoStream.height,
        codec: videoStream.codec_name,
        size: fs.statSync(videoPath).size
      });
    });
  });
}

modules.exports = { extractMetadata }