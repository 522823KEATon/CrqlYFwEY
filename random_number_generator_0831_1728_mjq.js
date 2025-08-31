// 代码生成时间: 2025-08-31 17:28:23
const Hapi = require('@hapi/hapi');

// 创建服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 定义生成随机数的函数
  const generateRandomNumber = (min, max) => {
    // 检查输入是否有效
    if (min > max) {
      throw new Error('最小值不能大于最大值');
    }
    // 生成并返回一个随机数
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // 定义一个路由来生成随机数
  server.route({
    method: 'GET',
    path: '/random',
    handler: async (request, h) => {
      try {
        const { min, max } = request.query;
        const randomNumber = generateRandomNumber(min, max);
        return h.response({
          status: 'success',
          number: randomNumber
        });
      } catch (error) {
        // 返回错误信息
        return h.response({
          status: 'error',
          message: error.message
        }).statusCode(400);
      }
    }
  });

  // 启动服务器
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 调用初始化函数
init();

// 文档注释
/**
 * Random Number Generator Service
 *
 * @description A Hapi.js server that provides a RESTful endpoint to generate random numbers.
 * @module RandomNumberGenerator
 */

/**
 * Generate a random number between the given minimum and maximum values.
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random number between min and max.
 * @throws {Error} If min is greater than max.
 */
