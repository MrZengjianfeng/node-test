/**
 * 输入数据清理中间件
 * 主要用于清理非SQL相关的特殊字符，如XSS攻击字符等
 */

/**
 * 清理输入中的特殊字符（主要用于XSS防护等，而非SQL注入）
 * @param {*} input - 需要清理的输入
 * @returns {*} 清理后的输入
 */
function sanitizeInput(input) {
  if (typeof input === 'string') {
    // 转义HTML特殊字符以防止XSS攻击
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }
  return input;
}

/**
 * 递归清理对象中的所有字符串值
 * @param {*} obj - 需要清理的对象
 * @returns {*} 清理后的对象
 */
function sanitizeObject(obj) {
  if (typeof obj === 'object' && obj !== null) {
    // 创建新对象避免修改原始对象
    const sanitizedObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          sanitizedObj[key] = sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitizedObj[key] = sanitizeObject(obj[key]);
        } else {
          sanitizedObj[key] = obj[key];
        }
      }
    }
    return sanitizedObj;
  }
  return obj;
}

/**
 * 请求体数据清理中间件（用于XSS等防护）
 */
function sanitizeBody(req, res, next) {
  if (req.body) {
    req.sanitizedBody = sanitizeObject(req.body);
  }
  next();
}

/**
 * 查询参数清理中间件（用于XSS等防护）
 */
function sanitizeQuery(req, res, next) {
  if (req.query) {
    req.sanitizedQuery = sanitizeObject(req.query);
  }
  next();
}

/**
 * URL参数清理中间件（用于XSS等防护）
 */
function sanitizeParams(req, res, next) {
  if (req.params) {
    req.sanitizedParams = sanitizeObject(req.params);
  }
  next();
}

module.exports = {
  sanitizeBody,
  sanitizeQuery,
  sanitizeParams,
  sanitizeInput,
  sanitizeObject
};