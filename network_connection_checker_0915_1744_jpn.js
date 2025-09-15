// 代码生成时间: 2025-09-15 17:44:06
const Hapi = require('@hapi/hapi');
const Good = require('@hapi/good');
const axios = require('axios');

/**
 * Creates a Hapi server and starts the network connection checker.
 * @param {number} port The port number on which the server will listen.
 */
async function startServer(port) {
    const server = Hapi.server({
        port: port,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    });

    await server.register(Good);

    // Define a route to check network connection status
    server.route({
        method: 'GET',
        path: '/check-connection',
        handler: async (request, h) => {
            try {
                // Attempt to ping a reliable endpoint (e.g., Google)
                const response = await axios.get('https://www.google.com');
                return h.response({ status: 'connected', message: 'The network connection is active.' });
            } catch (error) {
                // Handle network errors
                return h.response({ status: 'disconnected', message: 'The network connection is not active.' }).code(503);
            }
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

// Start the server on port 3000
startServer(3000);