const express = require('express');
const systemService = require('../../service/systemService');
const { systemValidators } = require('../../middleware/validation');
const router = express.Router();

// 获取系统列表
router.get('/list', (req, res) => {
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
router.get('/listPage', systemValidators.listPage, (req, res) => {
  try {
    const { page = 1, size = 10 } = req.sanitizedQuery; // 使用清理后的查询参数
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
router.get('/groupByBillStatus', (req, res) => {
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