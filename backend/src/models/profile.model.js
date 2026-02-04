const DatabaseUtils = require('../utils/database');
const Helpers = require('../utils/helpers');

class Profile {
  
  // Create or update profile
  static async createOrUpdate(userId, profileData) {
    try {
      const existingProfile = await DatabaseUtils.findOne('profiles', { user_id: userId });
      
      const cleanData = Helpers.cleanObject(profileData);
      cleanData.updated_at = new Date();

      if (existingProfile) {
        // Update existing profile
        await DatabaseUtils.update('profiles', cleanData, { user_id: userId });
        return await this.findByUserId(userId);
      } else {
        // Create new profile
        cleanData.user_id = userId;
        cleanData.created_at = new Date();
        
        const profileId = await DatabaseUtils.insert('profiles', cleanData);
        return await this.findById(profileId);
      }
    } catch (error) {
      throw error;
    }
  }

  // Find profile by ID
  static async findById(profileId) {
    const query = `
      SELECT p.*, u.email, u.full_name as user_full_name, u.phone, u.is_verified as user_verified,
             u.created_at as user_created_at, u.last_login
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND u.is_active = TRUE
    `;
    
    const profiles = await DatabaseUtils.query(query, [profileId]);
    return profiles[0] || null;
  }

  // Find profile by user ID
  static async findByUserId(userId) {
    const query = `
      SELECT p.*, u.email, u.full_name as user_full_name, u.phone, u.is_verified as user_verified,
             u.created_at as user_created_at, u.last_login
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? AND u.is_active = TRUE
    `;
    
    const profiles = await DatabaseUtils.query(query, [userId]);
    return profiles[0] || null;
  }

  // Update profile
  static async update(profileId, updateData) {
    const cleanData = Helpers.cleanObject(updateData);
    cleanData.updated_at = new Date();

    const affectedRows = await DatabaseUtils.update('profiles', cleanData, { id: profileId });
    
    if (affectedRows === 0) {
      throw new Error('Profile not found');
    }

    return await this.findById(profileId);
  }

  // Delete profile
  static async delete(profileId) {
    const affectedRows = await DatabaseUtils.delete('profiles', { id: profileId });
    return affectedRows > 0;
  }

  // Search profiles with advanced filters
  static async search(filters = {}, page = 1, limit = 20, currentUserId = null) {
    let whereConditions = [
      'p.profile_completed = TRUE',
      'u.is_active = TRUE'
    ];
    let params = [];

    // Exclude current user from results
    if (currentUserId) {
      whereConditions.push('p.user_id != ?');
      params.push(currentUserId);
    }

    // Gender filter
    if (filters.gender) {
      whereConditions.push('u.gender = ?');
      params.push(filters.gender);
    }

    // Age range filter
    if (filters.minAge || filters.maxAge) {
      if (filters.minAge) {
        whereConditions.push('p.age >= ?');
        params.push(filters.minAge);
      }
      if (filters.maxAge) {
        whereConditions.push('p.age <= ?');
        params.push(filters.maxAge);
      }
    }

    // Religion filter
    if (filters.religion && filters.religion.length > 0) {
      const religionPlaceholders = filters.religion.map(() => '?').join(',');
      whereConditions.push(`p.religion IN (${religionPlaceholders})`);
      params.push(...filters.religion);
    }

    // Cast filter
    if (filters.cast && filters.cast.length > 0) {
      const castPlaceholders = filters.cast.map(() => '?').join(',');
      whereConditions.push(`p.cast IN (${castPlaceholders})`);
      params.push(...filters.cast);
    }

    // Location filters
    if (filters.cities && filters.cities.length > 0) {
      const cityPlaceholders = filters.cities.map(() => '?').join(',');
      whereConditions.push(`p.city IN (${cityPlaceholders})`);
      params.push(...filters.cities);
    }

    if (filters.states && filters.states.length > 0) {
      const statePlaceholders = filters.states.map(() => '?').join(',');
      whereConditions.push(`p.state IN (${statePlaceholders})`);
      params.push(...filters.states);
    }

    if (filters.countries && filters.countries.length > 0) {
      const countryPlaceholders = filters.countries.map(() => '?').join(',');
      whereConditions.push(`p.country IN (${countryPlaceholders})`);
      params.push(...filters.countries);
    }

    // Education filter
    if (filters.education && filters.education.length > 0) {
      const educationPlaceholders = filters.education.map(() => '?').join(',');
      whereConditions.push(`p.education IN (${educationPlaceholders})`);
      params.push(...filters.education);
    }

    // Income range filter
    if (filters.minIncome) {
      whereConditions.push('p.income_annual >= ?');
      params.push(filters.minIncome);
    }

    if (filters.maxIncome) {
      whereConditions.push('p.income_annual <= ?');
      params.push(filters.maxIncome);
    }

    // Marital status filter
    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      const maritalPlaceholders = filters.maritalStatus.map(() => '?').join(',');
      whereConditions.push(`p.marital_status IN (${maritalPlaceholders})`);
      params.push(...filters.maritalStatus);
    }

    // Lifestyle filters
    if (filters.smoking) {
      whereConditions.push('p.smoking = ?');
      params.push(filters.smoking);
    }

    if (filters.drinking) {
      whereConditions.push('p.drinking = ?');
      params.push(filters.drinking);
    }

    // Verification filter
    if (filters.verified) {
      whereConditions.push('p.is_verified = TRUE');
    }

    // Featured filter
    if (filters.featured) {
      whereConditions.push('p.is_featured = TRUE AND p.featured_expiry > CURDATE()');
    }

    // Search in name and about
    if (filters.search) {
      whereConditions.push('(p.name LIKE ? OR p.about_me LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    // Sorting
    let orderBy = 'p.created_at DESC';
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          orderBy = 'p.created_at DESC';
          break;
        case 'oldest':
          orderBy = 'p.created_at ASC';
          break;
        case 'age_asc':
          orderBy = 'p.age ASC';
          break;
        case 'age_desc':
          orderBy = 'p.age DESC';
          break;
        case 'featured':
          orderBy = 'p.is_featured DESC, p.created_at DESC';
          break;
        case 'most_viewed':
          orderBy = 'p.profile_views DESC';
          break;
      }
    }

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      ${whereClause}
    `;

    const dataQuery = `
      SELECT p.*, u.email, u.gender, u.is_verified as user_verified,
             s.plan_type, s.status as subscription_status
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const [totalResult, profiles] = await Promise.all([
      DatabaseUtils.query(countQuery, params),
      DatabaseUtils.query(dataQuery, [...params, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      profiles,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Get featured profiles
  static async getFeatured(limit = 10) {
    const query = `
      SELECT p.*, u.email, u.gender, u.is_verified as user_verified
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_featured = TRUE 
        AND p.featured_expiry > CURDATE()
        AND p.profile_completed = TRUE
        AND u.is_active = TRUE
      ORDER BY p.featured_expiry DESC
      LIMIT ?
    `;

    return await DatabaseUtils.query(query, [limit]);
  }

  // Get recently joined profiles
  static async getRecentlyJoined(limit = 10, currentUserId = null) {
    let whereConditions = [
      'p.profile_completed = TRUE',
      'u.is_active = TRUE'
    ];
    let params = [];

    if (currentUserId) {
      whereConditions.push('p.user_id != ?');
      params.push(currentUserId);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT p.*, u.email, u.gender, u.is_verified as user_verified
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ?
    `;

    return await DatabaseUtils.query(query, [...params, limit]);
  }

  // Get profile completion percentage
  static async getCompletionPercentage(userId) {
    const profile = await this.findByUserId(userId);
    if (!profile) return 0;

    const requiredFields = [
      'name', 'age', 'religion', 'cast', 'city', 'state', 'country',
      'education', 'job_business', 'about_me', 'picture_url'
    ];

    const completedFields = requiredFields.filter(field => 
      profile[field] && profile[field].toString().trim() !== ''
    );

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }

  // Update profile views
  static async incrementViews(profileId, viewerUserId = null, ipAddress = null) {
    // Increment profile views count
    await DatabaseUtils.query(
      'UPDATE profiles SET profile_views = profile_views + 1 WHERE id = ?',
      [profileId]
    );

    // Record the view if viewer is logged in
    if (viewerUserId) {
      try {
        await DatabaseUtils.insert('profile_views', {
          viewer_user_id: viewerUserId,
          viewed_profile_id: profileId,
          ip_address: ipAddress,
          viewed_at: new Date()
        });
      } catch (error) {
        // Ignore duplicate entry errors (same user viewing same profile on same day)
        if (error.code !== 'ER_DUP_ENTRY') {
          console.error('Error recording profile view:', error);
        }
      }
    }
  }

  // Get profile views for a user
  static async getProfileViews(userId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM profile_views pv
      JOIN profiles p ON pv.viewer_user_id = p.user_id
      WHERE pv.viewed_profile_id = (SELECT id FROM profiles WHERE user_id = ?)
    `;

    const dataQuery = `
      SELECT pv.viewed_at, p.name, p.age, p.city, p.picture_url, u.id as viewer_id
      FROM profile_views pv
      JOIN profiles p ON pv.viewer_user_id = p.user_id
      JOIN users u ON p.user_id = u.id
      WHERE pv.viewed_profile_id = (SELECT id FROM profiles WHERE user_id = ?)
      ORDER BY pv.viewed_at DESC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, views] = await Promise.all([
      DatabaseUtils.query(countQuery, [userId]),
      DatabaseUtils.query(dataQuery, [userId, limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      views,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Get pending profiles for admin approval
  static async getPendingApprovals(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.verification_status = 'pending' AND u.is_active = TRUE
    `;

    const dataQuery = `
      SELECT p.*, u.email, u.full_name as user_full_name, u.phone, u.created_at as user_created_at
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.verification_status = 'pending' AND u.is_active = TRUE
      ORDER BY p.created_at ASC
      LIMIT ? OFFSET ?
    `;

    const [totalResult, profiles] = await Promise.all([
      DatabaseUtils.query(countQuery),
      DatabaseUtils.query(dataQuery, [limit, offset])
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      profiles,
      pagination: Helpers.generatePaginationMeta(page, limit, total)
    };
  }

  // Approve profile
  static async approve(profileId, adminId, notes = null) {
    await DatabaseUtils.update('profiles', {
      verification_status: 'approved',
      is_verified: true,
      updated_at: new Date()
    }, { id: profileId });

    // Log admin action
    await this.logAdminAction(adminId, 'profile_approved', profileId, { notes });

    return await this.findById(profileId);
  }

  // Reject profile
  static async reject(profileId, adminId, reason) {
    await DatabaseUtils.update('profiles', {
      verification_status: 'rejected',
      is_verified: false,
      updated_at: new Date()
    }, { id: profileId });

    // Log admin action
    await this.logAdminAction(adminId, 'profile_rejected', profileId, { reason });

    return await this.findById(profileId);
  }

  // Request changes for profile
  static async requestChanges(profileId, adminId, changes) {
    await DatabaseUtils.update('profiles', {
      verification_status: 'pending',
      updated_at: new Date()
    }, { id: profileId });

    // Log admin action
    await this.logAdminAction(adminId, 'profile_changes_requested', profileId, { changes });

    return await this.findById(profileId);
  }

  // Log admin action
  static async logAdminAction(adminId, action, profileId, data = {}) {
    try {
      await DatabaseUtils.insert('activity_logs', {
        admin_id: adminId,
        action: action,
        entity_type: 'profile',
        entity_id: profileId,
        new_values: JSON.stringify(data),
        created_at: new Date()
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }

  // Get profile statistics
  static async getStats() {
    const queries = [
      'SELECT COUNT(*) as total FROM profiles WHERE profile_completed = TRUE',
      'SELECT COUNT(*) as verified FROM profiles WHERE is_verified = TRUE',
      'SELECT COUNT(*) as pending FROM profiles WHERE verification_status = "pending"',
      'SELECT COUNT(*) as featured FROM profiles WHERE is_featured = TRUE AND featured_expiry > CURDATE()'
    ];

    const results = await Promise.all(
      queries.map(query => DatabaseUtils.query(query))
    );

    return {
      total: results[0][0]?.total || 0,
      verified: results[1][0]?.verified || 0,
      pending: results[2][0]?.pending || 0,
      featured: results[3][0]?.featured || 0
    };
  }

  // Get profiles by IDs
  static async findByIds(profileIds) {
    if (!profileIds || profileIds.length === 0) return [];
    
    const placeholders = profileIds.map(() => '?').join(',');
    const query = `
      SELECT p.*, u.email, u.gender, u.is_verified as user_verified
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.id IN (${placeholders}) AND u.is_active = TRUE
    `;

    return await DatabaseUtils.query(query, profileIds);
  }

  // Mark profile as featured
  static async markAsFeatured(profileId, expiryDate) {
    await DatabaseUtils.update('profiles', {
      is_featured: true,
      featured_expiry: expiryDate,
      updated_at: new Date()
    }, { id: profileId });

    return await this.findById(profileId);
  }

  // Remove featured status
  static async removeFeatured(profileId) {
    await DatabaseUtils.update('profiles', {
      is_featured: false,
      featured_expiry: null,
      updated_at: new Date()
    }, { id: profileId });

    return await this.findById(profileId);
  }
}

module.exports = Profile;