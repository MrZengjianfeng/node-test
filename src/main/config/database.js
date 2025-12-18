const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
  host: '120.26.113.14',
  port: 3306, // 明确指定 MySQL 默认端口
  user: 'root',
  password: '123456',
  database: 'test', // 如果有特定的数据库名，请修改此处
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  pool
};