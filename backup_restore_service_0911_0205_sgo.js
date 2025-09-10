// 代码生成时间: 2025-09-11 02:05:08
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const archiver = require('archiver');

// 文件备份和恢复服务
class BackupRestoreService {
  // 文件备份
  async backupData(backupPath, dataPath) {
    return new Promise(async (resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });

      try {
        const output = fs.createWriteStream(backupPath);
        await pipeline(
          fs.createReadStream(dataPath),
          archive,
          output
        );
        resolve(`Backup created at ${backupPath}`);
      } catch (error) {
        reject(error);
      }
    });
  }

  // 文件恢复
  async restoreData(backupPath, dataPath) {
    return new Promise(async (resolve, reject) => {
      try {
        const extract = archiver('zip', { zlib: { level: 9 } });
        const output = fs.createWriteStream(dataPath);
        await pipeline(
          fs.createReadStream(backupPath),
          extract,
          output
        );
        resolve(`Data restored at ${dataPath}`);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// 创建Hapi服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  });

  // 路由：备份数据
  server.route({
    method: 'POST',
    path: '/backup',
    handler: async (request, h) => {
      try {
        const backupService = new BackupRestoreService();
        const backupPath = path.join(os.tmpdir(), 'backup.zip');
        const dataPath = request.payload.path;
        await backupService.backupData(backupPath, dataPath);
        return h.response('Backup successful').code(200);
      } catch (error) {
        return h.response('Backup failed').code(500);
      }
    }
  });

  // 路由：恢复数据
  server.route({
    method: 'POST',
    path: '/restore',
    handler: async (request, h) => {
      try {
        const backupService = new BackupRestoreService();
        const backupPath = request.payload.backupPath;
        const dataPath = request.payload.path;
        await backupService.restoreData(backupPath, dataPath);
        return h.response('Restore successful').code(200);
      } catch (error) {
        return h.response('Restore failed').code(500);
      }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();

/*
 * 服务说明：
 * 该服务提供数据备份和恢复功能。
 * 它使用Hapi框架创建RESTful接口，
 * 并通过archiver库实现数据的压缩和解压。
 * 备份数据时，服务将指定路径的数据压缩成zip文件。
 * 恢复数据时，服务将zip文件解压到指定路径。
 * 错误处理：服务在备份和恢复过程中添加了适当的错误处理，
 * 如果操作失败，将返回相应的错误消息和状态码。
 * 可维护性和可扩展性：服务代码结构清晰，易于理解和扩展。
 * 遵循JS最佳实践，包括使用Promise和async/await进行异步编程，
 * 使用try/catch进行错误处理，以及使用注释和文档说明代码功能。
 */