// 代码生成时间: 2025-09-10 10:39:46
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra'); // For file system operations

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // Define routes for the server
  server.route({
    method: 'POST',
    path: '/backup',
    handler: async (request, h) => {
      try {
        // Extract source and destination from request payload
        const { source, destination } = request.payload;
        if (!source || !destination) {
          return h.response('Source and destination are required.').code(400);
        }

        // Perform backup operation
        const backupResult = await backupFile(source, destination);
        return h.response(backupResult).code(200);
      } catch (error) {
        // Handle error in backup process
        return h.response(error.message).code(500);
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// Function to backup a file
async function backupFile(sourcePath, destinationPath) {
  try {
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source file does not exist.');
    }

    // Create destination directory if it does not exist
    const destinationDir = path.dirname(destinationPath);
    await fse.ensureDir(destinationDir);

    // Copy file from source to destination
    await fse.copy(sourcePath, destinationPath);
    return `Backup successful: ${sourcePath} -> ${destinationPath}`;
  } catch (error) {
    // Log error and throw
    console.error('Backup error:', error.message);
    throw error;
  }
}

// Start the server
init();