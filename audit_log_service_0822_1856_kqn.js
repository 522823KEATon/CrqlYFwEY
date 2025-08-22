// 代码生成时间: 2025-08-22 18:56:32
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// 日志记录器配置
const logFilePath = path.join(__dirname, 'audit_logs.json');

// 定义日志存储结构
let auditLogs = [];

// 读取现有的日志文件
try {
    const rawLogs = fs.readFileSync(logFilePath);
    auditLogs = JSON.parse(rawLogs);
} catch (error) {
    // 如果文件不存在，则初始化空数组
    fs.writeFileSync(logFilePath, JSON.stringify([]));
}

// 定义HAPI服务器
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 日志记录方法
const logEvent = async (event) => {
    // 添加时间戳
    event.timestamp = moment().format();
    auditLogs.push(event);
    fs.writeFileSync(logFilePath, JSON.stringify(auditLogs));
};

// 安全审计日志接口
server.route({
    method: 'POST',
    path: '/log',
    options: {
        validate: {
            payload: Joi.object({
                action: Joi.string().required(),
                user: Joi.string().required(),
                context: Joi.object().required()
            })
        }
    },
    handler: async (request, h) => {
        try {
            // 记录事件到日志文件
            await logEvent(request.payload);
            // 返回成功响应
            return h.response({
                message: 'Event logged successfully'
            }).code(200);
        } catch (error) {
            // 错误处理
            return h.response({
                message: 'Error logging event',
                error: error.message
            }).code(500);
        }
    }
});

// 启动服务器
async function start() {
    await server.start();
    console.log('Server running at:', server.info.uri);
}

start().catch(err => {
    console.error('Failed to start server:', err);
});
