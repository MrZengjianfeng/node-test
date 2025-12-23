const mysql = require("mysql2/promise");

// 根据环境变量确定数据库配置
const isReadWriteSplitEnabled = process.env.DB_READ_WRITE_SPLIT === "true";

let masterPool, slavePool;

console.log('isReadWriteSplitEnabled:',isReadWriteSplitEnabled)
console.log('process.env.DB_MASTER_HOST:',process.env.DB_MASTER_HOST)
console.log('process.env.DB_MASTER_PORT:',process.env.DB_MASTER_PORT)
console.log('process.env.DB_MASTER_USER:',process.env.DB_MASTER_USER)

if (isReadWriteSplitEnabled) {
  // 主库配置（用于写操作）
  masterPool = mysql.createPool({
    host: process.env.DB_MASTER_HOST,
    port: process.env.DB_MASTER_PORT,
    user: process.env.DB_MASTER_USER,
    password: process.env.DB_MASTER_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.DB_MASTER_CONNECTION_LIMIT || 10,
    queueLimit: 10,
    acquireTimeout: 60000,
    connectTimeout: 30000,
    timeout: 60000,
    idleTimeout: 60000,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
    resetAfterUse: true,
  });

  // 从库配置（用于读操作）
  slavePool = mysql.createPool({
    host: process.env.DB_SLAVE_HOST,
    port: process.env.DB_SLAVE_PORT,
    user: process.env.DB_SLAVE_USER,
    password: process.env.DB_SLAVE_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.DB_SLAVE_CONNECTION_LIMIT || 10,
    queueLimit: 10,
    acquireTimeout: 60000,
    connectTimeout: 30000,
    timeout: 60000,
    idleTimeout: 60000,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
    resetAfterUse: true,
  });
} else {
  // 单数据库配置
  masterPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10,
    acquireTimeout: 60000,
    connectTimeout: 30000,
    timeout: 60000,
    idleTimeout: 60000,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
    resetAfterUse: true,
  });

  // 如果未启用读写分离，则slavePool指向masterPool
  slavePool = masterPool;
}

// 监听连接事件
masterPool.on("connection", (connection) => {
  console.log("Master Database Connection established");
});

masterPool.on("release", (connection) => {
  console.log("Master Connection %d released", connection.threadId);
});

slavePool.on("connection", (connection) => {
  console.log("Slave Database Connection established");
});

slavePool.on("release", (connection) => {
  console.log("Slave Connection %d released", connection.threadId);
});

masterPool.on("error", (err) => {
  console.error("Master Database pool error:", err);
});

slavePool.on("error", (err) => {
  console.error("Slave Database pool error:", err);
});

module.exports = {
  masterPool,
  slavePool,
  isReadWriteSplitEnabled,
};
