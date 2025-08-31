// 代码生成时间: 2025-08-31 08:03:58
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// 错误日志收集器配置
const logDirectory = path.join(__dirname, 'logs');

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// 创建Hapi服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 定义错误处理中间件
    server.ext('onError', (request, h, err) => {
        // 记录错误日志
        logError(request, err);
        return h.continue;
    });

    // 定义一个简单的路由来触发错误
    server.route({
        method: 'GET',
        path: '/error',
        handler: () => {
            throw new Error('故意触发的错误');
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// 记录错误日志到文件
function logError(request, error) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const errorDetails = {
        timestamp: timestamp,
        method: request.method,
        url: request.url.path,
        statusCode: error.output.statusCode,
        error: error.message
    };

    // 写入日志文件
    const logFilePath = path.join(logDirectory, `error-log-${new Date().getFullYear()}-${new Date().getMonth() + 1}.log`);
    const logEntry = `${JSON.stringify(errorDetails)}
`;
    fs.appendFileSync(logFilePath, logEntry);
}

// 启动服务器
init();

// 代码注释：
// 这段代码实现了一个简单的Hapi服务器，它包含一个用于触发错误的路由。
// 通过服务器的中间件，我们实现了错误日志的收集功能。
// 错误日志被记录到指定目录下的文件中，文件名包含年份和月份。
// 每个错误日志条目包含时间戳、请求方法、请求路径、状态码和错误信息。
// 该程序遵循JS最佳实践，具有良好的可维护性和可扩展性。