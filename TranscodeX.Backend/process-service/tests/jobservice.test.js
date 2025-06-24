const { v4: uuidv4 } = require('uuid');
const Job = require('../src/models/job.model');
const { createJob, updateJobStatus } = require('../src/services/job.service');

jest.mock('uuid');
jest.mock('../src/models/job.model');

describe('jobService', () => {
  const fixedDate = new Date('2023-01-01T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
    Date.now = jest.fn(() => fixedDate.getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createJob', () => {
    test('should create a job successfully', async () => {
      const mockJobId = 'test-job-id';
      const videoId = 'video-123';
      const storageKey = 'storage/key/path';

      const mockJob = {
        id: mockJobId,
        video_id: videoId,
        storage_key: storageKey,
        status: 'processing',
        created_at: fixedDate,
        started_at: fixedDate,
        updated_at: fixedDate
      };

      uuidv4.mockReturnValue(mockJobId);
      Job.create.mockResolvedValue(mockJob);

      const result = await createJob({ videoId, storageKey });

      expect(uuidv4).toHaveBeenCalled();
      expect(Job.create).toHaveBeenCalledWith({
        id: mockJobId,
        video_id: videoId,
        storage_key: storageKey,
        status: 'processing',
        created_at: fixedDate,
        started_at: fixedDate,
        updated_at: fixedDate
      });
      expect(result).toEqual(mockJob);
    });

    test('should handle database errors', async () => {
      const error = new Error('Database error');
      uuidv4.mockReturnValue('test-job-id');
      Job.create.mockRejectedValue(error);

      await expect(createJob({ videoId: 'video-123', storageKey: 'key' }))
        .rejects.toThrow('Database error');
    });
  });

  describe('updateJobStatus', () => {
    test('should update job status to processing', async () => {
      const jobId = 'job-123';
      const status = 'processing';

      Job.update.mockResolvedValue([1]);

      const result = await updateJobStatus(jobId, status);

      expect(Job.update).toHaveBeenCalledWith(
        {
          status: 'processing',
          updated_at: fixedDate,
          started_at: fixedDate
        },
        { where: { id: jobId } }
      );

      expect(result).toEqual({
        status: 'processing',
        updated_at: fixedDate,
        started_at: fixedDate
      });
    });

    test('should update job status to completed', async () => {
      const jobId = 'job-123';
      const status = 'completed';

      Job.update.mockResolvedValue([1]);

      const result = await updateJobStatus(jobId, status);

      expect(Job.update).toHaveBeenCalledWith(
        {
          status: 'completed',
          updated_at: fixedDate,
          finished_at: fixedDate
        },
        { where: { id: jobId } }
      );

      expect(result).toEqual({
        status: 'completed',
        updated_at: fixedDate,
        finished_at: fixedDate
      });
    });

    test('should update job status to failed', async () => {
      const jobId = 'job-123';
      const status = 'failed';

      Job.update.mockResolvedValue([1]);

      const result = await updateJobStatus(jobId, status);

      expect(Job.update).toHaveBeenCalledWith(
        {
          status: 'failed',
          updated_at: fixedDate,
          finished_at: fixedDate
        },
        { where: { id: jobId } }
      );

      expect(result).toEqual({
        status: 'failed',
        updated_at: fixedDate,
        finished_at: fixedDate
      });
    });

    test('should include error message when provided', async () => {
      const jobId = 'job-123';
      const status = 'failed';
      const errorMessage = 'Processing failed';

      Job.update.mockResolvedValue([1]);

      const result = await updateJobStatus(jobId, status, { error_message: errorMessage });

      expect(Job.update).toHaveBeenCalledWith(
        {
          status: 'failed',
          updated_at: fixedDate,
          finished_at: fixedDate,
          error_message: errorMessage
        },
        { where: { id: jobId } }
      );

      expect(result).toEqual({
        status: 'failed',
        updated_at: fixedDate,
        finished_at: fixedDate,
        error_message: errorMessage
      });
    });

    test('should handle database update errors', async () => {
      const error = new Error('Update failed');
      Job.update.mockRejectedValue(error);

      await expect(updateJobStatus('job-123', 'completed'))
        .rejects.toThrow('Update failed');
    });
  });
});
