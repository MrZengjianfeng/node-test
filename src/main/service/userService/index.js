const { pool } = require('../../config/database');

class UserService {
  // 获取用户列表
  async getUserList() {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM user');
      return rows;
    } catch (error) {
      throw new Error('Failed to fetch user list: ' + error.message);
    } finally {
      if (connection) connection.release();
    }
  }

  // 分页获取用户列表
  async getUserListPage(page = 1, size = 10) {
    let connection;
    try {
      const offset = (page - 1) * size;
      connection = await pool.getConnection();
      
      const [rows] = await connection.query(
        'SELECT * FROM user LIMIT ? OFFSET ?',
        [size, offset]
      );
      
      const [[countResult]] = await connection.query('SELECT COUNT(*) as total FROM user');
      
      return {
        list: rows,
        total: countResult.total,
        page: page,
        size: size
      };
    } catch (error) {
      throw new Error('Failed to fetch user list with pagination: ' + error.message);
    } finally {
      //获取连接后必须在使用完毕后通过 connection.release() 方法将其归还给连接池
      // 需要在 try-finally 块中使用，确保即使发生错误也能正确释放连接
      if (connection) connection.release();
    }
  }

  // 根据账单状态分组用户
  async getUsersGroupedByBillStatus() {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const [disabled] = await connection.query(
        'SELECT id, name, age as age FROM user WHERE status = ?',
        ['0']
      );
      
      const [enabled] = await connection.query(
        'SELECT id, name, age as age FROM user WHERE status = ?',
        ['1']
      );
      
      return {
        disabled,
        enabled
      };
    } catch (error) {
      throw new Error('Failed to fetch user groups: ' + error.message);
    } finally {
      if (connection) connection.release();
    }
  }
  
  // 保存单个用户信息（保持向后兼容）
  async saveUser(userData) {
    let connection;
    try {
      const { name, age, gender, permission, email } = userData;
      connection = await pool.getConnection();
      
      const [result] = await connection.query(
        'INSERT INTO user (name, age, gender, permission, email) VALUES (?, ?, ?, ?, ?)',
        [name, age, gender, permission, email]
      );
      
      return result;
    } catch (error) {
      throw new Error('Failed to save user: ' + error.message);
    } finally {
      if (connection) connection.release();
    }
  }
  
  // 保存用户信息数组
  async saveUserArray(userArray) {
    let connection;
    try {
      // 开始事务
      connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {
        const results = [];
        
        // 循环插入每个用户
        for (const user of userArray) {
          const { name, age, gender, permission, email } = user;
          
          const [result] = await connection.query(
            'INSERT INTO user (name, age, gender, permission, email) VALUES (?, ?, ?, ?, ?)',
            [name, age, gender, permission, email || null]
          );
          
          results.push(result);
        }
        
        // 提交事务
        await connection.commit();
        
        return results;
      } catch (error) {
        // 回滚事务
        await connection.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error('Failed to save user array: ' + error.message);
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = new UserService();