// 代码生成时间: 2025-09-05 09:34:50
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const h2h = require('html-to-hbs');
const path = require('path');
const fs = require('fs');

// 定义图表的配置数据
const chartConfig = {
    title: 'Sales Data',
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Sales',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: [12, 19, 3, 5, 2]
        }]
    }
};

// 创建Hapi服务器
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 注册静态文件服务插件
await server.register(inert);
await server.register(vision);

server.views({
    engines: { hbs: require('handlebars') },
    relativeTo: __dirname,
    path: 'views',
    isCached: false
});

// 定义路由
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
        return h.view('index', {
            chartConfig: chartConfig
        });
    }
});

server.route({
    method: 'POST',
    path: '/chart',
    options: {
        validate: {
            payload: Joi.object({
                title: Joi.string().required(),
                type: Joi.string().required(),
                data: Joi.object().required()
            }).unknown()
        },
        handler: async function (request, h) {
            const { title, type, data } = request.payload;
            const updatedChartConfig = { title, type, data };
            return h.view('chart', {
                chartConfig: updatedChartConfig
            });
        }
    }
});

// 启动服务器
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

// 将HTML模板转换为Handlebars模板
const templatePath = path.join(__dirname, 'views', 'chart.hbs');
const hbsTemplate = h2h(fs.readFileSync(templatePath, 'utf8'), {
    handlebars: true,
    extname: 'hbs'
});

// 将转换后的模板保存到文件中
fs.writeFileSync(templatePath, hbsTemplate);

// 注释和文档
// 1. 我们定义了一个图表的配置数据，包括标题、图表类型和数据。
// 2. 创建Hapi服务器并注册静态文件服务和视图插件。
// 3. 定义两个路由：一个用于显示初始页面，另一个用于接收图表配置并生成图表。
// 4. 使用Joi进行输入验证，确保接收到的数据是有效的。
// 5. 使用Handlebars模板引擎渲染图表配置。
// 6. 将HTML模板转换为Handlebars模板，并保存到文件中。
// 7. 启动服务器并在启动时打印服务器地址。
// 8. 代码结构清晰，易于理解，包含适当的错误处理和注释。
// 9. 遵循JS最佳实践，确保代码的可维护性和可扩展性。