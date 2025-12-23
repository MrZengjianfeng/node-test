require('dotenv').config({ path: '.env.example' }); // 加载环境变量

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // 安全头部中间件

const app = express();
const PORT = process.env.PORT || 3000;

// 添加安全头部
app.use(helmet());

// Middleware to parse JSON bodies
app.use(express.json());

// 启用CORS
app.use(cors());

// 引入数据清理中间件（主要用于XSS防护）
const { sanitizeBody, sanitizeQuery, sanitizeParams } = require('./src/main/middleware/sanitization');

// 引入SQL注入防护中间件
const { 
  protectBodyFromSqlInjection, 
  protectQueryFromSqlInjection, 
  protectParamsFromSqlInjection 
} = require('./src/main/middleware/sqlProtection');

// 应用SQL注入防护中间件（放在数据清理之前）
app.use(protectBodyFromSqlInjection);
app.use(protectQueryFromSqlInjection);
app.use(protectParamsFromSqlInjection);

// 应用数据清理中间件（主要用于XSS防护）
app.use(sanitizeBody);
app.use(sanitizeQuery);
app.use(sanitizeParams);

// 引入API路由
const apiRouter = require('./src/main/config/routes');

// 注册API路由
app.use('/api', apiRouter);

// 初始化数据库
const { initDatabase, testConnectionPool } = require('./src/main/utils/dbInit');
const { masterPool, slavePool } = require('./src/main/config/database');
initDatabase();

// 定期检查数据库连接池健康状况
setInterval(async () => {
  await testConnectionPool();
}, 30000); // 每30秒检查一次

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
  
  // 显示数据库读写分离状态
  const { isReadWriteSplitEnabled } = require('./src/main/config/database');
  if (isReadWriteSplitEnabled) {
    console.log('Database Read/Write Split: ENABLED');
    console.log(`Master DB: ${process.env.DB_MASTER_HOST || 'default'}`);
    console.log(`Slave DB: ${process.env.DB_SLAVE_HOST || 'default'}`);
  } else {
    console.log('Database Read/Write Split: DISABLED');
  }
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await masterPool.end();
  if (slavePool !== masterPool) {
    await slavePool.end();
  }
  server.close(() => {
    console.log('Process terminated');
  });
});