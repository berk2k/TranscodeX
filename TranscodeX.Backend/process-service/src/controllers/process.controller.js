const { handleJob } = require('../services/jobProcessor');

exports.processJob = async (req, res) => {
  try {
    const { videoId, storageKey } = req.body;

    if (!videoId || !storageKey) {
      return res.status(400).json({ message: 'videoId and storageKey are required' });
    }

    await handleJob({ videoId, storageKey });

    return res.status(200).json({ message: 'Job processed successfully' });
  } catch (error) {
    console.error('Error processing job:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
