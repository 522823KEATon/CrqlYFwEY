// 代码生成时间: 2025-08-27 22:01:21
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('joi');

// 定义访问控制插件
const AccessControl = {
    async register(server, options) {
        // 插件名称
        const name = 'access-control';
        // 注册插件
        await server.register({name,
            async requirements(authorization, h) {
                // 验证用户是否具有访问权限
                if (!authorization.credentials.role || authorization.credentials.role !== 'admin') {
                    throw Boom.unauthorized('Insufficient permissions');
                }
                return h.continue;
            }
        });
    },
    pkg: {
        name: 'access-control',
        version: '1.0.0'
    },
    requirements: {
        once: true
    }
};

// 创建Hapi服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 注册访问控制插件
    await server.register(AccessControl);

    // 定义受保护的路由
    server.route({
        method: 'GET',
        path: '/protected',
        options: {
            auth: 'access-control',
            plugins: {
                'access-control': {
                    roles: ['admin']
                }
            },
            handler: (request, h) => {
                return 'Welcome to the protected admin area';
            }
        }
    });

    // 定义公共路由
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Welcome to the public area';
        }
    });

    // 启动服务器
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// 调用初始化函数
init();
