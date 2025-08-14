// 代码生成时间: 2025-08-14 20:19:12
const Hapi = require('@hapi/hapi');
const Crypto = require('crypto');

// 创建一个新的Hapi服务器实例
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// 用户界面路由，用于接收加密和解密请求
const registerRoutes = () => {
  server.route([
    {
      method: 'POST',
      path: '/encrypt',
      handler: async (request, h) => {
        const { password } = request.payload;
        if (!password) {
          return h.response({ status: 'error', message: 'Password is required' }).code(400);
        }
        try {
          const encrypted = await encryptPassword(password);
          return h.response({ status: 'success', encrypted: encrypted }).code(200);
        } catch (error) {
          return h.response({ status: 'error', message: error.message }).code(500);
        }
      }
    },
    {
      method: 'POST',
      path: '/decrypt',
      handler: async (request, h) => {
        const { password, key } = request.payload;
        if (!password || !key) {
          return h.response({ status: 'error', message: 'Password and key are required' }).code(400);
        }
        try {
          const decrypted = await decryptPassword(password, key);
          return h.response({ status: 'success', decrypted: decrypted }).code(200);
        } catch (error) {
          return h.response({ status: 'error', message: error.message }).code(500);
        }
      }
    }
  ]);
};

// 使用Crypto库的AES算法进行密码加密
const encryptPassword = async (password) => {
  const key = Crypto.randomBytes(16); // AES-256位密钥
  const iv = Crypto.randomBytes(16); // 初始化向量
  const cipher = Crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${encrypted}:${iv.toString('hex')}:${key.toString('hex')}`;
};

// 使用Crypto库的AES算法进行密码解密
const decryptPassword = async (password, key) => {
  const [encrypted, iv, secretKey] = password.split(':');
  const decipher = Crypto.createDecipher('aes-256-cbc', Buffer.from(secretKey, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// 启动服务器
const start = async () => {
  await server.register({
    plugin: require('./routes')
  });
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

start()
  .then(() => {
    registerRoutes();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
