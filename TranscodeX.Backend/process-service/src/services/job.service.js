const { v4: uuidv4 } = require('uuid');
const Job = require('../models/job.model');

const createJob = async ({ videoId, storageKey, userId }) => {
  const jobId = uuidv4();
  const now = new Date();

  const job = await Job.create({
    id: jobId,
    video_id: videoId,
    user_id: userId,
    storage_key: storageKey,
    status: 'processing',     
    created_at: now,
    started_at: now,          
    updated_at: now
  });

  return job;
};

async function updateJobStatus(jobId, status, options = {}) {
  const updateData = {
    status,
    updated_at: new Date()
  };

  if (status === 'processing') {
    updateData.started_at = new Date();
  }

  if (status === 'completed' || status === 'failed') {
    updateData.finished_at = new Date();
  }

  if (options.error_message) {
    updateData.error_message = options.error_message;
  }

  await Job.update(updateData, {
    where: { id: jobId }
  });

  return updateData;
}

module.exports = {
  updateJobStatus,
  createJob
};
