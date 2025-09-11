// 代码生成时间: 2025-09-12 05:56:36
const Hapi = require('@hapi/hapi');
const crypto = require('crypto');

// 定义哈希计算服务
class HashCalculatorService {
  // 计算哈希值的方法
  calculateHash(input) {
    // 使用SHA256进行哈希计算
    return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
  }
}

// 创建Hapi服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 路由：计算哈希值
  server.route({
    method: 'POST',
    path: '/calculate-hash',
    handler: async (request, h) => {
      // 从请求体中获取待计算哈希的值
      const { value } = request.payload;
      if (!value) {
        return h.response({
          status: 'error',
          message: 'Value is required to calculate hash'
        }).code(400);
      }

      try {
        // 使用哈希服务计算哈希值
        const service = new HashCalculatorService();
        const hash = service.calculateHash(value);
        return {
          status: 'success',
          hash: hash
        };
      } catch (error) {
        // 错误处理
        return h.response({
          status: 'error',
          message: error.message
        }).code(500);
      }
    }
  });

  // 启动服务器
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

// 启动服务器
init().catch(err => {
  console.error(err);
  process.exit(1);
});