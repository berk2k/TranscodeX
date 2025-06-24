const axios = require('axios');
const { updateUploadStatus } = require('../src/utils/uploadServiceClient');

jest.mock('axios');

process.env.UPLOAD_SERVICE_URL = 'http://upload-service:3000';

describe('updateUploadStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update upload status successfully', async () => {
    const id = 'test-id';
    const status = 'completed';

    axios.patch.mockResolvedValue({ data: { success: true } });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await updateUploadStatus(id, status);

    expect(axios.patch).toHaveBeenCalledWith(
      'http://upload-service:3000/uploads/test-id/status',
      { status: 'completed' }
    );
    expect(consoleSpy).toHaveBeenCalledWith('Upload status updated to completed for video test-id');
    
    consoleSpy.mockRestore();
  });

  test('should handle API errors gracefully', async () => {
    const id = 'test-id';
    const status = 'failed';
    const error = new Error('API Error');

    axios.patch.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await updateUploadStatus(id, status);

    expect(axios.patch).toHaveBeenCalledWith(
      'http://upload-service:3000/uploads/test-id/status',
      { status: 'failed' }
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update upload status:', 'API Error');
    
    consoleSpy.mockRestore();
  });

  test('should handle different status values', async () => {
    const testCases = ['processing', 'completed', 'failed', 'pending'];
    
    axios.patch.mockResolvedValue({ data: { success: true } });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    for (const status of testCases) {
      await updateUploadStatus('test-id', status);
      expect(axios.patch).toHaveBeenCalledWith(
        'http://upload-service:3000/uploads/test-id/status',
        { status }
      );
    }
    
    consoleSpy.mockRestore();
  });
});