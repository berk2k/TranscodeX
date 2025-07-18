const axios = require('axios');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const UPLOAD_SERVICE_URL = process.env.UPLOAD_SERVICE_URL;

async function updateUploadStatus(id, status) {
  try {
    const baseUrl = process.env.UPLOAD_SERVICE_URL;
    await axios.patch(`${baseUrl}/uploads/${id}/status`, { status });
    console.log(`Upload status updated to ${status} for video ${id}`);
  } catch (err) {
    console.error('Failed to update upload status:', err.message);
  }
}

module.exports = { updateUploadStatus };
