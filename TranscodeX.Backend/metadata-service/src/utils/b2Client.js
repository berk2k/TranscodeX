const { S3Client,GetObjectCommand } = require('@aws-sdk/client-s3');
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
  requestChecksumCalculation: 'NEVER',
  responseChecksumValidation: 'NEVER',
  disableS3ExpressSessionAuth: true,
});

try {
  s3.middlewareStack.remove("FlexibleChecksumsMiddleware");
} catch (error) {
  console.log('FlexibleChecksumsMiddleware not exists or can not remove');
}

try {
  s3.middlewareStack.remove("Md5BodyChecksumMiddleware");
} catch (error) {
  console.log('can not find Md5BodyChecksumMiddleware');
}

const generateSignedUrl = async (fileName) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 600 });
    return url;
  } catch (error) {
    console.error('Signed URL error:', error);
    throw error;
  }
};

module.exports = {
  generateSignedUrl
};
