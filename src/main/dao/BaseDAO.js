const {
  executeRead,
  executeWrite,
  executeTransaction,
} = require("../utils/dbReadWrite");

class BaseDAO {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // 通用查询方法
  async findAll() {
    const sql = `SELECT * FROM ${this.tableName}`;
    return await executeRead(sql);
  }

  // 分页查询
  async findByPage(page = 1, size = 10) {
    const pageNum = parseInt(page);
    const pageSize = parseInt(size);
    const offset = (pageNum - 1) * pageSize;

    // 直接拼接数字到 SQL（因为 LIMIT/OFFSET 不支持参数绑定）
    const rows = await executeRead(
        `SELECT * FROM ${this.tableName} LIMIT ${pageSize} OFFSET ${offset}`
    );

    const [countResult] = await executeRead(
        `SELECT COUNT(*) as total FROM ${this.tableName}`
    );

    return {
      list: rows,
      total: countResult.total,
      page: pageNum,
      size: pageSize,
    };
  }

  // 根据ID查找
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await executeRead(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  // 通用插入
  async insert(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => "?").join(",");

    const sql = `INSERT INTO ${this.tableName} (${columns.join(
      ","
    )}) VALUES (${placeholders})`;
    return await executeWrite(sql, values);
  }

  // 通用更新
  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col) => `${col} = ?`).join(",");

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    return await executeWrite(sql, [...values, id]);
  }

  // 通用删除
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await executeWrite(sql, [id]);
  }

  // 根据条件查询
  async findByCondition(condition = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const values = [];
    const conditions = [];

    if (Object.keys(condition).length > 0) {
      for (const [key, value] of Object.entries(condition)) {
        conditions.push(`${key} = ?`);
        values.push(value);
      }
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    return await executeRead(sql, values);
  }

  // 事务操作
  async executeTransaction(transactionFunction) {
    return await executeTransaction(transactionFunction);
  }
}

module.exports = BaseDAO;
