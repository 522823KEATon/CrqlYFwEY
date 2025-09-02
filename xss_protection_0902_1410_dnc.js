// 代码生成时间: 2025-09-02 14:10:41
const Hapi = require('hapi');
const Joi = require('joi');
const xss = require('xss');

// 创建一个Hapi服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

// 定义一个路由，用于接收用户的输入
const userInputRoute = {
  method: 'POST',
  path: '/user-input',
  options: {
    validate: {
      payload: Joi.object({
        text: Joi.string().required().description('User input text'),
      }),
    handler: async (err, value, source, errorDetails) => {
      if (err) {
        // 错误处理，返回400 Bad Request状态码和错误信息
        return err;
      }
    },
  },
  handler: async (request, h) => {
    try {
      // 使用xss库来清洗用户输入，防止XSS攻击
      const sanitizedText = xss(request.payload.text);
      // 将清洗后的文本返回给客户端
      return { sanitizedText };
    } catch (error) {
      // 错误处理，返回500 Internal Server Error状态码和错误信息
      return h.response({ statusCode: 500, message: error.message }).code(500);
    }
  },
};

// 注册路由到服务器
server.route(userInputRoute);

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
