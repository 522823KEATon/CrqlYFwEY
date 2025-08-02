// 代码生成时间: 2025-08-02 21:22:11
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const path = require('path');

// 创建服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 注册插件
async function start() {
    await server.register([
        Inert,
        Vision
    ]);
    
    // 设置视图
    await server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: './views',
        layoutPath: './views/layouts',
        layout: 'default',
        partialsPath: './views/partials',
        helpersPath: './views/helpers'
    });
    
    // 定义响应式布局的路由
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: async (request, h) => {
            try {
                // 响应式布局，根据请求参数渲染不同的页面
                const page = request.params.param ? request.params.param : 'home';
                return h.view(page, { title: 'Responsive Layout with Hapi' });
            } catch (error) {
                // 错误处理
                return h.response('An error occurred while rendering the page.').code(500);
            }
        }
    });
    
    // 启动服务器
    await server.start();
    console.log('Server running at:', server.info.uri);
}

// 导出start函数以便能从外部启动
module.exports = start;

// 如果直接运行这个文件，则启动服务器
if (require.main === module) {
    start();
}

// 视图引擎的辅助函数
Handlebars.registerHelper('uppercase', function(text) {
    return text.toUpperCase();
});