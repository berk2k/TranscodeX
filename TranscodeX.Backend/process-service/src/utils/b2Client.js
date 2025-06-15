const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
  forcePathStyle: true,
});

const generateSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 600 });
};

module.exports = { generateSignedUrl };
