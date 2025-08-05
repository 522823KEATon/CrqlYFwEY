// 代码生成时间: 2025-08-05 15:27:03
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const CryptoJS = require('crypto-js');

// 创建一个新的 HAPI 服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 定义路由处理函数
const routes = [
    {
        method: 'POST',
        path: '/encrypt',
        handler: async (request, h) => {
            try {
                const { password } = request.payload;
                const encrypted = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
                return {
                    status: 'success',
                    encryptedPassword: encrypted
                };
            } catch (error) {
                return {
                    status: 'error',
                    message: error.message
                };
            }
        }
    },
    {
        method: 'POST',
        path: '/decrypt',
        handler: async (request, h) => {
            try {
                const { password } = request.payload;
                const decrypted = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
                return {
                    status: 'success',
                    decryptedPassword: decrypted
                };
            } catch (error) {
                return {
                    status: 'error',
                    message: error.message
                };
            }
        }
    }
];

// 注册路由
server.route(routes);

// 启动服务器
async function start() {
    await server.start();
    console.log('Server running on %s', server.info.uri);
}

start().catch(err => {
    console.error(err);
    process.exit(1);
});

// 密码加密解密模块
const passwordUtils = {
    // 加密密码
    encrypt: (password, secretKey) => {
        return CryptoJS.AES.encrypt(password, secretKey).toString();
    },
    // 解密密码
    decrypt: (password, secretKey) => {
        return CryptoJS.AES.decrypt(password, secretKey).toString(CryptoJS.enc.Utf8);
    }
};

// 导出密码加密解密模块
module.exports = passwordUtils;