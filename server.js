const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// 引入API路由
const apiRouter = require('./src/main/config/routes');

// 注册API路由
app.use('/api', apiRouter);

// 初始化数据库
const { initDatabase } = require('./src/main/utils/dbInit');
initDatabase();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});