const express = require('express');
const orderService = require('../../service/orderService');
const router = express.Router();

// 获取订单列表
router.get('/order/list', (req, res) => {
  try {
    const orderList = orderService.getOrderList();

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

// 分页获取订单列表
router.get('/order/listPage', (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = orderService.getOrderListPage(parseInt(page), parseInt(size));

    res.json({
      code: 200,
      data: result,
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

// 根据账单状态分组订单
router.get('/order/groupByBillStatus', (req, res) => {
  try {
    const groupedData = orderService.getOrdersGroupedByBillStatus();

    res.json({
      code: 200,
      data: groupedData,
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

module.exports = router;