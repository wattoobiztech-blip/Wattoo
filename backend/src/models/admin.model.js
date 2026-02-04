const DatabaseUtils = require('../utils/database');
const Helpers = require('../utils/helpers');

class Admin {
  
  // Admin roles and permissions
  static roles = {
    super_admin: {
      name: 'Super Admin',
      permissions: ['all']
    },
    admin: {
      name: 'Admin',
      permissions: ['users', 'profiles', 'subscriptions', 'content', 'analytics', 'comments']
    },
    moderator: {
      name: 'Moderator',
      permissions: ['profiles', 'content', 'comments']
    },
    support: {
      name: 'Support',
      permissions: ['users', 'comments']
    }
  };

  // Create new admin user
  static async create(adminData) {
    try {
      const hashedPassword = await Helpers.hashPassword(adminData.password);
      
      const adminId = await DatabaseUtils.insert('admin_users', {
        username: adminData.username,
        email: adminData.email.toLowerCase(),
        password_hash: hashedPassword,
        full_name: adminData.fullName,
        role: adminData.role || 'admin',
        permissions: JSON.stringify(this.roles[adminData.role || 'admin'].permissions),
        created_by: adminData.createdBy || null,
        created_at: new Date()
      });

      return await this.findById(adminId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  }

  // Find admin by ID
  static async findById(adminId) {
    const admin = await DatabaseUtils.findOne('admin_users', { id: adminId });
    if (admin) {
      delete admin.password_hash;
      if (admin.permissions) {
        admin.permissions = JSON.parse(admin.permissions);
      }
    }
    return admin;
  }

  // Find admin by username
  static async findByUsername(username) {
    return await DatabaseUtils.findOne('admin_users', { username });
  }

  // Find admin by email
  static async findByEmail(email) {
    return await DatabaseUtils.findOne('admin_users', { email: email.toLowerCase() });
  }

  // Find admin for authentication (includes password)
  static async findForAuth(identifier) {
    const query = `
      SELECT * FROM admin_users 
      WHERE (username = ? OR email = ?) AND is_active = TRUE
    `;
    
    const admins = await DatabaseUtils.query(query, [identifier, identifier.toLowerCase()]);
    return admins[0] || null;
  }

  // Update admin
  static async update(adminId, updateData) {
    const cleanData = Helpers.cleanObject(updateData);
    
    if (cleanData.password) {
      cleanData.password_hash = await Helpers.hashPassword(cleanData.password);
      delete cleanData.password;
    }

    if (cleanData.email) {
      cleanData.email = cleanData.email.toLowerCase();
    }

    if (cleanData.role && this.roles[cleanData.role]) {
      cleanData.permissions = JSON.stringify(this.roles[cleanData.role].permissions);
    }

    cleanData.updated_at = new Date();

    const affectedRows = await DatabaseUtils.update('admin_users', cleanData, { id: adminId });
    
    if (affectedRows === 0) {
      throw new Error('Admin not found');
    }

    return await this.findById(adminId);
  }

  // Update last login
  static async updateLastLogin(adminId) {
    await DatabaseUtils.update('admin_users', {
      last_login: new Date(),
      login_attempts: 0,
      locked_until: null
    }, { id: adminId });
  }

  // Increment login attempts
  static async incrementLoginAttempts(adminId) {
    const admin = await this.findById(adminId);
    if (!admin) return;

    const attempts = (admin.login_attempts || 0) + 1;
    const updateData = { login_attempts: attempts };

    // Lock account after 5 failed attempts for 1 hour
    if (attempts >= 5) {
      const lockUntil = new Date();
      lockUntil.setHours(lockUntil.getHours() + 1);
      updateData.locked_until = lockUntil;
    }

    await DatabaseUtils.update('admin_users', updateData, { id: adminId });
  }

  // Check if admin is locked
  static async isLocked(adminId) {
    const admin = await DatabaseUtils.findOne('admin_users', { id: adminId }, 'locked_until');
    if (!admin || !admin.locked_until) return false;
    
    return new Date() < new Date(admin.locked_until);
  }

  // Deactivate admin
  static async deactivate(adminId) {
    await DatabaseUtils.update('admin_users', {
      is_active: false,
      updated_at: new Date()
    }, { id: adminId });
  }

  // Activate admin
  static async activate(adminId) {
    await DatabaseUtils.update('admin_users', {
      is_active: true,
      login_attempts: 0,
      locked_until: null,
      updated_at: new Date()
    }, { id: adminId });
  }

  // Get all admins
  static async getAll(page = 1, limit = 20, filters = {}) {
    let whereConditions = [];
    let params = [];

    if (filters.role) {
      whereConditions.push('role = ?');
      params.push(filters.role);
    }

    if (filters.active !== undefined) {
      whereConditions.push('is_active = ?');
      params.push(filters.active);
    }

    if (filters.search) {
      whereConditions.push('(username LIKE ? OR email LIKE ? OR full_name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) as total FROM admin_users ${whereClause}`;
    const dataQuery = `
      SELECT id, username, email, full_name, role, is_active, last_login, created_at
      FROM admin_users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, admins] = await Promise.all([
      DatabaseUtils.query(countQuery, params),
      DatabaseUtils.query(dataQuery, [...params, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      admins,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Check admin permissions
  static async hasPermission(adminId, permission) {
    const admin = await this.findById(adminId);
    if (!admin || !admin.is_active) return false;

    const permissions = admin.permissions || [];
    
    // Super admin has all permissions
    if (permissions.includes('all')) return true;
    
    return permissions.includes(permission);
  }

  // Get dashboard metrics
  static async getDashboardMetrics() {
    const queries = [
      // Total users
      'SELECT COUNT(*) as count FROM users WHERE is_active = TRUE',
      // Active profiles
      'SELECT COUNT(*) as count FROM profiles WHERE profile_completed = TRUE',
      // Pending approvals
      'SELECT COUNT(*) as count FROM profiles WHERE verification_status = "pending"',
      // Today's revenue
      'SELECT COALESCE(SUM(amount), 0) as revenue FROM payments WHERE DATE(payment_date) = CURDATE() AND status = "completed"',
      // Total subscriptions
      'SELECT COUNT(*) as count FROM subscriptions WHERE status = "active"',
      // Users registered today
      'SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()',
      // Users registered yesterday
      'SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)',
      // Revenue yesterday
      'SELECT COALESCE(SUM(amount), 0) as revenue FROM payments WHERE DATE(payment_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND status = "completed"'
    ];

    const results = await Promise.all(
      queries.map(query => DatabaseUtils.query(query))
    );

    const todayUsers = results[5][0]?.count || 0;
    const yesterdayUsers = results[6][0]?.count || 0;
    const todayRevenue = results[3][0]?.revenue || 0;
    const yesterdayRevenue = results[7][0]?.revenue || 0;

    // Calculate percentage changes
    const usersChange = yesterdayUsers > 0 ? ((todayUsers - yesterdayUsers) / yesterdayUsers * 100) : 0;
    const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0;

    return {
      totalUsers: results[0][0]?.count || 0,
      totalUsersChange: Math.round(usersChange * 100) / 100,
      activeProfiles: results[1][0]?.count || 0,
      activeProfilesChange: 8.2, // Mock data - implement actual calculation
      pendingApprovals: results[2][0]?.count || 0,
      pendingApprovalsChange: -15.3, // Mock data
      todayRevenue: todayRevenue,
      todayRevenueChange: Math.round(revenueChange * 100) / 100,
      totalSubscriptions: results[4][0]?.count || 0,
      totalSubscriptionsChange: 18.7, // Mock data
      matchSuccessRate: 89.5, // Mock data - implement actual calculation
      matchSuccessRateChange: 2.3 // Mock data
    };
  }

  // Get chart data for dashboard
  static async getChartData() {
    // User registrations for last 30 days
    const userRegistrations = await DatabaseUtils.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Monthly revenue for last 12 months
    const revenueChart = await DatabaseUtils.query(`
      SELECT 
        DATE_FORMAT(payment_date, '%Y-%m') as month,
        SUM(amount) as revenue,
        COUNT(DISTINCT subscription_id) as subscriptions
      FROM payments
      WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        AND status = 'completed'
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
      ORDER BY month ASC
    `);

    // Subscription distribution
    const subscriptionDistribution = await DatabaseUtils.query(`
      SELECT 
        CASE 
          WHEN s.plan_type IS NULL THEN 'Free'
          ELSE s.plan_type
        END as name,
        COUNT(*) as value
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
      WHERE u.is_active = TRUE
      GROUP BY s.plan_type
    `);

    // Top locations
    const topLocations = await DatabaseUtils.query(`
      SELECT 
        p.country,
        COUNT(*) as users,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM profiles WHERE country IS NOT NULL), 1) as percentage
      FROM profiles p
      WHERE p.country IS NOT NULL AND p.profile_completed = TRUE
      GROUP BY p.country
      ORDER BY users DESC
      LIMIT 5
    `);

    return {
      userRegistrations: userRegistrations.map(row => ({
        date: row.date,
        count: row.count
      })),
      revenueChart: revenueChart.map(row => ({
        month: new Date(row.month + '-01').toLocaleDateString('en', { month: 'short' }),
        revenue: parseFloat(row.revenue),
        subscriptions: row.subscriptions
      })),
      subscriptionDistribution: subscriptionDistribution.map(row => ({
        name: row.name === 'golden' ? 'Golden' : 
              row.name === 'diamond' ? 'Diamond' : 
              row.name === 'elite' ? 'Elite' : 'Free',
        value: row.value,
        color: row.name === 'golden' ? '#fbbf24' : 
               row.name === 'diamond' ? '#3b82f6' : 
               row.name === 'elite' ? '#8b5cf6' : '#94a3b8'
      })),
      topLocations: topLocations.map(row => ({
        country: row.country,
        users: row.users,
        percentage: parseFloat(row.percentage)
      }))
    };
  }

  // Get recent activity
  static async getRecentActivity(limit = 10) {
    const query = `
      SELECT 
        'registration' as type,
        CONCAT('New user registered: ', u.full_name) as message,
        u.created_at as timestamp,
        u.id as user_id,
        NULL as admin_id,
        'info' as severity
      FROM users u
      WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      UNION ALL
      
      SELECT 
        'approval' as type,
        CONCAT('Profile approved: ', p.name) as message,
        p.updated_at as timestamp,
        p.user_id,
        NULL as admin_id,
        'success' as severity
      FROM profiles p
      WHERE p.verification_status = 'approved' 
        AND p.updated_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      UNION ALL
      
      SELECT 
        'subscription' as type,
        CONCAT('New ', s.plan_type, ' subscription: ', u.full_name) as message,
        s.created_at as timestamp,
        s.user_id,
        NULL as admin_id,
        'success' as severity
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      ORDER BY timestamp DESC
      LIMIT ?
    `;

    const activities = await DatabaseUtils.query(query, [limit]);
    
    return activities.map((activity, index) => ({
      id: index + 1,
      type: activity.type,
      message: activity.message,
      timestamp: activity.timestamp,
      userId: activity.user_id,
      adminId: activity.admin_id,
      severity: activity.severity
    }));
  }

  // Add admin comment
  static async addComment(commentData) {
    const commentId = await DatabaseUtils.insert('admin_comments', {
      profile_id: commentData.profileId,
      admin_id: commentData.adminId,
      comment: commentData.comment,
      category: commentData.category || 'general',
      attachments: commentData.attachments ? JSON.stringify(commentData.attachments) : null,
      created_at: new Date()
    });

    return await this.getComment(commentId);
  }

  // Get admin comment
  static async getComment(commentId) {
    const query = `
      SELECT ac.*, au.username as admin_name, au.full_name as admin_full_name,
             p.name as profile_name, p.user_id
      FROM admin_comments ac
      JOIN admin_users au ON ac.admin_id = au.id
      JOIN profiles p ON ac.profile_id = p.id
      WHERE ac.id = ?
    `;

    const comments = await DatabaseUtils.query(query, [commentId]);
    const comment = comments[0];

    if (comment && comment.attachments) {
      comment.attachments = JSON.parse(comment.attachments);
    }

    return comment || null;
  }

  // Get comments for profile
  static async getCommentsForProfile(profileId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM admin_comments
      WHERE profile_id = ?
    `;

    const dataQuery = `
      SELECT ac.*, au.username as admin_name, au.full_name as admin_full_name
      FROM admin_comments ac
      JOIN admin_users au ON ac.admin_id = au.id
      WHERE ac.profile_id = ?
      ORDER BY ac.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, comments] = await Promise.all([
      DatabaseUtils.query(countQuery, [profileId]),
      DatabaseUtils.query(dataQuery, [profileId, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    // Parse attachments JSON
    const parsedComments = comments.map(comment => {
      if (comment.attachments) {
        comment.attachments = JSON.parse(comment.attachments);
      }
      return comment;
    });

    return {
      comments: parsedComments,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Get all admin comments
  static async getAllComments(page = 1, limit = 20, filters = {}) {
    let whereConditions = [];
    let params = [];

    if (filters.category) {
      whereConditions.push('ac.category = ?');
      params.push(filters.category);
    }

    if (filters.resolved !== undefined) {
      whereConditions.push('ac.is_resolved = ?');
      params.push(filters.resolved);
    }

    if (filters.adminId) {
      whereConditions.push('ac.admin_id = ?');
      params.push(filters.adminId);
    }

    if (filters.search) {
      whereConditions.push('(ac.comment LIKE ? OR p.name LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM admin_comments ac
      JOIN profiles p ON ac.profile_id = p.id
      ${whereClause}
    `;

    const dataQuery = `
      SELECT ac.*, au.username as admin_name, au.full_name as admin_full_name,
             p.name as profile_name, p.user_id
      FROM admin_comments ac
      JOIN admin_users au ON ac.admin_id = au.id
      JOIN profiles p ON ac.profile_id = p.id
      ${whereClause}
      ORDER BY ac.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, comments] = await Promise.all([
      DatabaseUtils.query(countQuery, params),
      DatabaseUtils.query(dataQuery, [...params, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    // Parse attachments JSON
    const parsedComments = comments.map(comment => {
      if (comment.attachments) {
        comment.attachments = JSON.parse(comment.attachments);
      }
      return comment;
    });

    return {
      comments: parsedComments,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Update admin comment
  static async updateComment(commentId, updateData) {
    const cleanData = Helpers.cleanObject(updateData);
    cleanData.updated_at = new Date();

    if (cleanData.attachments && typeof cleanData.attachments === 'object') {
      cleanData.attachments = JSON.stringify(cleanData.attachments);
    }

    const affectedRows = await DatabaseUtils.update('admin_comments', cleanData, { id: commentId });
    
    if (affectedRows === 0) {
      throw new Error('Comment not found');
    }

    return await this.getComment(commentId);
  }

  // Delete admin comment
  static async deleteComment(commentId) {
    const affectedRows = await DatabaseUtils.delete('admin_comments', { id: commentId });
    return affectedRows > 0;
  }

  // Log admin activity
  static async logActivity(adminId, action, entityType = null, entityId = null, oldValues = null, newValues = null, ipAddress = null, userAgent = null) {
    try {
      await DatabaseUtils.insert('activity_logs', {
        admin_id: adminId,
        action: action,
        entity_type: entityType,
        entity_id: entityId,
        old_values: oldValues ? JSON.stringify(oldValues) : null,
        new_values: newValues ? JSON.stringify(newValues) : null,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date()
      });
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
  }

  // Get activity logs
  static async getActivityLogs(page = 1, limit = 50, filters = {}) {
    let whereConditions = [];
    let params = [];

    if (filters.adminId) {
      whereConditions.push('al.admin_id = ?');
      params.push(filters.adminId);
    }

    if (filters.action) {
      whereConditions.push('al.action = ?');
      params.push(filters.action);
    }

    if (filters.entityType) {
      whereConditions.push('al.entity_type = ?');
      params.push(filters.entityType);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM activity_logs al
      ${whereClause}
    `;

    const dataQuery = `
      SELECT al.*, au.username as admin_name, au.full_name as admin_full_name
      FROM activity_logs al
      LEFT JOIN admin_users au ON al.admin_id = au.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, logs] = await Promise.all([
      DatabaseUtils.query(countQuery, params),
      DatabaseUtils.query(dataQuery, [...params, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    // Parse JSON values
    const parsedLogs = logs.map(log => {
      if (log.old_values) {
        log.old_values = JSON.parse(log.old_values);
      }
      if (log.new_values) {
        log.new_values = JSON.parse(log.new_values);
      }
      return log;
    });

    return {
      logs: parsedLogs,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Get admin roles
  static getRoles() {
    return this.roles;
  }

  // Check if username exists
  static async usernameExists(username) {
    const admin = await this.findByUsername(username);
    return !!admin;
  }

  // Check if email exists
  static async emailExists(email) {
    const admin = await this.findByEmail(email);
    return !!admin;
  }
}

module.exports = Admin;