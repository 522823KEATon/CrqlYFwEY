// 代码生成时间: 2025-08-24 09:18:01
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const Crypto = require('crypto');
const zlib = require('zlib');

// Helper function to hash the data for verification
function hashData(data) {
    return Crypto.createHash('sha256').update(data).digest('hex');
}

// Helper function to compress the data
function compressData(data) {
    return zlib.gzipSync(data);
}

// Helper function to decompress the data
function decompressData(data) {
    return zlib.unzipSync(data);
}

// Helper function to save backup data to a file
function saveBackup(backupData, backupHash) {
    const backupFilePath = path.join(__dirname, 'backup', `${backupHash}.gz`);
    fs.writeFileSync(backupFilePath, backupData);
    return backupFilePath;
}

// Helper function to load backup data from a file
function loadBackup(backupFilePath) {
    const data = fs.readFileSync(backupFilePath);
    return decompressData(data);
}

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 3000,
});

// Add a route for backing up data
server.route({
    method: 'POST',
    path: '/backup',
    handler: async (request, h) => {
        const { data } = request.payload;
        try {
            const compressedData = compressData(JSON.stringify(data));
            const backupHash = hashData(compressedData);
            const backupFilePath = saveBackup(compressedData, backupHash);
            return h.response({ message: 'Backup successful', backupFilePath, backupHash }).code(201);
        } catch (error) {
            return h.response({ message: 'Failed to backup data', error: error.message }).code(500);
        }
    },
});

// Add a route for restoring data
server.route({
    method: 'POST',
    path: '/restore',
    handler: async (request, h) => {
        const { backupHash } = request.payload;
        try {
            const backupFilePath = path.join(__dirname, 'backup', `${backupHash}.gz`);
            if (!fs.existsSync(backupFilePath)) {
                return h.response({ message: 'Backup file not found' }).code(404);
            }
            const backupData = loadBackup(backupFilePath);
            return h.response({ message: 'Restore successful', data: JSON.parse(backupData) }).code(200);
        } catch (error) {
            return h.response({ message: 'Failed to restore data', error: error.message }).code(500);
        }
    },
});

// Start the server
async function start() {
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

start();

// Export the server for testing purposes
module.exports = server;