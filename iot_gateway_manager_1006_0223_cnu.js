// 代码生成时间: 2025-10-06 02:23:26
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');

// 创建Hapi服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// IoT网关管理路由
const routes = [
    {
        method: 'GET',
        path: '/gateways',
        handler: async (request, h) => {
            try {
                // 模拟从数据库获取网关列表
                const gateways = await getGateways();
                return gateways;
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        }
    },
    {
        method: 'POST',
        path: '/gateways',
        handler: async (request, h) => {
            try {
                // 验证请求体
                const { name, ip } = request.payload;
                if (!name || !ip) {
                    throw Boom.badRequest('Missing required fields');
                }
                // 模拟添加网关到数据库
                const newGateway = await addGateway(name, ip);
                return h.response(newGateway).code(201);
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        }
    },
    {
        method: 'PUT',
        path: '/gateways/{id}',
        handler: async (request, h) => {
            try {
                // 验证ID和请求体
                const { id } = request.params;
                const { name, ip } = request.payload;
                if (!id || !name || !ip) {
                    throw Boom.badRequest('Missing required fields');
                }
                // 模拟更新网关信息
                const updatedGateway = await updateGateway(id, name, ip);
                return updatedGateway;
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/gateways/{id}',
        handler: async (request, h) => {
            try {
                // 验证ID
                const { id } = request.params;
                if (!id) {
                    throw Boom.badRequest('Missing required fields');
                }
                // 模拟删除网关
                const result = await deleteGateway(id);
                return result;
            } catch (error) {
                throw Boom.badImplementation(error.message);
            }
        }
    }
];

// 启动服务器
async function start() {
    await server.register(routes);
    await server.start();
    console.log('Server running on %s', server.info.uri);
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});

// 模拟数据库操作
async function getGateways() {
    // 这里应该替换为实际的数据库查询逻辑
    return [{ id: 1, name: 'Gateway1', ip: '192.168.0.1' }, { id: 2, name: 'Gateway2', ip: '192.168.0.2' }];
}

async function addGateway(name, ip) {
    // 这里应该替换为实际的数据库添加逻辑
    return { id: 3, name, ip };
}

async function updateGateway(id, name, ip) {
    // 这里应该替换为实际的数据库更新逻辑
    return { id, name, ip };
}

async function deleteGateway(id) {
    // 这里应该替换为实际的数据库删除逻辑
    return { id, success: true };
}