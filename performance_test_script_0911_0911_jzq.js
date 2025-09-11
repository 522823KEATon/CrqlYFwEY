// 代码生成时间: 2025-09-11 09:11:37
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const Blipp = require('blipp');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const H2o2 = require('h2o2');
const Joi = require('joi');
const { performance } = require('perf_hooks');

// 配置路由和插件
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.register(Inert);
  await server.register(Vision);
  await server.register(H2o2);
  await server.register(Blipp);

  // 定义一个简单的性能测试路由
  server.route({
    method: 'GET',
    path: '/performance-test',
    handler: async (request, h) => {
      // 开始性能测试
      const start = performance.now();
      const response = await h2o2.handler.file(path.join(__dirname, 'public', 'index.html'));
      const end = performance.now();

      // 计算性能指标
      const duration = end - start;
      console.log(`Performance Test Duration: ${duration} ms`);

      return response;
    }
  });

  await server.start();
  console.log('Server running at:', server.info.uri);
};

// 处理未捕获的错误
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// 执行初始化函数
init();