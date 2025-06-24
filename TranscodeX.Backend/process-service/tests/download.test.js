const fs = require('fs');
const https = require('https');
const http = require('http');
const { downloadFile } = require('../src/utils/download');

jest.mock('fs');
jest.spyOn(https, 'get').mockImplementation();
jest.spyOn(http, 'get').mockImplementation();

describe('downloadFile', () => {
    let mockWriteStream;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        jest.clearAllMocks();

        mockWriteStream = {
            on: jest.fn((event, callback) => {
                if (event === 'finish') {
                process.nextTick(callback);
                }
            }),
            close: jest.fn((cb) => cb?.())
        };


        mockRequest = {
        on: jest.fn()
        };

        mockResponse = {
        statusCode: 200,
        pipe: jest.fn()
        };

        fs.createWriteStream.mockReturnValue(mockWriteStream);
        fs.unlink.mockImplementation((path, callback) => callback());
    });

    test('should download file successfully via HTTPS', async () => {
        const fileUrl = 'https://example.com/file.txt';
        const destPath = '/tmp/file.txt';

        https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return mockRequest;
        });

        const promise = downloadFile(fileUrl, destPath);
        await expect(promise).resolves.toBeUndefined();

        expect(https.get).toHaveBeenCalledWith(fileUrl, expect.any(Function));
        expect(fs.createWriteStream).toHaveBeenCalledWith(destPath);
        expect(mockResponse.pipe).toHaveBeenCalledWith(mockWriteStream);
    });

    test('should download file successfully via HTTP', async () => {
        const fileUrl = 'http://example.com/file.txt';
        const destPath = '/tmp/file.txt';

        http.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return mockRequest;
        });

        const promise = downloadFile(fileUrl, destPath);
        await expect(promise).resolves.toBeUndefined();

        expect(http.get).toHaveBeenCalledWith(fileUrl, expect.any(Function));
    });

    test('should reject when response status is not 200', async () => {
        const fileUrl = 'https://example.com/file.txt';
        const destPath = '/tmp/file.txt';

        mockResponse.statusCode = 404;

        https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return mockRequest;
        });

        await expect(downloadFile(fileUrl, destPath)).rejects.toThrow(
        "Failed to get 'https://example.com/file.txt' (404)"
        );
    });

    test('should handle request errors', async () => {
    const fileUrl = 'https://example.com/file.txt';
    const destPath = '/tmp/file.txt';
    const error = new Error('Network error');

    let errorHandler;

    mockRequest.on.mockImplementation((event, callback) => {
        if (event === 'error') {
        errorHandler = callback;
        }
    });

    https.get.mockImplementation(() => mockRequest);

    const promise = downloadFile(fileUrl, destPath);

    errorHandler(error);

    await expect(promise).rejects.toThrow('Network error');
    expect(fs.unlink).toHaveBeenCalledWith(destPath, expect.any(Function));
    });

    test('should handle file write errors', async () => {
        const fileUrl = 'https://example.com/file.txt';
        const destPath = '/tmp/file.txt';
        const error = new Error('Write error');

        https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return mockRequest;
        });

        mockWriteStream.on.mockImplementation((event, callback) => {
        if (event === 'error') {
            setTimeout(() => callback(error), 0);
        }
        });

        await expect(downloadFile(fileUrl, destPath)).rejects.toThrow('Write error');
        expect(fs.unlink).toHaveBeenCalledWith(destPath, expect.any(Function));
    });
});
