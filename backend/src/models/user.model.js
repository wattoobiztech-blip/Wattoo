const DatabaseUtils = require('../utils/database');
const Helpers = require('../utils/helpers');

class User {
  
  // Create new user
  static async create(userData) {
    try {
      const hashedPassword = await Helpers.hashPassword(userData.password);
      
      const userId = await DatabaseUtils.insert('users', {
        email: userData.email.toLowerCase(),
        password_hash: hashedPassword,
        full_name: userData.fullName,
        phone: userData.phone,
        gender: userData.gender,
        date_of_birth: userData.dateOfBirth || null,
        created_at: new Date()
      });

      return await this.findById(userId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  // Find user by ID
  static async findById(userId) {
    const user = await DatabaseUtils.findOne('users', { id: userId });
    if (user) {
      delete user.password_hash;
    }
    return user;
  }

  // Find user by email
  static async findByEmail(email) {
    return await DatabaseUtils.findOne('users', { email: email.toLowerCase() });
  }

  // Find user by email for authentication (includes password)
  static async findByEmailForAuth(email) {
    return await DatabaseUtils.findOne('users', { email: email.toLowerCase() });
  }

  // Update user
  static async update(userId, updateData) {
    const cleanData = Helpers.cleanObject(updateData);
    
    if (cleanData.password) {
      cleanData.password_hash = await Helpers.hashPassword(cleanData.password);
      delete cleanData.password;
    }

    if (cleanData.email) {
      cleanData.email = cleanData.email.toLowerCase();
    }

    cleanData.updated_at = new Date();

    const affectedRows = await DatabaseUtils.update('users', cleanData, { id: userId });
    
    if (affectedRows === 0) {
      throw new Error('User not found');
    }

    return await this.findById(userId);
  }

  // Update last login
  static async updateLastLogin(userId) {
    await DatabaseUtils.update('users', {
      last_login: new Date(),
      login_attempts: 0,
      locked_until: null
    }, { id: userId });
  }

  // Increment login attempts
  static async incrementLoginAttempts(userId) {
    const user = await this.findById(userId);
    if (!user) return;

    const attempts = (user.login_attempts || 0) + 1;
    const updateData = { login_attempts: attempts };

    // Lock account after 5 failed attempts for 30 minutes
    if (attempts >= 5) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 30);
      updateData.locked_until = lockUntil;
    }

    await DatabaseUtils.update('users', updateData, { id: userId });
  }

  // Check if user is locked
  static async isLocked(userId) {
    const user = await DatabaseUtils.findOne('users', { id: userId }, 'locked_until');
    if (!user || !user.locked_until) return false;
    
    return new Date() < new Date(user.locked_until);
  }

  // Verify email
  static async verifyEmail(userId) {
    await DatabaseUtils.update('users', {
      is_verified: true,
      email_verified_at: new Date()
    }, { id: userId });
  }

  // Verify phone
  static async verifyPhone(userId) {
    await DatabaseUtils.update('users', {
      phone_verified_at: new Date()
    }, { id: userId });
  }

  // Deactivate user
  static async deactivate(userId) {
    await DatabaseUtils.update('users', {
      is_active: false,
      updated_at: new Date()
    }, { id: userId });
  }

  // Activate user
  static async activate(userId) {
    await DatabaseUtils.update('users', {
      is_active: true,
      login_attempts: 0,
      locked_until: null,
      updated_at: new Date()
    }, { id: userId });
  }

  // Delete user (soft delete by deactivating)
  static async delete(userId) {
    return await this.deactivate(userId);
  }

  // Hard delete user (permanent)
  static async hardDelete(userId) {
    const affectedRows = await DatabaseUtils.delete('users', { id: userId });
    return affectedRows > 0;
  }

  // Get user statistics
  static async getStats(userId) {
    const queries = [
      'SELECT COUNT(*) as profile_views FROM profile_views WHERE viewer_user_id = ?',
      'SELECT COUNT(*) as interests_sent FROM interests WHERE user_id = ?',
      'SELECT COUNT(*) as interests_received FROM interests WHERE interest_user_id = ?',
      'SELECT COUNT(*) as mutual_interests FROM interests i1 JOIN interests i2 ON i1.user_id = i2.interest_user_id AND i1.interest_user_id = i2.user_id WHERE i1.user_id = ?'
    ];

    const results = await Promise.all(
      queries.map(query => DatabaseUtils.query(query, [userId]))
    );

    return {
      profileViews: results[0][0]?.profile_views || 0,
      interestsSent: results[1][0]?.interests_sent || 0,
      interestsReceived: results[2][0]?.interests_received || 0,
      mutualInterests: results[3][0]?.mutual_interests || 0
    };
  }

  // Search users
  static async search(filters = {}, page = 1, limit = 20) {
    let whereConditions = ['u.is_active = TRUE'];
    let params = [];

    if (filters.gender) {
      whereConditions.push('u.gender = ?');
      params.push(filters.gender);
    }

    if (filters.minAge || filters.maxAge) {
      if (filters.minAge) {
        whereConditions.push('TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) >= ?');
        params.push(filters.minAge);
      }
      if (filters.maxAge) {
        whereConditions.push('TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) <= ?');
        params.push(filters.maxAge);
      }
    }

    if (filters.search) {
      whereConditions.push('(u.full_name LIKE ? OR u.email LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM users u 
      ${whereClause}
    `;

    const dataQuery = `
      SELECT u.id, u.email, u.full_name, u.phone, u.gender, u.date_of_birth, 
             u.is_active, u.is_verified, u.last_login, u.created_at,
             p.name as profile_name, p.age, p.city, p.picture_url,
             s.plan_type, s.status as subscription_status
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, users] = await Promise.all([
      DatabaseUtils.query(countQuery, params),
      DatabaseUtils.query(dataQuery, [...params, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      users: users.map(user => {
        delete user.password_hash;
        return user;
      }),
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Get all users (admin)
  static async getAll(page = 1, limit = 20, filters = {}) {
    return await this.search(filters, page, limit);
  }

  // Get user dashboard data
  static async getDashboardData(userId) {
    const user = await this.findById(userId);
    if (!user) throw new Error('User not found');

    const stats = await this.getStats(userId);
    
    // Get recent profile views
    const recentViews = await DatabaseUtils.query(`
      SELECT pv.viewed_at, p.name, p.picture_url, p.age, p.city
      FROM profile_views pv
      JOIN profiles p ON pv.viewed_profile_id = p.id
      WHERE pv.viewer_user_id = ?
      ORDER BY pv.viewed_at DESC
      LIMIT 5
    `, [userId]);

    // Get recent interests
    const recentInterests = await DatabaseUtils.query(`
      SELECT i.created_at, i.status, p.name, p.picture_url, p.age, p.city
      FROM interests i
      JOIN profiles p ON i.interest_user_id = p.user_id
      WHERE i.user_id = ?
      ORDER BY i.created_at DESC
      LIMIT 5
    `, [userId]);

    return {
      user,
      stats,
      recentViews,
      recentInterests
    };
  }

  // Check if email exists
  static async emailExists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  // Get users by IDs
  static async findByIds(userIds) {
    if (!userIds || userIds.length === 0) return [];
    
    const placeholders = userIds.map(() => '?').join(',');
    const users = await DatabaseUtils.query(
      `SELECT * FROM users WHERE id IN (${placeholders})`,
      userIds
    );

    return users.map(user => {
      delete user.password_hash;
      return user;
    });
  }

  // Get user count
  static async getCount(filters = {}) {
    let whereConditions = ['is_active = TRUE'];
    let params = [];

    if (filters.verified) {
      whereConditions.push('is_verified = ?');
      params.push(filters.verified);
    }

    if (filters.gender) {
      whereConditions.push('gender = ?');
      params.push(filters.gender);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const result = await DatabaseUtils.query(
      `SELECT COUNT(*) as count FROM users ${whereClause}`,
      params
    );

    return result[0]?.count || 0;
  }
}

module.exports = User;