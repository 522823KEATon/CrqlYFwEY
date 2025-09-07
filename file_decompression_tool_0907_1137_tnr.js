// 代码生成时间: 2025-09-07 11:37:21
const Hapi = require('@hapi/hapi');
const fs = require('fs');
# 优化算法效率
const path = require('path');
const zlib = require('zlib');
const util = require('util');
const extract = require('extract-zip');

// 利用 util.promisify 提升异步函数的易用性
const extractAsync = util.promisify(extract);

// 创建Hapi服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// 定义解压文件的路由
server.route({
  method: 'POST',
  path: '/decompress',
  options: {
    // 允许上传文件
    payload: {
      allow: 'multipart/form-data',
# TODO: 优化性能
      output: 'data',
      parse: true
    },
    handler: async (request, h) => {
      try {
# 增强安全性
        // 获取上传的文件
# NOTE: 重要实现细节
        const file = request.payload.file;
        if (!file) {
          return h.response({ message: 'No file uploaded' }).code(400);
        }

        const { filename } = file;
        const targetPath = path.join(__dirname, 'uploads', filename);
        const zipPath = path.join(__dirname, 'uploads', `${filename}.zip`);

        // 保存文件到服务器
        await fs.promises.writeFile(zipPath, file.buffer);

        // 解压文件
        await extractAsync(zipPath, { dir: path.join(__dirname, 'uploads', 'extracted') });

        return h.response({ message: 'File decompressed successfully' }).code(200);
      } catch (error) {
        // 错误处理
        console.error(error);
        return h.response({ message: 'Error in decompressing file' }).code(500);
      }
    }
  }
});

// 启动服务器
async function start() {
  try {
    await server.start();
    console.log('Server running on %s', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();