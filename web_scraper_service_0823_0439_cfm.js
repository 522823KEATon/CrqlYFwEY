// 代码生成时间: 2025-08-23 04:39:03
const Hapi = require('@hapi/hapi');
const axios = require('axios');
const cheerio = require('cheerio');

// 定义网页内容抓取服务
class WebScraperService {
    // 构造函数
    constructor() {
        this.server = Hapi.server({
            port: 3000,
            host: 'localhost'
        });
    }

    // 启动服务器
    async start() {
        await this.server.start();
        console.log('Server running at:', this.server.info.uri);
    }

    // 定义抓取网页内容的路由
    async registerRoutes() {
        this.server.route({
            method: 'GET',
            path: '/scrap',
            handler: async (request, h) => {
                const url = request.query.url;
                if (!url) {
                    return h.response('URL is required').code(400);
                }

                try {
                    // 发送HTTP请求获取网页内容
                    const response = await axios.get(url);
                    const html = response.data;
                    // 使用Cheerio解析网页内容
                    const $ = cheerio.load(html);
                    // 抓取需要的内容，这里以标题为例
                    const title = $('title').text();
                    return h.response({
                        title: title
                    }).code(200);
                } catch (error) {
                    // 错误处理
                    if (error.response) {
                        // 服务器响应了请求，但返回了错误状态码
                        return h.response('Failed to fetch webpage').code(error.response.status);
                    } else if (error.request) {
                        // 服务器没有响应请求
                        return h.response('No response from server').code(500);
                    } else {
                        // 发生了其他错误
                        return h.response('An error occurred').code(500);
                    }
                }
            }
        });
    }
}

// 创建WebScraperService实例
const webScraperService = new WebScraperService();

// 注册路由
webScraperService.registerRoutes();

// 启动服务
webScraperService.start();

// 文档说明：
// 本服务使用Hapi框架创建了一个简单的网页内容抓取工具。
// 它提供了一个GET路由'/scrap'，用户可以传递一个URL参数，服务将抓取该网页的标题并返回。
// 使用axios库发送HTTP请求，cheerio库解析HTML内容。
// 服务的错误处理涵盖了请求失败、服务器无响应等常见情况。