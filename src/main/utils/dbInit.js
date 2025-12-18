const { pool } = require('../config/database');

// 初始化数据库表
async function initDatabase() {
  try {
    const promisePool = pool.promise();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
  }
}

module.exports = {
  initDatabase
};