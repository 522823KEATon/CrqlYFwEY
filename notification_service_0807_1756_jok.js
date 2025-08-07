// 代码生成时间: 2025-08-07 17:56:55
const Hapi = require('@hapi/hapi');
const Joi = require('joi');

// 创建Hapi服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// 定义通知资源
const notificationRoutes = ({ notificationsService }) => {
  // 获取通知列表
  const getNotifications = async (request, h) => {
    try {
      const notifications = await notificationsService.getNotifications();
      return h.response(notifications).code(200);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  };

  // 获取单个通知
  const getNotification = async (request, h) => {
    const notificationId = request.params.id;
    try {
      const notification = await notificationsService.getNotification(notificationId);
      return h.response(notification).code(200);
    } catch (error) {
      return Boom.notFound(error);
    }
  };

  // 创建通知
  const createNotification = async (request, h) => {
    const { subject, message } = request.payload;
    try {
      const notification = await notificationsService.createNotification({ subject, message });
      return h.response(notification).code(201);
    } catch (error) {
      return Boom.badImplementation(error);
    }
  };

  // 通知路由配置
  const registerRoutes = (server) => {
    server.route([
      {
        method: 'GET',
        path: '/notifications',
        options: {
          validate: {
            query: Joi.object({
              limit: Joi.number().integer().min(1),
              page: Joi.number().integer().min(1)
            }).unknown()
          },
          handler: getNotifications
        }
      },
      {
        method: 'GET',
        path: '/notifications/{id}',
        options: {
          validate: {
            params: Joi.object({
              id: Joi.string().required()
            }).unknown()
          },
          handler: getNotification
        }
      },
      {
        method: 'POST',
        path: '/notifications',
        options: {
          validate: {
            payload: Joi.object({
              subject: Joi.string().required(),
              message: Joi.string().required()
            }).unknown()
          },
          handler: createNotification
        }
      }
    ]);
  };

  return {
    registerRoutes
  };
};

// 使用依赖注入将notificationsService传递给notificationRoutes
const notificationPlugin = {
  name: 'notifications',
  version: '1.0.0',
  register: async (server, { notificationsService }) => {
    const routes = notificationRoutes({ notificationsService });
    routes.registerRoutes(server);
  },
  dependencies: []
};

// 启动服务器
const start = async () => {
  try {
    await server.register(notificationPlugin);
    await server.start();
    console.log('Server running on %s', server.info.uri);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
