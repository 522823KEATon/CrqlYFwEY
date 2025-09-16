// 代码生成时间: 2025-09-16 17:05:37
// Dependencies
const Hapi = require('@hapi/hapi');

// Create a new Hapi server
const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

// User model (for demonstration purposes, using a simple object)
const users = {
    'user1': {
        id: 'user1',
        name: 'John Doe',
        permissions: ['read', 'write'],
    },
    'user2': {
        id: 'user2',
        name: 'Jane Doe',
        permissions: ['read'],
    },
};

// Helper function to check user permissions
const hasPermission = (userId, permission) => {
    const user = users[userId];
    if (!user) {
        throw new Error('User not found');
    }
    return user.permissions.includes(permission);
};

// Route handlers
const routes = [
    {
        method: 'GET',
        path: '/permissions/{userId}',
        handler: async (request, h) => {
            const { userId } = request.params;
            try {
                const permissions = users[userId].permissions;
                return {
                    status: 'success',
                    data: permissions,
                };
            } catch (error) {
                return h.response({
                    status: 'error',
                    message: error.message,
                }).code(404);
            }
        },
    },
    {
        method: 'POST',
        path: '/permissions/{userId}',
        handler: async (request, h) => {
            const { userId } = request.params;
            const { permission } = request.payload;
            try {
                if (!users[userId]) {
                    return h.response({
                        status: 'error',
                        message: 'User not found',
                    }).code(404);
                }
                if (!hasPermission(userId, permission)) {
                    return h.response({
                        status: 'error',
                        message: 'Permission denied',
                    }).code(403);
                }
                return {
                    status: 'success',
                    message: 'Access granted',
                };
            } catch (error) {
                return h.response({
                    status: 'error',
                    message: error.message,
                }).code(500);
            }
        },
    },
];

// Start the server
async function start() {
    try {
        await server.register(require('vision')); // Register vision plugin for views
        await server.views({
            engines: {
                html: require('handlebars'),
            },
            relativeTo: __dirname,
            path: 'views',
        });
        server.route(routes);
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();