const express = require('express');
const userService = require('../../service/userService');
const router = express.Router();

// 获取用户列表
router.get('/user/list', async (req, res) => {
  try {
    const userList = await userService.getUserList();
    console.log('userList:', userList)
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

// 保存用户信息数组
router.post('/user/doSave', async (req, res) => {
  try {
    // 获取请求体中的用户数组
    const userArray = req.body;
    
    // 验证请求体是否为数组
    if (!Array.isArray(userArray)) {
      return res.status(400).json({
        code: 400,
        data: null,
        message: 'Request body must be an array of users'
      });
    }
    
    // 验证每个用户对象
    for (const [index, user] of userArray.entries()) {
      if (!user.name || !user.age || !user.gender) {
        return res.status(400).json({
          code: 400,
          data: null,
          message: `User at index ${index} must include name, age, and gender`
        });
      }
    }
    
    // 调用服务保存用户数组
    const result = await userService.saveUserArray(userArray);
    
    res.json({
      code: 200,
      data: result,
      message: 'Users saved successfully'
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