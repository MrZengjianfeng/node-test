const { masterPool, slavePool } = require("../config/database");

// 初始化数据库表
async function initDatabase() {
  let connection;
  try {
    // 获取主库连接并执行查询
    connection = await masterPool.getConnection();
    const [rows] = await connection.query("SELECT 1");
    if (rows.length > 0) {
      console.log("主数据库初始化成功");
    } else {
      console.log("主数据库初始化失败");
    }
  } catch (error) {
    console.error("初始化主数据库失败:", error.message);
  } finally {
    if (connection) connection.release();
  }

  // 如果启用了读写分离，测试从库连接
  if (slavePool !== masterPool) {
    try {
      connection = await slavePool.getConnection();
      const [rows] = await connection.query("SELECT 1");
      if (rows.length > 0) {
        console.log("从数据库初始化成功");
      } else {
        console.log("从数据库初始化失败");
      }
    } catch (error) {
      console.error("初始化从数据库失败:", error.message);
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
    console.log("主数据库连接池运行正常");
  } catch (error) {
    console.error(
      "主数据库连接池运行状况检查失败:",
      error.message
    );
  } finally {
    if (connection) connection.release();
  }

  // 如果启用了读写分离，测试从库连接池
  if (slavePool !== masterPool) {
    try {
      connection = await slavePool.getConnection();
      await connection.ping();
      console.log("从数据库连接池运行正常");
    } catch (error) {
      console.error(
        "从数据库连接池健康检查失败:",
        error.message
      );
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = {
  initDatabase,
  testConnectionPool,
};
