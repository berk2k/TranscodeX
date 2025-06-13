const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const mime = require('mime-types');
require('dotenv').config();

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});


const uploadToB2 = async (filePath, fileName) => {
    const fileStream = fs.createReadStream(filePath)
    const contentType = mime.lookup(fileName) || 'application/octet-stream';

    const command = new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
        ContentType: contentType,
    });

      await s3.send(command);

    return `${process.env.B2_ENDPOINT}/${process.env.B2_BUCKET_NAME}/${fileName}`;

};

module.exports = { uploadToB2 };