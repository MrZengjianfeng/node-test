const express = require('express');
const systemService = require('../../service/systemService');
const router = express.Router();

// 获取系统列表
router.get('/system/list', (req, res) => {
  try {
    const systemList = systemService.getSystemList();

    res.json({
      code: 200,
      data: systemList,
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

// 分页获取系统列表
router.get('/system/listPage', (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = systemService.getSystemListPage(parseInt(page), parseInt(size));

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

// 根据状态分组系统信息
router.get('/system/groupByBillStatus', (req, res) => {
  try {
    const groupedData = systemService.getSystemsGroupedByStatus();

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