const fs = require('fs');
const https = require('https');
const http = require('http');
const url = require('url');

async function downloadFile(fileUrl, destPath) {
  const parsedUrl = url.parse(fileUrl);
  const client = parsedUrl.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const request = client.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${fileUrl}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
    });

    file.on('finish', () => {
      file.close(resolve);
    });

    request.on('error', (err) => {
      fs.unlink(destPath, () => reject(err));
    });

    file.on('error', (err) => {
      fs.unlink(destPath, () => reject(err));
    });
  });
}

module.exports = { downloadFile };
