// 代码生成时间: 2025-10-02 04:42:57
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 3000,
});

// Define the route for processing audio
server.route({
    method: 'POST',
    path: '/process-audio',
    options: {
        validate: {
            payload: Joi.object({
                inputFile: Joi.string().required(),
                outputFile: Joi.string().required(),
                action: Joi.string().required(),
            }),
        },
        handler: async (request, h) => {
            const { inputFile, outputFile, action } = request.payload;
            try {
                switch (action) {
                    case 'convert':
                        await convertAudio(inputFile, outputFile);
                        return {
                            status: 'success',
                            message: 'Audio conversion successful',
                        };
                    default:
                        return {
                            status: 'error',
                            message: 'Unsupported action',
                        };
                }
            } catch (error) {
                console.error('Error processing audio:', error);
                return {
                    status: 'error',
                    message: 'Error processing audio',
                    details: error.message,
                };
            }
        },
    },
);

// Audio conversion function
async function convertAudio(inputFile, outputFile) {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
        throw new Error('Input file not found');
    }

    // Set up ffmpeg command
    const command = ffmpeg(inputFile);

    // Specify output format and codec
    command.addOption('-f', 'mp3');
    command.audioCodec('libmp3lame');
    command.audioFrequency(44100);

    // Save output to file
    command.toFormat('mp3').saveToFile(outputFile);
}

// Start the server
async function startServer() {
    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();