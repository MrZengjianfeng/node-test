const express = require('express');
const router = express.Router();

// 引入各个模块的控制器
const userController = require('../controller/user');
const orderController = require('../controller/order');
const systemController = require('../controller/system');

// 注册各模块路由，为不同模块分配不同的路径前缀
router.use('/user', userController);
router.use('/order', orderController);
router.use('/system', systemController);

module.exports = router;