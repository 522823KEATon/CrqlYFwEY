// 代码生成时间: 2025-10-10 01:43:24
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom'); // 用于返回错误
const Joi = require('@hapi/joi'); // 用于数据验证

// 模拟数据库
const purchases = [];

// 创建Hapi服务器
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 定义购买请求的数据验证规则
const purchaseSchema = Joi.object()
    .keys({
        userId: Joi.string().required(),
        productId: Joi.string().required(),
        quantity: Joi.number().required().min(1)
    })
    .required();

// 定义路由处理函数
async function handlePurchase(request, h) {
    const { userId, productId, quantity } = request.payload;

    // 检查购买请求是否有效
    if (!purchaseSchema.validate(request.payload).error) {
        // 模拟购买操作
        const purchase = { userId, productId, quantity, timestamp: new Date() };
        purchases.push(purchase);
        return { message: 'Purchase successful', purchase };
    } else {
        // 如果请求数据无效，返回错误
        throw Boom.badData('Invalid purchase data');
    }
}

// 添加路由
server.route({
    method: 'POST',
    path: '/purchase',
    options: {
        description: 'Handles game product purchases',
        notes: 'Receives a JSON payload with userId, productId, and quantity',
        tags: ['api'],
        validate: {
            payload: purchaseSchema
        },
        response: {
            schema: Joi.object().keys({
                message: Joi.string().required(),
                purchase: Joi.object().keys({
                    userId: Joi.string().required(),
                    productId: Joi.string().required(),
                    quantity: Joi.number().required().min(1),
                    timestamp: Joi.date().required()
                }).required()
            })
        }
    },
    handler: handlePurchase
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

start().catch(console.error);
