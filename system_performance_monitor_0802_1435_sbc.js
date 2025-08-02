// 代码生成时间: 2025-08-02 14:35:44
const Hapi = require('@hapi/hapi');
const os = require('os-utils');

// 创建一个Hapi服务器实例并指定端口
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 性能监控API路由
const performanceRoutes = {
    method: 'GET',
    path: '/performance',
    handler: async (request, h) => {
        try {
            // 获取CPU使用率
            const cpuUsage = await os.cpuUsage();
            // 获取内存使用率
            const memoryUsage = await os.freememPercentage();
            // 构建性能监控数据
            const performanceData = {
                cpuUsage: cpuUsage,
                memoryUsage: memoryUsage
            };
            // 返回性能监控数据
            return performanceData;
        } catch (error) {
            // 错误处理
            console.error('Error in performance API:', error);
            return h.response('Internal Server Error').code(500);
        }
    }
};

// 注册性能监控路由
server.route(performanceRoutes);

// 启动服务器
async function startServer() {
    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

// 调用启动服务器函数
startServer();

// 导出服务器实例，以便可以进行单元测试
module.exports = server;