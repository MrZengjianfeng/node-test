const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: '120.26.113.17',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'test', // 如果有特定的数据库名，请修改此处
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000, // 60秒获取连接超时
  connectTimeout: 30000, // 30秒连接超时
  timeout: 60000, // 60秒查询超时
  idleTimeout: 60000, // 60秒空闲连接超时
  keepAliveInitialDelay: 10000, // 10秒后发送keep-alive包
  enableKeepAlive: true, // 启用TCP keep-alive
  resetAfterUse: true // 使用后重置连接
});

// 测试连接池
pool.on('connection', (connection) => {
  console.log('Database Connection established');
});

pool.on('release', (connection) => {
  console.log('Connection %d released', connection.threadId);
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = {
  pool
};