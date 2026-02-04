const { pool } = require('../config/database');

// Database utility functions
class DatabaseUtils {
  
  // Execute a single query
  static async query(sql, params = []) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Execute multiple queries in a transaction
  static async transaction(queries) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const results = [];
      for (const { sql, params } of queries) {
        const [result] = await connection.execute(sql, params);
        results.push(result);
      }
      
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      console.error('Transaction error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Check if record exists
  static async exists(table, conditions) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const values = Object.values(conditions);
    const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${whereClause}`;
    
    const [result] = await this.query(sql, values);
    return result.count > 0;
  }

  // Insert record and return ID
  static async insert(table, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    
    return result.insertId;
  }

  // Update record
  static async update(table, data, conditions) {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const values = [...Object.values(data), ...Object.values(conditions)];
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    
    const result = await this.query(sql, values);
    return result.affectedRows;
  }

  // Delete record
  static async delete(table, conditions) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const values = Object.values(conditions);
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    
    const result = await this.query(sql, values);
    return result.affectedRows;
  }

  // Find single record
  static async findOne(table, conditions, columns = '*') {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const values = Object.values(conditions);
    const sql = `SELECT ${columns} FROM ${table} WHERE ${whereClause} LIMIT 1`;
    
    const rows = await this.query(sql, values);
    return rows[0] || null;
  }

  // Find multiple records
  static async findMany(table, conditions = {}, options = {}) {
    let sql = `SELECT ${options.columns || '*'} FROM ${table}`;
    const values = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }
    
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    }
    
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`;
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }
    }
    
    return await this.query(sql, values);
  }

  // Count records
  static async count(table, conditions = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${table}`;
    const values = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      values.push(...Object.values(conditions));
    }
    
    const [result] = await this.query(sql, values);
    return result.count;
  }

  // Paginate results
  static async paginate(table, conditions = {}, page = 1, limit = 20, options = {}) {
    const offset = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.findMany(table, conditions, { ...options, limit, offset }),
      this.count(table, conditions)
    ]);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }
}

module.exports = DatabaseUtils;