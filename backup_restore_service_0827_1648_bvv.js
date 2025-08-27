// 代码生成时间: 2025-08-27 16:48:46
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Fs = require('fs');
const Path = require('path');
const zlib = require('zlib');
const Stream = require('stream');

// Helper function to compress and write data to a backup file
const writeBackup = async (data, filePath) => {
  return new Promise((resolve, reject) => {
    const gzip = zlib.createGzip();
    const writeStream = Fs.createWriteStream(filePath);

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);

    data.pipe(gzip).pipe(writeStream);
  });
};

// Helper function to decompress and restore data from a backup file
const restoreBackup = async (filePath) => {
  return new Promise((resolve, reject) => {
    const gunzip = zlib.createGunzip();
    const readStream = Fs.createReadStream(filePath);

    readStream.on('error', reject);
    readStream.pipe(gunzip)
      .on('data', resolve)
      .on('error', reject);
  });
};

// Create a new server
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

// Plugin to serve the backup and restore endpoints
const backupRestorePlugin = {
  name: 'backupRestore',
  version: '1.0.0',
  register: async (server, options) => {
    // Endpoint to create a backup
    server.route({
      method: 'POST',
      path: '/backup',
      handler: async (request, h) => {
        try {
          const backupData = request.payload; // assuming the payload is a Readable Stream
          const filePath = Path.join('backups', `backup-${Date.now()}.gz`);
          await writeBackup(backupData, filePath);
          return h.response({ message: 'Backup created successfully', filePath }).code(201);
        } catch (error) {
          throw Boom.internal(error);
        }
      },
    });

    // Endpoint to restore from a backup
    server.route({
      method: 'POST',
      path: '/restore',
      options: {
        payload: {
          maxBytes: 2 * 1024 * 1024 * 1024 // 2 MB limit
        },
      },
      handler: async (request, h) => {
        try {
          const filePath = request.payload.filePath;
          const restoredData = await restoreBackup(filePath);
          return h.response(restoredData).code(200);
        } catch (error) {
          throw Boom.internal(error);
        }
      },
    });
  },
};

// Start the server
async function start() {
  await server.register(backupRestorePlugin);
  await server.start();
  console.log('Server running on %s', server.info.uri);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Documentation:
// This service provides endpoints to create backups of data and restore from them.
// It uses gzip to compress the backup data before saving it to a file.
// The restore endpoint decompresses the backup and returns the original data.
