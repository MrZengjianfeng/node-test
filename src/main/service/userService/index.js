const userDao = require("../../dao/userDao");

class UserService {
  // 获取用户列表
  async getUserList() {
    try {
      const rows = await userDao.getUserList();
      console.log("rows:", rows);
      return rows;
    } catch (error) {
      throw new Error("Failed to fetch user list: " + error.message);
    }
  }

  // 分页获取用户列表
  async getUserListPage(page = 1, size = 10) {
    try {
      // 确保参数是数字类型
      const pageNum = parseInt(page);
      const pageSize = parseInt(size);

      const result = await userDao.getUserListPage(pageNum, pageSize);
      return result;
    } catch (error) {
      throw new Error(
        "Failed to fetch user list with pagination: " + error.message
      );
    }
  }

  // 根据账单状态分组用户
  async getUsersGroupedByBillStatus() {
    try {
      const result = await userDao.getUsersGroupedByBillStatus();
      return result;
    } catch (error) {
      throw new Error("Failed to fetch user groups: " + error.message);
    }
  }

  // 保存单个用户信息（保持向后兼容）
  async saveUser(userData) {
    try {
      const result = await userDao.saveUser(userData);
      return result;
    } catch (error) {
      throw new Error("Failed to save user: " + error.message);
    }
  }

  // 保存用户信息数组
  async saveUserArray(userArray) {
    try {
      // 使用事务插入多个用户
      const results = await userDao.executeTransaction(async (connection) => {
        const results = [];

        // 循环插入每个用户
        for (const user of userArray) {
          const { name, age, gender, permission, email } = user;

          // 使用参数化查询防止SQL注入
          const [result] = await connection.execute(
            "INSERT INTO user (name, age, gender, permission, email) VALUES (?, ?, ?, ?, ?)",
            [name, age, gender, permission, email || null]
          );

          results.push(result);
        }

        return results;
      });

      return results;
    } catch (error) {
      throw new Error("Failed to save user array: " + error.message);
    }
  }
}

module.exports = new UserService();
