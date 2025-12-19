/**
 * SQL注入防护中间件
 * 使用更合理的检测方式而不是简单的黑名单过滤
 */

// 危险的SQL关键字模式（用于检测而非简单删除）
const dangerousSqlPatterns = [
  /\b(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE|MERGE|EXECUTE)\b/gi,
  /--/g,
  /\/\*/g,
  /\*\//g,
  /;/g,
];

/**
 * 检测输入是否包含潜在的SQL注入风险
 * @param {*} input - 需要检测的输入
 * @returns {boolean} 是否包含风险
 */
function detectSqlInjectionRisk(input) {
  if (typeof input !== "string") {
    return false;
  }

  // 检查是否包含危险的关键字组合
  for (const pattern of dangerousSqlPatterns) {
    if (pattern.test(input)) {
      // 如果发现潜在风险，记录日志并返回true
      console.warn(`Potential SQL injection detected: ${input}`);
      return true;
    }
  }
  return false;
}

/**
 * 深度检测对象中是否存在SQL注入风险
 * @param {*} obj - 需要检测的对象
 * @param {string} path - 对象路径（用于递归调用）
 * @returns {boolean} 是否包含风险
 */
function deepDetectSqlInjection(obj, path = "") {
  if (obj === null || obj === undefined) {
    return false;
  }

  if (typeof obj === "string") {
    return detectSqlInjectionRisk(obj);
  }

  if (typeof obj === "object") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (deepDetectSqlInjection(obj[key], currentPath)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * 请求体SQL注入检测中间件
 */
function protectBodyFromSqlInjection(req, res, next) {
  if (req.body && deepDetectSqlInjection(req.body)) {
    return res.status(400).json({
      code: 400,
      data: null,
      message:
        "Request blocked: Potential SQL injection detected in request body",
    });
  }
  next();
}

/**
 * 查询参数SQL注入检测中间件
 */
function protectQueryFromSqlInjection(req, res, next) {
  if (req.query && deepDetectSqlInjection(req.query)) {
    return res.status(400).json({
      code: 400,
      data: null,
      message:
        "Request blocked: Potential SQL injection detected in query parameters",
    });
  }
  next();
}

/**
 * URL参数SQL注入检测中间件
 */
function protectParamsFromSqlInjection(req, res, next) {
  if (req.params && deepDetectSqlInjection(req.params)) {
    return res.status(400).json({
      code: 400,
      data: null,
      message:
        "Request blocked: Potential SQL injection detected in URL parameters",
    });
  }
  next();
}

module.exports = {
  protectBodyFromSqlInjection,
  protectQueryFromSqlInjection,
  protectParamsFromSqlInjection,
  detectSqlInjectionRisk,
  deepDetectSqlInjection,
};
