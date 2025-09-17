// 代码生成时间: 2025-09-17 09:30:22
const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const helmet = require('helmet');
const xss = require('xss');

// 创建HAPI服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost',
});

// 注册inert插件用于提供静态文件服务
await server.register(inert);

// 注册helmet插件以增加安全性
await server.register(helmet);

// 路由配置
server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
        return h.view('index', { title: 'XSS Protection' });
    },
    config: {
        // 使用xss中间件进行XSS攻击防护
        plugins: {
            xss: {
                query: xss()
            }
        }
    }
});

// 启动服务器
async function start() {
    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

start();

// 以下是模板引擎的配置，需要在views文件夹下创建index.html文件
// 模板引擎配置
const Handlebars = require('handlebars');
const path = require('path');
Handlebars.registerHelper('xss', function(context) {
    return new Handlebars.SafeString(xss(context));
});
const view = require('hapi').views({
    engines: { handlebars: Handlebars },
    relativeTo: __dirname,
    path: './views',
    isCached: false,
    partialsPath: './views/partials',
});

// 配置XSS中间件
server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isServer && response.source.template) {
        // 对模板引擎返回的HTML进行XSS过滤
        const html = xss(response.source.context.html);
        response.source.context.html = html;
    }
    return h.continue;
});
