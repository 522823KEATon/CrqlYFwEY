// 代码生成时间: 2025-08-15 16:08:06
const Hapi = require('@hapi/hapi');
const Joi = require('joi');

// 创建服务器
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 定义图表数据的模式
const chartDataSchema = Joi.object({
    labels: Joi.array().items(Joi.string()).required(),
    datasets: Joi.array().items(Joi.object({
        label: Joi.string().required(),
        data: Joi.array().items(Joi.number()).required()
    })).required()
});

// 路由处理函数，用于生成图表
const generateChart = async (request, h) => {
    try {
        // 验证请求体
        const { payload } = request;
        await chartDataSchema.validateAsync(payload);

        // 模拟图表生成
        // 在实际应用中，这里可以使用图表库（如Chart.js）来生成图表
        const chart = {
            title: 'Interactive Chart',
            type: 'bar',
            data: {
                labels: payload.labels,
                datasets: payload.datasets
            }
        };

        // 返回图表的URL
        // 在实际应用中，URL将指向实际生成的图表图片或SVG
        return h.response({
            message: 'Chart generated successfully',
            chartUrl: 'chart.png'
        }).code(200);
    } catch (error) {
        // 错误处理
        return h.response({
            message: error.message,
            statusCode: error.statusCode || 400
        }).code(400);
    }
};

// 注册路由
server.route({
    method: 'POST',
    path: '/generate-chart',
    options: {
        validate: {
            payload: chartDataSchema
        },
        handler: generateChart
    }
});

// 启动服务器
async function start() {
    await server.start();
    console.log('Server running at:', server.info.uri);
}

start();

// 添加模块导出，以便可以在其他文件中使用
module.exports = {
    server,
    start
};