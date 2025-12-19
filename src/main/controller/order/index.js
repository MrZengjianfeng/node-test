const express = require('express');
const orderService = require('../../service/orderService');
const router = express.Router();

// 获取订单列表
router.get('/order/list', async (req, res) => {
  try {
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
router.get('/order/detail/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
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
router.post('/order/create', async (req, res) => {
  try {
    const orderData = req.body;
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
router.put('/order/update/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = req.body;
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