const JWTUtils = require('../utils/jwt');
const User = require('../models/user.model');
const Helpers = require('../utils/helpers');

// User authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        Helpers.formatError('Access denied. No token provided.', 401)
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json(
        Helpers.formatError('Access denied. Invalid token format.', 401)
      );
    }

    // Verify token
    const { success, decoded, error } = JWTUtils.verifyUserToken(token);
    
    if (!success) {
      return res.status(401).json(
        Helpers.formatError(`Invalid token: ${error}`, 401)
      );
    }

    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json(
        Helpers.formatError('User not found.', 401)
      );
    }

    if (!user.is_active) {
      return res.status(401).json(
        Helpers.formatError('Account is deactivated.', 401)
      );
    }

    // Check if user is locked
    const isLocked = await User.isLocked(decoded.userId);
    if (isLocked) {
      return res.status(423).json(
        Helpers.formatError('Account is temporarily locked due to multiple failed login attempts.', 423)
      );
    }

    // Attach user info to request
    req.user = user;
    req.token = token;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json(
      Helpers.formatError('Authentication failed.', 500)
    );
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next(); // Continue without authentication
    }

    // Verify token
    const { success, decoded } = JWTUtils.verifyUserToken(token);
    
    if (success) {
      // Check if user exists and is active
      const user = await User.findById(decoded.userId);
      
      if (user && user.is_active) {
        const isLocked = await User.isLocked(decoded.userId);
        if (!isLocked) {
          req.user = user;
          req.token = token;
          req.userId = user.id;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication on error
    next();
  }
};

// Check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      Helpers.formatError('Authentication required.', 401)
    );
  }

  if (!req.user.is_verified) {
    return res.status(403).json(
      Helpers.formatError('Email verification required.', 403)
    );
  }

  next();
};

// Check subscription level
const requireSubscription = (requiredPlans = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json(
          Helpers.formatError('Authentication required.', 401)
        );
      }

      const Subscription = require('../models/subscription.model');
      const subscription = await Subscription.findActiveByUserId(req.userId);
      
      const currentPlan = subscription ? subscription.plan_type : 'free';
      
      if (!requiredPlans.includes(currentPlan)) {
        return res.status(403).json(
          Helpers.formatError(`This feature requires ${requiredPlans.join(' or ')} subscription.`, 403)
        );
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      return res.status(500).json(
        Helpers.formatError('Subscription verification failed.', 500)
      );
    }
  };
};

// Rate limiting for specific actions
const rateLimitAction = (action, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = `${req.ip}_${action}_${req.userId || 'anonymous'}`;
    const now = Date.now();
    
    // Clean old entries
    for (const [k, v] of attempts.entries()) {
      if (now - v.firstAttempt > windowMs) {
        attempts.delete(k);
      }
    }

    const userAttempts = attempts.get(key);
    
    if (!userAttempts) {
      attempts.set(key, { count: 1, firstAttempt: now });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      const timeLeft = Math.ceil((windowMs - (now - userAttempts.firstAttempt)) / 1000 / 60);
      return res.status(429).json(
        Helpers.formatError(`Too many ${action} attempts. Try again in ${timeLeft} minutes.`, 429)
      );
    }

    userAttempts.count++;
    next();
  };
};

// Check profile completion
const requireProfileCompletion = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json(
        Helpers.formatError('Authentication required.', 401)
      );
    }

    const Profile = require('../models/profile.model');
    const profile = await Profile.findByUserId(req.userId);
    
    if (!profile || !profile.profile_completed) {
      return res.status(403).json(
        Helpers.formatError('Profile completion required to access this feature.', 403)
      );
    }

    req.profile = profile;
    next();
  } catch (error) {
    console.error('Profile completion check error:', error);
    return res.status(500).json(
      Helpers.formatError('Profile verification failed.', 500)
    );
  }
};

// Usage limit middleware
const checkUsageLimit = (limitType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json(
          Helpers.formatError('Authentication required.', 401)
        );
      }

      const Subscription = require('../models/subscription.model');
      const limits = await Subscription.getUsageLimits(req.userId);
      
      // Check specific limit type
      switch (limitType) {
        case 'profile_views':
          // Implementation would check daily profile views against limit
          if (limits.profileViews !== -1) {
            // Check current usage and compare with limit
            // This is a simplified check - implement actual usage tracking
          }
          break;
        
        case 'interests_per_day':
          // Implementation would check daily interests sent against limit
          if (limits.interestsPerDay !== -1) {
            // Check current usage and compare with limit
          }
          break;
      }

      req.usageLimits = limits;
      next();
    } catch (error) {
      console.error('Usage limit check error:', error);
      return res.status(500).json(
        Helpers.formatError('Usage limit verification failed.', 500)
      );
    }
  };
};

// Log user activity
const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        const User = require('../models/user.model');
        // Log user activity - implement based on requirements
        console.log(`User ${req.userId} performed action: ${action}`);
      }
      next();
    } catch (error) {
      // Don't fail the request if logging fails
      console.error('Activity logging error:', error);
      next();
    }
  };
};

module.exports = {
  authenticateUser,
  optionalAuth,
  requireVerification,
  requireSubscription,
  rateLimitAction,
  requireProfileCompletion,
  checkUsageLimit,
  logActivity
};