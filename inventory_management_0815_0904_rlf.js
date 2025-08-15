// 代码生成时间: 2025-08-15 09:04:39
const Hapi = require('@hapi/hapi');
const Joi = require('joi');

// 定义库存状态
const inventory = {
    '001': { name: 'Widget', quantity: 10 },
    '002': { name: 'Gadget', quantity: 5 }
};

// 创建服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 添加库存物品路由
    server.route({
        method: 'POST',
        path: '/inventory',
        handler: async (request, h) => {
            const item = request.payload;
            if (!item.code) {
                return h.response({ status: 'error', message: 'Item code is required' }).code(400);
            }
            if (!item.name) {
                return h.response({ status: 'error', message: 'Item name is required' }).code(400);
            }
            if (!item.quantity) {
                return h.response({ status: 'error', message: 'Item quantity is required' }).code(400);
            }
            inventory[item.code] = item;
            return { status: 'success', item };
        },
        options: {
            validate: {
                payload: Joi.object({
                    code: Joi.string().required(),
                    name: Joi.string().required(),
                    quantity: Joi.number().required()
                })
            }
        }
    });

    // 获取库存路由
    server.route({
        method: 'GET',
        path: '/inventory/{code}',
        handler: async (request, h) => {
            const { code } = request.params;
            const item = inventory[code];
            if (!item) {
                return h.response({ status: 'error', message: 'Item not found' }).code(404);
            }
            return item;
        }
    });

    // 更新库存物品路由
    server.route({
        method: 'PUT',
        path: '/inventory/{code}',
        handler: async (request, h) => {
            const { code } = request.params;
            const item = inventory[code];
            if (!item) {
                return h.response({ status: 'error', message: 'Item not found' }).code(404);
            }
            const update = request.payload;
            if (update.quantity) {
                item.quantity = update.quantity;
            }
            return item;
        }
    });

    // 启动服务器
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init().catch(err => {
    console.error(err);
    process.exit(1);
});
