const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');


require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

const uploadToB2 = async (filePath, fileName) => {
  const fileStream = fs.createReadStream(filePath);
  const contentType = mime.lookup(fileName) || 'application/octet-stream';

  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: fileName,
    Body: fileStream,
    ContentType: contentType,
  });

  await s3.send(command);

  return fileName;
};

const generateSignedUrl = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: fileName,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 dk
  return url;
};

module.exports = { uploadToB2, generateSignedUrl };
