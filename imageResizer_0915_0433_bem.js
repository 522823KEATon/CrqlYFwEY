// 代码生成时间: 2025-09-15 04:33:38
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Create a new HAPI server
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// Endpoint to handle the image resize request
server.route({
  method: 'POST',
  path: '/resize',
  options: {
    payload: {
      maxBytes: 1048576 // 1MB limit
    },
    validate: {
      payload: {
        images: Joi.array().items(Joi.object({
          path: Joi.string().required(),
          width: Joi.number().required(),
          height: Joi.number().required()
        })).required()
      }
    },
    handler: async (request, h) => {
      try {
        const { images } = request.payload;
        const resizedImages = [];

        // Process each image in the batch
        for (const image of images) {
          const { path, width, height } = image;

          // Check if the original image exists
          if (!fs.existsSync(path)) {
            throw new Error(`Image not found: ${path}`);
          }

          // Define the output path for the resized image
          const outputDir = path.dirname(path);
          const fileName = path.basename(path, path.extname(path));
          const resizedPath = `${outputDir}/${fileName}_resized.${path.extname(path)}`;

          // Resize the image
          await sharp(path)
            .resize({ width, height })
            .toFile(resizedPath);

          resizedImages.push({
            originalPath: path,
            resizedPath,
            width,
            height
          });
        }

        return {
          status: 'success',
          data: resizedImages
        };
      } catch (error) {
        return {
          status: 'error',
          message: error.message
        };
      }
    }
  }
});

// Start the server
async function start() {
  try {
    await server.start();
    console.log('Server running on %s', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();