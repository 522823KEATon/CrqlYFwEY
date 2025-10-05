// 代码生成时间: 2025-10-05 22:28:41
const Hapi = require('@hapi/hapi');

// 创建HTTP/2服务器
async function createHttp2Server() {
    const init = {
        listener: {
            host: 'localhost',
            port: 3000,
            protocol: 'https',
            routes: {
                cors: {
                    origin: ['*']
                }
            }
        },
        // 使用HTTPS协议，需要提供证书
       tls: {
            key: fs.readFileSync('path/to/your/key.pem'),
            cert: fs.readFileSync('path/to/your/cert.pem')
        }
    };

    const server = Hapi.server(init);

    // 定义路由
    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            return 'Welcome to the HTTP/2 Server';
        }
    });

    try {
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// 启动服务器
createHttp2Server();

/*
 * HTTP/2服务器
 * 使用Hapi框架创建一个支持HTTP/2协议的服务器
 * 需要提供HTTPS证书
 * 服务器监听localhost的3000端口
 * 提供一个简单的GET路由来返回欢迎信息
 */