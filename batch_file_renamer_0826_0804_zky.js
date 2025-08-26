// 代码生成时间: 2025-08-26 08:04:12
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// 将 fs.rename 转换为返回 Promise 的版本
const rename = promisify(fs.rename);

// 创建 Hapi 服务器
const init = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
  });

  // 定义 POST 路由以接收重命名请求
  server.route({
    method: 'POST',
    path: '/rename-files',
    handler: async (request, h) => {
      try {
        const { files } = request.payload;
        if (!Array.isArray(files) || files.length === 0) {
          return h.response({
            status: 'error',
            message: 'No files provided for renaming',
          }).code(400);
        }

        const renames = await Promise.all(files.map(async (file) => {
          const { oldPath, newPath } = file;
          const oldFilePath = path.join(request.payload.baseDir, oldPath);
          const newFilePath = path.join(request.payload.baseDir, newPath);

          try {
            await rename(oldFilePath, newFilePath);
            return {
              original: oldPath,
              renamed: newPath,
              status: 'success',
            };
          } catch (error) {
            return {
              original: oldPath,
              renamed: newPath,
              status: 'error',
              message: error.message,
            };
          }
        }));

        return {
          status: 'success',
          renames,
        };
      } catch (error) {
        return h.response({
          status: 'error',
          message: error.message,
        }).code(500);
      }
    },
  });

  // 启动服务器
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 初始化服务器
init();

// 模块导出，以便可以在其他文件中使用
module.exports = {
  init,
};
