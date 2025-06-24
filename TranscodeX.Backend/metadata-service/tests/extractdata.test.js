const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { extractMetadata } = require('../src/utils/extract');

jest.mock('fs');
jest.mock('fluent-ffmpeg', () => {
  const ffprobeMock = jest.fn();
  return {
    ffprobe: ffprobeMock,
    setFfmpegPath: jest.fn(),
    setFfprobePath: jest.fn(),
  };
});

describe('extractMetadata (mocked)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return metadata when ffprobe and fs.statSync succeed', async () => {
 
    const fakeMetadata = {
      format: { duration: 60 },
      streams: [
        {
          codec_type: 'video',
          width: 1920,
          height: 1080,
          codec_name: 'h264',
        }
      ]
    };
    ffmpeg.ffprobe.mockImplementation((path, cb) => cb(null, fakeMetadata));
    fs.statSync.mockReturnValue({ size: 123456 });

 
    const result = await extractMetadata('dummy/path/video.mp4');

    expect(result).toEqual({
      duration: 60,
      width: 1920,
      height: 1080,
      codec: 'h264',
      size: 123456,
    });
  });

  it('should reject if ffprobe returns an error', async () => {
    ffmpeg.ffprobe.mockImplementation((path, cb) => cb(new Error('ffprobe error'), null));

    await expect(extractMetadata('dummy/path/video.mp4')).rejects.toThrow('ffprobe error');
  });

  it('should reject if no video stream is found', async () => {
    const fakeMetadata = {
      format: { duration: 10 },
      streams: [] // no video stream
    };
    ffmpeg.ffprobe.mockImplementation((path, cb) => cb(null, fakeMetadata));

    await expect(extractMetadata('dummy/path/video.mp4')).rejects.toThrow('No video stream found');
  });
});
