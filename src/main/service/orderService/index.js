const { executeRead, executeWrite } = require("../../utils/dbReadWrite");

class OrderService {
  // 获取订单列表
  async getOrderList() {
    try {
      // 使用参数化查询防止SQL注入
      const rows = await executeRead("SELECT * FROM orders");
      return rows;
    } catch (error) {
      throw new Error("Failed to fetch order list: " + error.message);
    }
  }

  // 分页获取订单列表
  async getOrderListPage(page = 1, size = 10) {
    try {
      const pageNum = parseInt(page);
      const pageSize = parseInt(size);
      const offset = (pageNum - 1) * pageSize;

      // 使用参数化查询防止SQL注入
      const rows = await executeRead("SELECT * FROM orders LIMIT ? OFFSET ?", [
        pageSize,
        offset,
      ]);

      const [countResult] = await executeRead(
        "SELECT COUNT(*) as total FROM orders"
      );

      return {
        list: rows,
        total: countResult.total,
        page: pageNum,
        size: pageSize,
      };
    } catch (error) {
      throw new Error(
        "Failed to fetch order list with pagination: " + error.message
      );
    }
  }

  // 根据ID获取订单详情
  async getOrderById(orderId) {
    try {
      // 使用参数化查询防止SQL注入
      const rows = await executeRead("SELECT * FROM orders WHERE id = ?", [
        orderId,
      ]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error("Failed to fetch order: " + error.message);
    }
  }

  // 创建订单
  async createOrder(orderData) {
    try {
      const { userId, amount, status } = orderData;
      // 使用参数化查询防止SQL注入
      const result = await executeWrite(
        "INSERT INTO orders (userId, amount, status) VALUES (?, ?, ?)",
        [userId, amount, status]
      );
      return result;
    } catch (error) {
      throw new Error("Failed to create order: " + error.message);
    }
  }

  // 更新订单
  async updateOrder(orderId, orderData) {
    try {
      const { userId, amount, status } = orderData;
      // 使用参数化查询防止SQL注入
      const result = await executeWrite(
        "UPDATE orders SET userId = ?, amount = ?, status = ? WHERE id = ?",
        [userId, amount, status, orderId]
      );
      return result;
    } catch (error) {
      throw new Error("Failed to update order: " + error.message);
    }
  }
}

module.exports = new OrderService();
