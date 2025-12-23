const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:8080'
  ], // 从环境变量获取允许的来源，或使用默认值
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'X-HTTP-Method-Override'
  ],
  credentials: true, // 允许携带认证信息
  optionsSuccessStatus: 200 // 设置预检请求的成功状态码
};

module.exports = {
  corsMiddleware: cors(corsOptions),
  corsOptions
};