const { v4: uuidv4 } = require('uuid');

/**
 * 生成UUID v4版本的唯一标识符
 * @returns {string} UUID字符串
 */
function generateUUID() {
  return uuidv4();
}

/**
 * 生成不带连字符的UUID
 * @returns {string} 不带连字符的UUID字符串
 */
function generateUUIDWithoutHyphens() {
  return uuidv4().replace(/-/g, '');
}

/**
 * 生成大写的UUID
 * @returns {string} 大写UUID字符串
 */
function generateUUIDUpperCase() {
  return uuidv4().toUpperCase();
}

/**
 * 生成大写且不带连字符的UUID
 * @returns {string} 大写且不带连字符的UUID字符串
 */
function generateUUIDUpperCaseWithoutHyphens() {
  return uuidv4().replace(/-/g, '').toUpperCase();
}

module.exports = {
  generateUUID,
  generateUUIDWithoutHyphens,
  generateUUIDUpperCase,
  generateUUIDUpperCaseWithoutHyphens
};