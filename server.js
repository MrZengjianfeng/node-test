require('dotenv').config({ path: '.env.example' }); // 加载环境变量

const express = require('express');
const helmet = require('helmet'); // 安全头部中间件

const app = express();
const PORT = process.env.PORT || 3000;

// 添加安全头部
app.use(helmet());

// Middleware to parse JSON bodies
app.use(express.json());

// 启用CORS
const { corsMiddleware } = require('./src/main/config/cors');
app.use(corsMiddleware);

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
  console.log(`服务器在端口上运行 ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 在浏览器中`);
  
  // 显示数据库读写分离状态
  const { isReadWriteSplitEnabled } = require('./src/main/config/database');
  if (isReadWriteSplitEnabled) {
    console.log('数据库读写分离：启用');
    console.log(`主数据库: ${process.env.DB_MASTER_HOST || '默认的'}`);
    console.log(`从数据库：: ${process.env.DB_SLAVE_HOST || '默认的'}`);
  } else {
    console.log('数据库读写分离：关闭');
  }
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('优雅地关机...');
  await masterPool.end();
  if (slavePool !== masterPool) {
    await slavePool.end();
  }
  server.close(() => {
    console.log('进程终止');
  });
});