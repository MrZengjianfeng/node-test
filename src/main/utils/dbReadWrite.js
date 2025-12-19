/**
 * 数据库读写分离工具类
 */
const { masterPool, slavePool } = require('../config/database');

/**
 * 转义特殊字符以防止SQL注入
 * @param {string} str - 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeString(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  });
}

/**
 * 执行写操作（INSERT, UPDATE, DELETE等）
 * @param {string} sql - SQL语句
 * @param {Array} params - SQL参数
 * @returns {Promise<any>} 查询结果
 */
async function executeWrite(sql, params = []) {
  let connection;
  try {
    connection = await masterPool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Write operation failed:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * 执行读操作（SELECT等）
 * @param {string} sql - SQL语句
 * @param {Array} params - SQL参数
 * @returns {Promise<any>} 查询结果
 */
async function executeRead(sql, params = []) {
  let connection;
  try {
    connection = await slavePool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Read operation failed:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * 执行事务操作
 * @param {Function} transactionFunction - 事务函数
 * @returns {Promise<any>} 事务结果
 */
async function executeTransaction(transactionFunction) {
  let connection;
  try {
    connection = await masterPool.getConnection();
    await connection.beginTransaction();
    
    const result = await transactionFunction(connection);
    
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Transaction failed:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  executeWrite,
  executeRead,
  executeTransaction,
  escapeString
};