const { body, query, param, validationResult } = require('express-validator');

// 统一错误处理中间件
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      data: null,
      message: '参数验证失败',
      errors: errors.array()
    });
  }
  next();
};

// 用户相关验证规则
const userValidators = {
  // 用户列表分页参数验证
  listPage: [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须是大于0的整数'),
    query('size').optional().isInt({ min: 1, max: 100 }).withMessage('每页大小必须是1-100之间的整数'),
    handleValidationErrors
  ],
  
  // 保存用户数据验证
  saveUser: [
    body('name').notEmpty().withMessage('姓名不能为空')
      .isLength({ min: 1, max: 50 }).withMessage('姓名长度必须在1-50之间'),
    body('age').isInt({ min: 0, max: 150 }).withMessage('年龄必须是0-150之间的整数'),
    body('gender').isIn(['男', '女']).withMessage('性别只能是男或女'),
    body('permission').optional().isIn([0, 1]).withMessage('权限只能是0或1'),
    body('email').optional().isEmail().withMessage('邮箱格式不正确'),
    handleValidationErrors
  ],
  
  // 保存用户数组验证
  saveUserArray: [
    body().isArray().withMessage('请求体必须是一个数组'),
    body('*').isObject().withMessage('数组元素必须是对象'),
    body('*.name').notEmpty().withMessage('姓名不能为空')
      .isLength({ min: 1, max: 50 }).withMessage('姓名长度必须在1-50之间'),
    body('*.age').isInt({ min: 0, max: 150 }).withMessage('年龄必须是0-150之间的整数'),
    body('*.gender').isIn(['男', '女']).withMessage('性别只能是男或女'),
    body('*.permission').optional().isIn([0, 1]).withMessage('权限只能是0或1'),
    body('*.email').optional().isEmail().withMessage('邮箱格式不正确'),
    handleValidationErrors
  ]
};

module.exports = {
  userValidators,
  handleValidationErrors
};