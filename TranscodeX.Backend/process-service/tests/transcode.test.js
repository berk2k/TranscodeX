const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const { transcodeVideo } = require('../src/utils/ffmpeg');

jest.mock('child_process');
jest.mock('ffmpeg-static', () => '/usr/bin/ffmpeg');

describe('transcodeVideo', () => {
  let mockFFmpeg;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFFmpeg = {
      stderr: {
        on: jest.fn()
      },
      on: jest.fn()
    };

    spawn.mockReturnValue(mockFFmpeg);
  });

  test('should transcode video successfully', async () => {
    const inputPath = '/tmp/input.mp4';
    const outputPath = '/tmp/output.mp4';

    mockFFmpeg.on.mockImplementation((event, callback) => {
      if (event === 'close') {
        setTimeout(() => callback(0), 0);
      }
    });

    const promise = transcodeVideo(inputPath, outputPath);
    await expect(promise).resolves.toBeUndefined();

    expect(spawn).toHaveBeenCalledWith(ffmpegPath, [
      '-i', inputPath,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      outputPath
    ]);
  });

  test('should handle FFmpeg process errors', async () => {
    const inputPath = '/tmp/input.mp4';
    const outputPath = '/tmp/output.mp4';
    const error = new Error('FFmpeg process error');

    mockFFmpeg.on.mockImplementation((event, callback) => {
      if (event === 'error') {
        setTimeout(() => callback(error), 0);
      }
    });

    await expect(transcodeVideo(inputPath, outputPath)).rejects.toThrow('FFmpeg process error');
  });

  test('should handle FFmpeg exit with non-zero code', async () => {
    const inputPath = '/tmp/input.mp4';
    const outputPath = '/tmp/output.mp4';

    mockFFmpeg.on.mockImplementation((event, callback) => {
      if (event === 'close') {
        setTimeout(() => callback(1), 0);
      }
    });

    await expect(transcodeVideo(inputPath, outputPath)).rejects.toThrow('FFmpeg exited with code 1');
  });

  test('should log stderr data', async () => {
    const inputPath = '/tmp/input.mp4';
    const outputPath = '/tmp/output.mp4';
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    mockFFmpeg.stderr.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        callback(Buffer.from('FFmpeg stderr output'));
      }
    });

    mockFFmpeg.on.mockImplementation((event, callback) => {
      if (event === 'close') {
        setTimeout(() => callback(0), 0);
      }
    });

    await transcodeVideo(inputPath, outputPath);

    expect(consoleSpy).toHaveBeenCalledWith('FFmpeg stderr: FFmpeg stderr output');
    consoleSpy.mockRestore();
  });
});