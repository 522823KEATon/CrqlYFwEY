// 代码生成时间: 2025-08-21 08:37:08
const Hapi = require('@hapi/hapi');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

// 创建Hapi服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  // 定义解压文件的路由
  server.route({
    method: 'POST',
    path: '/unzip',
    handler: async (request, h) => {
      try {
        // 获取上传的文件
        const file = request.payload.file;
        const { filename, destinationPath } = request.payload;

        // 确保上传文件存在
        if (!file) {
          return h.response({
            status: 'error',
            message: 'No file uploaded.',
          }).code(400);
        }

        // 确保目标解压路径存在
        if (!destinationPath) {
          return h.response({
            status: 'error',
            message: 'Destination path is required.',
          }).code(400);
        }

        // 解压文件
        await unzipFile(file, destinationPath);

        // 返回成功响应
        return h.response({
          status: 'success',
          message: 'File unzipped successfully.',
        }).code(200);
      } catch (error) {
        // 错误处理
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

// 解压文件函数
const unzipFile = async (fileBuffer, destinationPath) => {
  // 创建一个可写流到指定目录
  const output = fs.createWriteStream(destinationPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  // 监听错误事件
  archive.on('error', (err) => {
    throw err;
  });

  // 将文件写入流
  archive.pipe(output);
  archive.append(fileBuffer, { name: path.basename(destinationPath) });
  archive.finalize();
};

// 启动应用
init();

// 错误处理中间件
const errorHandler = (err, request, h) => {
  return h.response({
    status: 'error',
    message: err.message,
  }).code(500);
};

module.exports = {
  init,
  errorHandler,
  unzipFile,
};