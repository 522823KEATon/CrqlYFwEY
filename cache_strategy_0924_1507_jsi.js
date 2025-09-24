// 代码生成时间: 2025-09-24 15:07:39
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Cache = require('@hapi/catbox');
const Redis = require('catbox-redis');

// Create an instance of Hapi server
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Configuration for the cache
const cacheOptions = {
    expiresIn: 60000, // 60 seconds
    generateFunc: async (id, flags) => {
        // Function to generate data if not in cache
        return `Data for ${id}`;
    },
    cache: {
        engine: Redis,
        host: '127.0.0.1',
        port: 6379,
        password: '',
        partition: 'mycache'
    }
};

// Cache strategy
const cacheStrategy = 'cacheFirst';

// Route handler with cache
const getDataHandler = async (request, h) => {
    try {
        // Use the provided cache strategy
        const cache = await server.cache({
            segment: 'test',
            cache: cacheOptions.cache
        });
        
        // Retrieve data from cache or generate new
        const cachedData = await cache.get({ id: request.params.id, segment: 'test' }, cacheOptions.generateFunc);
        return h.response(cachedData).code(200);
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw Boom.badImplementation('Error retrieving data from cache');
    }
};

// Register the route
server.route({
    method: 'GET',
    path: '/data/{id}',
    handler: getDataHandler,
    config: {
        plugins: {
            'hapi-redis-cache': {
                // Configure cache strategy
                cache: cacheStrategy,
                // Define how long to cache the data
                expiresIn: cacheOptions.expiresIn,
                // Cache segment for the route
                segment: 'test'
            }
        }
    }
});

// Start the server
async function startServer() {
    try {
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (error) {
        console.error('Server failed to start:', error);
    }
}

startServer();