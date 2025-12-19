const { pool } = require('../config/database');

// 初始化数据库表
async function initDatabase() {
  let connection;
  try {
    // 获取连接并执行查询
    connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1');
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
  } finally {
    if (connection) connection.release();
  }
}

// 测试连接池健康状况
async function testConnectionPool() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log('Database connection pool is healthy');
    return true;
  } catch (error) {
    console.error('Database connection pool health check failed:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  initDatabase,
  testConnectionPool
};