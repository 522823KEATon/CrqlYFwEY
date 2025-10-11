// 代码生成时间: 2025-10-11 20:42:44
const Hapi = require('@hapi/hapi');

// 创建一个新的Hapi服务器实例
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 定义路由处理程序
    const tabRoutes = [{
        method: 'GET',
        path: '/{tab}',
        handler: async (request, h) => {
            const { tab } = request.params;
            // 检查标签是否存在
            if (!['home', 'profile', 'settings'].includes(tab)) {
                return h.response('Invalid tab')
                    .code(404);
            }
            // 返回相应标签的页面内容
            return `<h1>Welcome to the ${tab.charAt(0).toUpperCase() + tab.slice(1)} page</h1>`;
        }
    }];

    // 注册路由
    await server.route(tabRoutes);

    // 启动服务器
    await server.start();
    console.log('Server running at:', server.info.uri);
};

// 调用初始化函数
init().catch(err => {
    console.error(err);
    process.exit(1);
});