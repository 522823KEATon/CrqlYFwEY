// 代码生成时间: 2025-08-11 20:28:45
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');

// 定义一个函数，用于批量重命名文件
const batchRenameFiles = async (payload) => {
    // 获取文件重命名配置
    const { directory, mapping } = payload;
    const fullPath = path.resolve(directory);

    // 检查目录是否存在
    if (!fs.existsSync(fullPath)) {
        throw new Error('Directory does not exist.');
    }

    // 遍历映射关系，重命名文件
    for (let [oldName, newName] of Object.entries(mapping)) {
        const oldFilePath = path.join(fullPath, oldName);
        const newFilePath = path.join(fullPath, newName);

        // 检查旧文件是否存在
        if (!fs.existsSync(oldFilePath)) {
            continue; // 如果旧文件不存在，跳过
        }

        try {
            // 重命名文件
            await fs.promises.rename(oldFilePath, newFilePath);
            console.log(`Renamed: ${oldName} -> ${newName}`);
        } catch (error) {
            console.error(`Failed to rename ${oldName} to ${newName}: ${error.message}`);
        }
    }
};

// 创建Hapi服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    // 配置路由，用于处理文件重命名请求
    server.route({
        method: 'POST',
        path: '/rename-files',
        handler: async (request, h) => {
            try {
                const payload = request.payload;
                await batchRenameFiles(payload);
                return { status: 'success', message: 'Files renamed successfully.' };
            } catch (error) {
                return { status: 'error', message: error.message };
            }
        },
    });

    // 启动服务器
    await server.start();
    console.log('Server running at:', server.info.uri);
};

// 导出初始化函数
module.exports = { init };

// 使用说明文档
/*
 * Batch File Renamer API Documentation
 *
 * POST /rename-files
 * Payload:
 * {
 *   "directory": "/path/to/directory",
 *   "mapping": {
 *     "old-file-name1.txt": "new-file-name1.txt",
 *     "old-file-name2.txt": "new-file-name2.txt"
 *   }
 * }
 *
 * The API will rename the specified files in the given directory according to the mapping provided.
 *
 * Errors are returned as JSON responses with a status of 'error' and a message property containing the error message.
 *
 * Example Response:
 * {
 *   "status": "success",
 *   "message": "Files renamed successfully."
 * }
 *
 * {
 *   "status": "error",
 *   "message": "Directory does not exist."
 * }
 */