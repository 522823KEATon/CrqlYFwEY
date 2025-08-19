// 代码生成时间: 2025-08-19 17:51:20
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('joi'); // 用于请求数据验证

// 创建一个新的Hapi服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 用户验证信息（在实际应用中，这些信息应该存储在数据库中）
const users = {
    'john': {
        password: '123456',
        isValid: true // 假设用户是有效的
    }
};

// 登录请求验证规则
const loginValidationRules = {
    username: Joi.string().required(),
    password: Joi.string().required()
};

// 登录路由的处理函数
const loginHandler = async (request, h) => {
    const { username, password } = request.payload;

    // 检查用户是否存在
    const user = users[username];
    if (!user || !user.isValid) {
        throw Boom.unauthorized('用户不存在或账户被冻结');
    }

    // 验证密码
    if (user.password !== password) {
        throw Boom.unauthorized('密码错误');
    }

    // 返回登录成功的信息
    return {
        message: '登录成功',
        userId: username
    };
};

// 注册登录路由
server.route({
    method: 'POST',
    path: '/login',
    options: {
        validate: {
            payload: loginValidationRules, // 使用验证规则
            failAction: (request, h, error) => {
                throw Boom.badRequest(error); // 如果验证失败，则抛出错误
            }
        }
    },
    handler: loginHandler
});

// 启动服务器
async function start() {
    try {
        await server.start();
        console.log('服务器启动成功:', server.info.uri);
    } catch (err) {
        console.error('服务器启动失败:', err);
    }
}

start();

// 导出服务器实例，以便可以用于测试或扩展
module.exports = server;