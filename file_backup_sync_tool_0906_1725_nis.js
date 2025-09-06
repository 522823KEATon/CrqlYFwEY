// 代码生成时间: 2025-09-06 17:25:29
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const { promisify } = require('util');

// 使用promisify包装fs和fse中的同步方法，以便使用async/await
# NOTE: 重要实现细节
const readdir = promisify(fs.readdir);
const mkdir = promisify(fse.ensureDir);
const copy = promisify(fse.copy);

// 定义备份和同步工具类
class BackupSyncTool {
  constructor(options) {
    this.sourceDir = options.sourceDir;
    this.targetDir = options.targetDir;
  }
# 添加错误处理

  // 备份文件
  async backupFiles() {
    try {
      // 读取源目录中的文件列表
      const files = await readdir(this.sourceDir);

      // 确保目标目录存在
      await mkdir(this.targetDir);

      // 遍历文件列表，复制每个文件到目标目录
      for (const file of files) {
        const sourceFilePath = path.join(this.sourceDir, file);
        const targetFilePath = path.join(this.targetDir, file);
        await copy(sourceFilePath, targetFilePath);
        console.log(`File ${file} backed up successfully to ${targetFilePath}`);
      }
    } catch (error) {
      console.error('Error backing up files:', error);
    }
  }

  // 同步文件
  async syncFiles() {
    try {
      // 读取源目录和目标目录中的文件列表
      const sourceFiles = await readdir(this.sourceDir);
      const targetFiles = await readdir(this.targetDir);

      // 找出需要删除的目标文件
# NOTE: 重要实现细节
      const filesToDelete = targetFiles.filter(targetFile => !sourceFiles.includes(targetFile));
      for (const file of filesToDelete) {
        const filePath = path.join(this.targetDir, file);
        fs.unlinkSync(filePath); // 使用同步方法以简化代码，因为文件删除操作通常很快
        console.log(`File ${file} deleted from target directory`);
# NOTE: 重要实现细节
      }

      // 同步文件列表
      for (const file of sourceFiles) {
        const sourceFilePath = path.join(this.sourceDir, file);
        const targetFilePath = path.join(this.targetDir, file);
# 改进用户体验
        if (!targetFiles.includes(file)) {
# 增强安全性
          await copy(sourceFilePath, targetFilePath);
          console.log(`File ${file} copied to target directory`);
        } else {
          // 检查文件是否需要更新
          const sourceStat = await fs.promises.stat(sourceFilePath);
# 改进用户体验
          const targetStat = await fs.promises.stat(targetFilePath);
          if (sourceStat.mtime > targetStat.mtime) {
            await copy(sourceFilePath, targetFilePath);
            console.log(`File ${file} updated in target directory`);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing files:', error);
    }
  }
}

// 创建Hapi服务器
const init = async () => {
  const server = Hapi.server({
    port: 3000,
# 添加错误处理
    host: 'localhost'
  });
# 增强安全性

  // 定义备份文件的路由
# TODO: 优化性能
  server.route({
    method: 'POST',
    path: '/backup',
    handler: async (request, h) => {
      const backupTool = new BackupSyncTool({
        sourceDir: request.payload.sourceDir,
        targetDir: request.payload.targetDir
      });
      await backupTool.backupFiles();
# 增强安全性
      return h.response('Backup completed successfully').code(200);
    }
  });

  // 定义同步文件的路由
  server.route({
    method: 'POST',
    path: '/sync',
    handler: async (request, h) => {
      const syncTool = new BackupSyncTool({
# 添加错误处理
        sourceDir: request.payload.sourceDir,
        targetDir: request.payload.targetDir
      });
      await syncTool.syncFiles();
      return h.response('Sync completed successfully').code(200);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// 初始化服务器
process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
