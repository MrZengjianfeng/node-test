const express = require('express');
const orderService = require('../../service/orderService');
const { orderValidators } = require('../../middleware/validation');
const router = express.Router();

// 获取订单列表
router.get('/list', orderValidators.listPage, async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.sanitizedQuery; // 使用清理后的查询参数
    const orderList = await orderService.getOrderList();
    res.json({
      code: 200,
      data: orderList,
      message: 'Success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
});

// 获取订单详情
router.get('/detail/:id', orderValidators.orderId, async (req, res) => {
  try {
    const orderId = req.sanitizedParams.id; // 使用清理后的参数
    const orderDetail = await orderService.getOrderById(orderId);
    
    if (!orderDetail) {
      return res.status(404).json({
        code: 404,
        data: null,
        message: 'Order not found'
      });
    }
    
    res.json({
      code: 200,
      data: orderDetail,
      message: 'Success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
});

// 创建订单
router.post('/create', orderValidators.createOrder, async (req, res) => {
  try {
    const orderData = req.sanitizedBody; // 使用清理后的请求体
    const result = await orderService.createOrder(orderData);
    
    res.json({
      code: 200,
      data: result,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
});

// 更新订单
router.put('/update/:id', orderValidators.updateOrder, async (req, res) => {
  try {
    const orderId = req.sanitizedParams.id; // 使用清理后的参数
    const orderData = req.sanitizedBody; // 使用清理后的请求体
    const result = await orderService.updateOrder(orderId, orderData);
    
    res.json({
      code: 200,
      data: result,
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
});

module.exports = router;