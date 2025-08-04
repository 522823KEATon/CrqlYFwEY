// 代码生成时间: 2025-08-04 10:43:18
// 使用Hapi框架创建一个简单的服务来防止SQL注入
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// 数据库模拟，实际应用中应替换为真实的数据库连接
const users = [
  { id: 1, username: 'john', password: 'password123' },
  { id: 2, username: 'jane', password: 'abc123' }
];

// 验证输入的schema
const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

// 处理登录请求的函数，防止SQL注入
const login = async (request, h) => {
  const { username, password } = request.payload;

  try {
    // 使用Hapi的Joi验证库来验证输入
    await userSchema.validateAsync({ username, password });

    // 查找用户，这里使用数组查找代替数据库查询，以防止SQL注入
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    return { success: true, message: 'Login successful', user: { id: user.id, username: user.username } };
  } catch (error) {
    // 错误处理
    return { success: false, message: error.details[0].message };
  }
};

// 路由配置
const registerRoutes = async () => {
  server.route({
    method: 'POST',
    path: '/login',
    options: {
      validate: {
        payload: userSchema,
        failAction: async (request, h, error) => {
          // 在验证失败时执行的操作
          throw error;
        },
      },
    },
    handler: login,
  });
};

// 启动服务器
const start = async () => {
  await registerRoutes();
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

start();