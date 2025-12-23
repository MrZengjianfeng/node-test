const BaseDAO = require("../BaseDAO");

class OrderDAO extends BaseDAO {
  constructor() {
    super("orders");
  }

  // 获取订单列表
  async getOrderList() {
    return await this.findAll();
  }

  // 分页获取订单列表
  async getOrderListPage(page = 1, size = 10) {
    return await this.findByPage(page, size);
  }

  // 根据ID获取订单详情
  async getOrderById(orderId) {
    return await this.findById(orderId);
  }

  // 创建订单
  async createOrder(orderData) {
    return await this.insert(orderData);
  }

  // 更新订单
  async updateOrder(orderId, orderData) {
    return await this.update(orderId, orderData);
  }

  // 自定义查询 - 根据用户ID获取订单
  async getOrdersByUserId(userId) {
    return await this.findByCondition({ userId });
  }
}

module.exports = new OrderDAO();
