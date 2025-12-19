// SQL注入防护中间件
const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\b|--|\/\*|\*\/|;)/gi;

function sanitizeInput(input) {
  if (typeof input === 'string') {
    // 移除潜在的SQL注入关键字和字符
    return input.replace(sqlInjectionPattern, '').trim();
  }
  return input;
}

function sanitizeObject(obj) {
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeInput(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    }
  }
  return obj;
}

// 请求体数据清理中间件
function sanitizeBody(req, res, next) {
  if (req.body) {
    sanitizeObject(req.body);
  }
  next();
}

// 查询参数清理中间件
function sanitizeQuery(req, res, next) {
  if (req.query) {
    sanitizeObject(req.query);
  }
  next();
}

// URL参数清理中间件
function sanitizeParams(req, res, next) {
  if (req.params) {
    sanitizeObject(req.params);
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