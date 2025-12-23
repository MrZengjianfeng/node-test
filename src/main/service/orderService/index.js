const orderDao = require("../../dao/orderDao");

class OrderService {
  // 获取订单列表
  async getOrderList() {
    try {
      const rows = await orderDao.getOrderList();
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

      const result = await orderDao.getOrderListPage(pageNum, pageSize);
      return result;
    } catch (error) {
      throw new Error(
        "Failed to fetch order list with pagination: " + error.message
      );
    }
  }

  // 根据ID获取订单详情
  async getOrderById(orderId) {
    try {
      const order = await orderDao.getOrderById(orderId);
      return order;
    } catch (error) {
      throw new Error("Failed to fetch order: " + error.message);
    }
  }

  // 创建订单
  async createOrder(orderData) {
    try {
      const result = await orderDao.createOrder(orderData);
      return result;
    } catch (error) {
      throw new Error("Failed to create order: " + error.message);
    }
  }

  // 更新订单
  async updateOrder(orderId, orderData) {
    try {
      const result = await orderDao.updateOrder(orderId, orderData);
      return result;
    } catch (error) {
      throw new Error("Failed to update order: " + error.message);
    }
  }
}

module.exports = new OrderService();
