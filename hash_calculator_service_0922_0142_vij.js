// 代码生成时间: 2025-09-22 01:42:04
const Hapi = require('@hapi/hapi');
const Crypto = require('crypto');

// 创建 Hapi 服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

// 定义哈希计算的路由
const hashCalculatorRoute = {
  method: 'POST',
  path: '/hash',
  handler: async (request, h) => {
    try {
      // 从请求体中获取需要哈希的字符串
      const { text } = request.payload;
      if (!text) {
        return h.response({ status: 'error', message: 'Missing text to hash' }).code(400);
      }
      
      // 使用 Crypto 模块计算哈希值
      const hash = Crypto.createHash('sha256').update(text).digest('hex');
      
      // 返回哈希值
      return {
        status: 'success',
        hash,
      };
    } catch (error) {
      // 错误处理
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },
};

// 注册路由到服务器
server.route(hashCalculatorRoute);

// 启动服务器
async function start() {
  await server.start();
  console.log('Server running on %s', server.info.uri);
}

start()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });