// 代码生成时间: 2025-08-24 19:42:24
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const isValidUrl = require('is-url');

// 创建服务器实例
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 定义URL有效性验证路由
    server.route({
        method: 'GET',
        path: '/validate-url',
        handler: async (request, h) => {
            const { url } = request.query;
            
            // 使用Joi验证URL参数
            const schema = Joi.object({
                url: Joi.string().required()
            });
            const { error, value } = schema.validate({ url });
            
            if (error) {
                return h.response('Invalid URL parameter').code(400);
            }
            
            // 检查URL是否有效
            if (isValidUrl(value.url)) {
                return h.response('Valid URL').code(200);
            } else {
                return h.response('Invalid URL').code(400);
            }
        }
    });

    // 启动服务器
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// 调用初始化函数
init();