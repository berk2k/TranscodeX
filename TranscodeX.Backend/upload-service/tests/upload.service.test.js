const { processUpload } = require('../src/services/upload.service');
const { uploadToB2 } = require('../src/utils/b2Client');
const { sendToQueue } = require('../src/queue/rabbitmqProducer');
const fs = require('fs');
const Upload = require('../src/models/upload.model');
const path = require('path');

jest.mock('../src/utils/b2Client');
jest.mock('../src/queue/rabbitmqProducer');
jest.mock('../src/models/upload.model'); 

describe('processUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
  });

  const fakeFile = {
    originalname: 'testvideo.mp4',
    mimetype: 'video/mp4',
    path: '/tmp/testvideo.mp4'
  };

  beforeEach(() => {
    uploadToB2.mockResolvedValue('fake-storage-key');
    Upload.create.mockResolvedValue({ id: 'some-video-id' });
    sendToQueue.mockResolvedValue();
  });

  it('should upload file to B2 with correct path and extension', async () => {
    await processUpload(fakeFile);
    expect(uploadToB2).toHaveBeenCalledWith(fakeFile.path, expect.stringContaining('.mp4'));
  });

  it('should save DB record with correct data', async () => {
    await processUpload(fakeFile);
    expect(Upload.create).toHaveBeenCalledWith(expect.objectContaining({
      original_name: fakeFile.originalname,
      mime_type: fakeFile.mimetype,
      storage_key: 'fake-storage-key',
      status: 'pending',
    }));
  });

  it('should delete the local file after upload', async () => {
    await processUpload(fakeFile);
    expect(fs.unlinkSync).toHaveBeenCalledWith(fakeFile.path);
  });

  it('should send a queue message with a videoId', async () => {
    const result = await processUpload(fakeFile);
    expect(sendToQueue).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      videoId: expect.any(String)
    }));
    expect(result).toHaveProperty('videoId');
  });
});

