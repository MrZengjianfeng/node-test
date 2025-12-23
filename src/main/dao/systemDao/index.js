const BaseDAO = require("../BaseDAO");

class SystemDAO extends BaseDAO {
  constructor() {
    // 使用'systems'作为表名，如果系统表存在的话
    super("systems");
  }

  // 获取系统列表
  async getSystemList() {
    try {
      return await this.findAll();
    } catch (error) {
      // 如果表不存在，返回模拟数据
      console.warn(
        "Systems table not found, returning mock data:",
        error.message
      );
      return [
        { id: 1, name: "Authentication Service", status: "active" },
        { id: 2, name: "Payment Service", status: "active" },
        { id: 3, name: "Notification Service", status: "inactive" },
      ];
    }
  }

  // 分页获取系统列表
  async getSystemListPage(page = 1, size = 10) {
    try {
      return await this.findByPage(page, size);
    } catch (error) {
      // 如果表不存在，返回模拟数据的分页结果
      console.warn(
        "Systems table not found, returning mock data:",
        error.message
      );
      const systemList = [
        { id: 1, name: "Authentication Service", status: "active" },
        { id: 2, name: "Payment Service", status: "active" },
        { id: 3, name: "Notification Service", status: "inactive" },
      ];

      const start = (page - 1) * size;
      const end = start + size;
      const paginatedList = systemList.slice(start, end);

      return {
        list: paginatedList,
        total: systemList.length,
        page: page,
        size: size,
      };
    }
  }

  // 根据状态分组系统信息
  async getSystemsGroupedByStatus() {
    try {
      const allSystems = await this.findAll();

      const active = allSystems.filter((sys) => sys.status === "active");
      const inactive = allSystems.filter((sys) => sys.status === "inactive");
      const maintenance = allSystems.filter(
        (sys) => sys.status === "maintenance"
      );

      return { active, inactive, maintenance };
    } catch (error) {
      // 如果表不存在，返回模拟数据
      console.warn(
        "Systems table not found, returning mock data:",
        error.message
      );
      return {
        active: [
          { id: 1, name: "Authentication Service" },
          { id: 2, name: "Payment Service" },
        ],
        inactive: [{ id: 3, name: "Notification Service" }],
        maintenance: [],
      };
    }
  }
}

module.exports = new SystemDAO();
