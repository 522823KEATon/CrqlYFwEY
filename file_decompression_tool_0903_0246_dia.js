// 代码生成时间: 2025-09-03 02:46:08
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper'); // 引入unzipper库进行文件解压

// 创建Hapi服务
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 路由处理压缩文件上传和解压
  server.route({
    method: 'POST',
    path: '/decompress',
    handler: async (request, h) => {
      try {
        // 获取上传的文件
        const file = request.payload.file;

        // 检查文件是否存在
        if (!file) {
          return {
            status: 'error',
            message: 'No file uploaded'
          };
        }

        // 创建一个临时文件夹存放解压的文件
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }

        // 定义解压文件的目标路径
        const targetPath = path.join(tempDir, 'extracted');
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath);
        }

        // 使用unzipper解压文件
        await file.pipe(unzipper.Extract({ path: targetPath }));

        // 返回解压成功的信息和解压后的文件路径
        return {
          status: 'success',
          message: 'File decompressed successfully',
          extractedPath: targetPath
        };
      } catch (error) {
        // 错误处理
        return {
          status: 'error',
          message: error.message
        };
      }
    }
  });

  // 启动服务器
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 使程序在启动时执行初始化函数
init();
