const { masterPool, slavePool } = require('../config/database');

// 初始化数据库表
async function initDatabase() {
  let connection;
  try {
    // 获取主库连接并执行查询
    connection = await masterPool.getConnection();
    const [rows] = await connection.query('SELECT 1');
    console.log('Master database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize master database:', error.message);
  } finally {
    if (connection) connection.release();
  }
  
  // 如果启用了读写分离，测试从库连接
  if (slavePool !== masterPool) {
    try {
      connection = await slavePool.getConnection();
      const [rows] = await connection.query('SELECT 1');
      console.log('Slave database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize slave database:', error.message);
    } finally {
      if (connection) connection.release();
    }
  }
}

// 测试连接池健康状况
async function testConnectionPool() {
  let connection;
  try {
    connection = await masterPool.getConnection();
    await connection.ping();
    console.log('Master database connection pool is healthy');
  } catch (error) {
    console.error('Master database connection pool health check failed:', error.message);
  } finally {
    if (connection) connection.release();
  }
  
  // 如果启用了读写分离，测试从库连接池
  if (slavePool !== masterPool) {
    try {
      connection = await slavePool.getConnection();
      await connection.ping();
      console.log('Slave database connection pool is healthy');
    } catch (error) {
      console.error('Slave database connection pool health check failed:', error.message);
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = {
  initDatabase,
  testConnectionPool
};