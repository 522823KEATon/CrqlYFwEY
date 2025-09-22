// 代码生成时间: 2025-09-23 00:01:51
const Hapi = require('@hapi/hapi');
const { Pool } = require('pg'); // 使用pg库来连接PostgreSQL

// 配置数据库连接池
const poolConfig = {
  user: 'your_username', // 数据库用户名
  host: 'localhost',     // 数据库主机地址
  database: 'your_database', // 数据库名称
  password: 'your_password', // 数据库密码
  port: 5432,              // 数据库端口
  max: 10,                 // 连接池最大连接数
  idleTimeoutMillis: 30000, // 连接超时时间
  connectionTimeoutMillis: 2000 // 连接建立超时时间
};

// 创建数据库连接池实例
const pool = new Pool(poolConfig);

// HAPI服务器初始化
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

// 启动服务器
async function startServer() {
  try {
    await server.start();
    console.log('Server running on %s', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// 定义一个获取连接的方法
async function getConnection() {
  try {
    return await pool.connect();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// 定义一个释放连接的方法
function releaseConnection(client) {
  client.release();
}

// 定义一个查询数据库的方法
async function queryDatabase(query, params) {
  const client = await getConnection();
  try {
    const res = await client.query(query, params);
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    releaseConnection(client);
  }
}

// 路由: 测试数据库查询
server.route({
  method: 'GET',
  path: '/test-query',
  async handler(request, h) {
    try {
      const query = 'SELECT * FROM your_table'; // 替换为你的查询语句
      const result = await queryDatabase(query);
      return h.response(result.rows).code(200);
    } catch (error) {
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },
});

// 启动服务器
startServer();