// 代码生成时间: 2025-09-20 07:40:08
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ImageResizerService class that handles image resizing
class ImageResizerService {

    // Constructor to initialize the service
    constructor() {
        this.server = Hapi.server({
            port: 3000,
            host: 'localhost',
        });
    }

    // Method to start the server
    async start() {
        try {
            await this.server.register({
                plugin: require('hapi-plugin-inert'),
                options: {
                    cache: false,
                },
            });

            this.server.route({
                method: 'POST',
                path: '/resize',
                handler: this.resizeImages,
            });

            await this.server.start();
            console.log('Server running at:', this.server.info.uri);
        } catch (err) {
            console.error('Failed to start server:', err);
        }
    }

    // Method to handle image resizing
    async resizeImages(request, h) {
        const { payload, files } = request.payload;
        const { outputWidth, outputHeight } = payload;

        // Check for required parameters
        if (!outputWidth || !outputHeight) {
            return h.response({
                status: 'error',
                message: 'Output width and height must be provided.',
            }).code(400);
        }

        // Process each file in the request
        const resizedFiles = await Promise.all(files.map(async (file) => {
            try {
                const buffer = await sharp(file.path)
                    .resize({ width: outputWidth, height: outputHeight })
                    .toBuffer();

                // Delete the temporary file
                fs.unlinkSync(file.path);

                return {
                    filename: file.filename,
                    contentType: 'image/jpeg',
                    data: buffer,
                };
            } catch (err) {
                console.error('Failed to resize image:', err);
                return null;
            }
        }));

        // Filter out any files that failed to resize
        const successfulResizedFiles = resizedFiles.filter((file) => file !== null);

        // Return the resized files
        return h.response(successfulResizedFiles).code(200);
    }
}

// Initialize and start the service
const imageResizer = new ImageResizerService();
imageResizer.start();