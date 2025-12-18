const express = require('express');
const router = express.Router();

// 引入各个模块的控制器
const userController = require('../controller/user');
const orderController = require('../controller/order');
const systemController = require('../controller/system');

// 注册各模块路由
router.use('/', userController);
router.use('/', orderController);
router.use('/', systemController);

module.exports = router;