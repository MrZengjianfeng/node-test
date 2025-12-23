const BaseDAO = require("../BaseDAO");

class UserDAO extends BaseDAO {
  constructor() {
    super("user");
  }

  // 获取用户列表
  async getUserList() {
    return await this.findAll();
  }

  // 分页获取用户列表
  async getUserListPage(page = 1, size = 10) {
    return await this.findByPage(page, size);
  }

  // 根据ID获取用户
  async getUserById(userId) {
    return await this.findById(userId);
  }

  // 保存单个用户信息
  async saveUser(userData) {
    return await this.insert(userData);
  }

  // 更新用户信息
  async updateUser(userId, userData) {
    return await this.update(userId, userData);
  }

  // 根据状态分组用户
  async getUsersGroupedByBillStatus() {
    const disabled = await this.findByCondition({ status: "0" });
    const enabled = await this.findByCondition({ status: "1" });

    return {
      disabled: disabled.map((user) => ({
        id: user.id,
        name: user.name,
        age: user.age,
      })),
      enabled: enabled.map((user) => ({
        id: user.id,
        name: user.name,
        age: user.age,
      })),
    };
  }
}

module.exports = new UserDAO();
