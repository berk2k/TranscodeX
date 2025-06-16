const { v4: uuidv4 } = require('uuid');
const Job = require('../models/job.model');

exports.createJob = async ({ videoId, storageKey }) => {
  const jobId = uuidv4();

  const job = await Job.create({
    id: jobId,
    video_id: videoId,
    storage_key: storageKey,
    status: 'processing',
    created_at: new Date()
  });

  return job;
};
