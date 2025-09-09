// 代码生成时间: 2025-09-09 14:11:53
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');

// 创建Hapi服务器
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 定义CSV处理器函数
const processCSV = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        // 检查文件是否存在
        fs.stat(csvFilePath, (err, stats) => {
            if (err) {
                reject('CSV file not found.');
                return;
            }

            // 读取CSV文件并处理数据
            const result = [];
            const readStream = fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => result.push(data))
                .on('end', () => resolve(result))
                .on('error', (error) => reject(error));
        });
    });
};

// 创建一个处理CSV文件的Hapi路由
server.route({
    method: 'POST',
    path: '/process-csv',
    handler: async (request, h) => {
        try {
            const { csvFilePath } = request.payload;
            const processedData = await processCSV(csvFilePath);
            return h.response(processedData).code(200);
        } catch (error) {
            return h.response(error.message).code(500);
        }
    }
});

// 启动Hapi服务器
async function start() {
    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();