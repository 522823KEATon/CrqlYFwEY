// 代码生成时间: 2025-09-07 17:07:50
// restful_api_example.js
// 使用Hapi框架创建RESTful API接口的示例程序

const Hapi = require('@hapi/hapi');

// 创建一个新的Hapi服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// 定义一个简单的数据模型
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' }
];

// 获取用户的路由
server.route({
  method: 'GET',
  path: '/users',
  handler: async (request, h) => {
    try {
      // 返回用户列表
      return users;
    } catch (error) {
      // 错误处理
      return h.response(error).code(500);
    }
  }
});

// 获取单个用户的路由
server.route({
  method: 'GET',
  path: '/users/{id}',
  handler: async (request, h) => {
    try {
      // 根据id查找用户
      const user = users.find(u => u.id === parseInt(request.params.id));
      if (!user) {
        return h.response({ message: 'User not found' }).code(404);
      }
      return user;
    } catch (error) {
      // 错误处理
      return h.response(error).code(500);
    }
  }
});

// 添加用户
server.route({
  method: 'POST',
  path: '/users',
  handler: async (request, h) => {
    try {
      // 将新用户添加到列表中
      const newUser = request.payload;
      users.push(newUser);
      return h.response(newUser).code(201);
    } catch (error) {
      // 错误处理
      return h.response(error).code(500);
    }
  }
});

// 更新用户
server.route({
  method: 'PUT',
  path: '/users/{id}',
  handler: async (request, h) => {
    try {
      // 根据id更新用户信息
      const userIndex = users.findIndex(u => u.id === parseInt(request.params.id));
      if (userIndex < 0) {
        return h.response({ message: 'User not found' }).code(404);
      }
      users[userIndex] = request.payload;
      return h.response(users[userIndex]).code(200);
    } catch (error) {
      // 错误处理
      return h.response(error).code(500);
    }
  }
});

// 删除用户
server.route({
  method: 'DELETE',
  path: '/users/{id}',
  handler: async (request, h) => {
    try {
      // 根据id删除用户
      const userIndex = users.findIndex(u => u.id === parseInt(request.params.id));
      if (userIndex < 0) {
        return h.response({ message: 'User not found' }).code(404);
      }
      users.splice(userIndex, 1);
      return h.response({ message: 'User deleted' }).code(200);
    } catch (error) {
      // 错误处理
      return h.response(error).code(500);
    }
  }
});

// 启动服务器
async function start() {
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

start();