// 代码生成时间: 2025-08-12 06:59:09
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const xss = require('xss');

// 配置Hapi服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 注册xss插件
  await server.register({
    plugin: require('hapi-plugin-nue')
  });

  // 定义路由和请求处理程序
  server.route({
    method: 'POST',
    path: '/xss-protection',
    options: {
      validate: {
        payload: Joi.object({
          data: Joi.string().required() // 验证payload中的data字段
        })
      },
      plugins: {
        'hapi-plugin-nue': {
          origins: ['*'], // 允许来自任何源的请求
          isEnabled: true, // 启用XSS保护
          xssWithWhiteList: false // 不使用白名单模式
        }
      },
      handler: async (request, h) => {
        try {
          // 清理输入数据以防止XSS攻击
          const cleanData = xss(request.payload.data);
          // 向客户端返回清理后的数据
          return {
            message: 'XSS protection applied successfully.',
            cleanedData: cleanData
          };
        } catch (error) {
          // 错误处理
          return h.response(error).code(500);
        }
      }
    }
  });

  // 启动服务器
  await server.start();
  console.log('Server running at:', server.info.uri);
};

// 启动初始化函数
init();

// 注意：确保已经安装了xss和hapi-plugin-nue包，并配置好了hapi-plugin-nue插件的白名单和其它选项。