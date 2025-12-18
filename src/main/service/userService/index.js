const { pool } = require('../../config/database');

class UserService {
  // 获取用户列表
  async getUserList() {
    try {
      const promisePool = pool.promise();
      const [rows] = await promisePool.query('SELECT * FROM users');
      return rows;
    } catch (error) {
      throw new Error('Failed to fetch user list: ' + error.message);
    }
  }

  // 分页获取用户列表
  async getUserListPage(page = 1, size = 10) {
    try {
      const promisePool = pool.promise();
      const offset = (page - 1) * size;
      const [rows] = await promisePool.query(
        'SELECT * FROM users LIMIT ? OFFSET ?', 
        [size, offset]
      );
      
      const [[countResult]] = await promisePool.query('SELECT COUNT(*) as total FROM users');
      
      return {
        list: rows,
        total: countResult.total,
        page: page,
        size: size
      };
    } catch (error) {
      throw new Error('Failed to fetch user list with pagination: ' + error.message);
    }
  }

  // 根据账单状态分组用户
  async getUsersGroupedByBillStatus() {
    try {
      const promisePool = pool.promise();
      const [pending] = await promisePool.query(
        'SELECT id, name, bill_amount as billAmount FROM users WHERE bill_status = ?', 
        ['pending']
      );
      
      const [paid] = await promisePool.query(
        'SELECT id, name, bill_amount as billAmount FROM users WHERE bill_status = ?', 
        ['paid']
      );
      
      const [overdue] = await promisePool.query(
        'SELECT id, name, bill_amount as billAmount FROM users WHERE bill_status = ?', 
        ['overdue']
      );
      
      return {
        pending,
        paid,
        overdue
      };
    } catch (error) {
      throw new Error('Failed to fetch user groups: ' + error.message);
    }
  }
  
  // 保存用户信息
  async saveUser(userData) {
    try {
      const promisePool = pool.promise();
      const { name, email, bill_amount, bill_status } = userData;
      
      const [result] = await promisePool.query(
        'INSERT INTO users (name, email, bill_amount, bill_status) VALUES (?, ?, ?, ?)',
        [name, email, bill_amount, bill_status]
      );
      
      return result;
    } catch (error) {
      throw new Error('Failed to save user: ' + error.message);
    }
  }
}

module.exports = new UserService();