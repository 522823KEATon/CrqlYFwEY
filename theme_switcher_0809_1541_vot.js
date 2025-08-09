// 代码生成时间: 2025-08-09 15:41:05
const Hapi = require('@hapi/hapi');

// 创建一个新的Hapi服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 存储主题状态的内存存储
const themeStorage = {
    theme: 'light'
};

// 用于设置主题的路由
const setThemeRoute = {
    method: 'POST',
    path: '/theme',
    options: {
        handler: async (request, h) => {
            const { theme } = request.payload;
            if (!theme) {
                return h.response({
                    status: 'error',
                    message: 'Theme parameter is missing'
                }).code(400);
            }
            if (theme !== 'light' && theme !== 'dark') {
                return h.response({
                    status: 'error',
                    message: 'Invalid theme provided'
                }).code(400);
            }
            // 更新主题状态
            themeStorage.theme = theme;
            return {
                status: 'success',
                message: `Theme has been set to ${theme}`,
                currentTheme: theme
            };
        },
        validate: {
            payload: {
                theme: Hapi.schema.string().required()
            },
            failAction: (request, h, error) => {
                return h.response({
                    status: 'error',
                    message: 'Invalid payload',
                    error
                }).code(400);
            }
        }
    }
};

// 用于获取当前主题的路由
const getThemeRoute = {
    method: 'GET',
    path: '/theme',
    options: {
        handler: async (request, h) => {
            return {
                status: 'success',
                message: 'Current theme retrieved successfully',
                currentTheme: themeStorage.theme
            };
        }
    }
};

// 注册路由
async function start() {
    try {
        await server.route([setThemeRoute, getThemeRoute]);
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();

// 导出函数以便在其他模块中使用
module.exports = {
    server,
    themeStorage,
    setThemeRoute,
    getThemeRoute
};