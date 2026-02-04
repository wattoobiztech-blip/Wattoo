const JWTUtils = require('../utils/jwt');
const Admin = require('../models/admin.model');
const Helpers = require('../utils/helpers');

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        Helpers.formatError('Access denied. No admin token provided.', 401)
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json(
        Helpers.formatError('Access denied. Invalid token format.', 401)
      );
    }

    // Verify admin token
    const { success, decoded, error } = JWTUtils.verifyAdminToken(token);
    
    if (!success) {
      return res.status(401).json(
        Helpers.formatError(`Invalid admin token: ${error}`, 401)
      );
    }

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      return res.status(401).json(
        Helpers.formatError('Admin not found.', 401)
      );
    }

    if (!admin.is_active) {
      return res.status(401).json(
        Helpers.formatError('Admin account is deactivated.', 401)
      );
    }

    // Check if admin is locked
    const isLocked = await Admin.isLocked(decoded.adminId);
    if (isLocked) {
      return res.status(423).json(
        Helpers.formatError('Admin account is temporarily locked due to multiple failed login attempts.', 423)
      );
    }

    // Attach admin info to request
    req.admin = admin;
    req.token = token;
    req.adminId = admin.id;

    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(500).json(
      Helpers.formatError('Admin authentication failed.', 500)
    );
  }
};

// Check admin permissions
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json(
          Helpers.formatError('Admin authentication required.', 401)
        );
      }

      const hasPermission = await Admin.hasPermission(req.adminId, permission);
      
      if (!hasPermission) {
        return res.status(403).json(
          Helpers.formatError(`Insufficient permissions. Required: ${permission}`, 403)
        );
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json(
        Helpers.formatError('Permission verification failed.', 500)
      );
    }
  };
};

// Check admin role
const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json(
        Helpers.formatError('Admin authentication required.', 401)
      );
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json(
        Helpers.formatError(`Insufficient role. Required: ${allowedRoles.join(' or ')}`, 403)
      );
    }

    next();
  };
};

// Super admin only middleware
const requireSuperAdmin = requireRole('super_admin');

// Admin or super admin middleware
const requireAdminOrAbove = requireRole(['admin', 'super_admin']);

// Log admin activity
const logAdminActivity = (action) => {
  return async (req, res, next) => {
    try {
      if (req.admin) {
        // Store original res.json to intercept response
        const originalJson = res.json;
        
        res.json = function(data) {
          // Log the activity after successful response
          if (res.statusCode >= 200 && res.statusCode < 300) {
            Admin.logActivity(
              req.adminId,
              action,
              req.params.entityType || null,
              req.params.id || req.params.userId || req.params.profileId || null,
              req.body.oldValues || null,
              req.body,
              Helpers.getClientIP(req),
              req.get('User-Agent')
            ).catch(error => {
              console.error('Admin activity logging error:', error);
            });
          }
          
          // Call original json method
          return originalJson.call(this, data);
        };
      }
      
      next();
    } catch (error) {
      // Don't fail the request if logging setup fails
      console.error('Admin activity logging setup error:', error);
      next();
    }
  };
};

// Rate limiting for admin actions
const adminRateLimit = (maxAttempts = 100, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = `admin_${req.adminId || req.ip}`;
    const now = Date.now();
    
    // Clean old entries
    for (const [k, v] of attempts.entries()) {
      if (now - v.firstAttempt > windowMs) {
        attempts.delete(k);
      }
    }

    const adminAttempts = attempts.get(key);
    
    if (!adminAttempts) {
      attempts.set(key, { count: 1, firstAttempt: now });
      return next();
    }

    if (adminAttempts.count >= maxAttempts) {
      const timeLeft = Math.ceil((windowMs - (now - adminAttempts.firstAttempt)) / 1000 / 60);
      return res.status(429).json(
        Helpers.formatError(`Too many admin requests. Try again in ${timeLeft} minutes.`, 429)
      );
    }

    adminAttempts.count++;
    next();
  };
};

// Validate admin action on user
const validateUserAction = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.params.id;
    
    if (!userId) {
      return res.status(400).json(
        Helpers.formatError('User ID is required.', 400)
      );
    }

    const User = require('../models/user.model');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json(
        Helpers.formatError('User not found.', 404)
      );
    }

    req.targetUser = user;
    next();
  } catch (error) {
    console.error('User validation error:', error);
    return res.status(500).json(
      Helpers.formatError('User validation failed.', 500)
    );
  }
};

// Validate admin action on profile
const validateProfileAction = async (req, res, next) => {
  try {
    const profileId = req.params.profileId || req.params.id;
    
    if (!profileId) {
      return res.status(400).json(
        Helpers.formatError('Profile ID is required.', 400)
      );
    }

    const Profile = require('../models/profile.model');
    const profile = await Profile.findById(profileId);
    
    if (!profile) {
      return res.status(404).json(
        Helpers.formatError('Profile not found.', 404)
      );
    }

    req.targetProfile = profile;
    next();
  } catch (error) {
    console.error('Profile validation error:', error);
    return res.status(500).json(
      Helpers.formatError('Profile validation failed.', 500)
    );
  }
};

// Check if admin can modify target admin (prevent lower role from modifying higher role)
const validateAdminHierarchy = async (req, res, next) => {
  try {
    const targetAdminId = req.params.adminId || req.params.id;
    
    if (!targetAdminId) {
      return res.status(400).json(
        Helpers.formatError('Admin ID is required.', 400)
      );
    }

    const targetAdmin = await Admin.findById(targetAdminId);
    
    if (!targetAdmin) {
      return res.status(404).json(
        Helpers.formatError('Target admin not found.', 404)
      );
    }

    // Super admin can modify anyone
    if (req.admin.role === 'super_admin') {
      req.targetAdmin = targetAdmin;
      return next();
    }

    // Admin can only modify moderators and support
    if (req.admin.role === 'admin') {
      if (['moderator', 'support'].includes(targetAdmin.role)) {
        req.targetAdmin = targetAdmin;
        return next();
      }
    }

    // Moderators and support cannot modify other admins
    return res.status(403).json(
      Helpers.formatError('Insufficient permissions to modify this admin.', 403)
    );
  } catch (error) {
    console.error('Admin hierarchy validation error:', error);
    return res.status(500).json(
      Helpers.formatError('Admin hierarchy validation failed.', 500)
    );
  }
};

// Sanitize admin input
const sanitizeAdminInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = Helpers.sanitizeObject(req.body);
  }
  
  if (req.query && typeof req.query === 'object') {
    req.query = Helpers.sanitizeObject(req.query);
  }
  
  next();
};

// Admin session timeout check
const checkSessionTimeout = (timeoutMs = 24 * 60 * 60 * 1000) => { // 24 hours default
  return (req, res, next) => {
    try {
      if (!req.admin || !req.admin.last_login) {
        return next();
      }

      const lastLogin = new Date(req.admin.last_login);
      const now = new Date();
      const timeDiff = now.getTime() - lastLogin.getTime();

      if (timeDiff > timeoutMs) {
        return res.status(401).json(
          Helpers.formatError('Admin session has expired. Please login again.', 401)
        );
      }

      next();
    } catch (error) {
      console.error('Session timeout check error:', error);
      next(); // Continue on error
    }
  };
};

module.exports = {
  authenticateAdmin,
  requirePermission,
  requireRole,
  requireSuperAdmin,
  requireAdminOrAbove,
  logAdminActivity,
  adminRateLimit,
  validateUserAction,
  validateProfileAction,
  validateAdminHierarchy,
  sanitizeAdminInput,
  checkSessionTimeout
};