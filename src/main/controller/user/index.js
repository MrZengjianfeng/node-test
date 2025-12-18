const express = require('express');
const userService = require('../../service/userService');
const router = express.Router();

// 获取用户列表
router.get('/user/list', async (req, res) => {
  try {
    const userList = await userService.getUserList();
    res.json({
      code: 200,
      data: userList,
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

// 分页获取用户列表
router.get('/user/listPage', async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;
    const result = await userService.getUserListPage(parseInt(page), parseInt(size));

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

// 根据账单状态分组用户
router.get('/user/groupByBillStatus', async (req, res) => {
  try {
    const groupedData = await userService.getUsersGroupedByBillStatus();

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

// 保存用户信息
router.post('/user/doSave', async (req, res) => {
  try {
    const userData = req.body;
    const result = await userService.saveUser(userData);
    
    res.json({
      code: 200,
      data: result,
      message: 'User saved successfully'
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