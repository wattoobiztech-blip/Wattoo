const jwt = require('jsonwebtoken');
const config = require('../config/env');

class JWTUtils {
  
  // Generate user JWT token
  static generateUserToken(payload) {
    return jwt.sign(
      { 
        userId: payload.userId,
        email: payload.email,
        type: 'user'
      },
      config.jwt.secret,
      { 
        expiresIn: config.jwt.expiresIn,
        issuer: 'rishta-app',
        audience: 'rishta-users'
      }
    );
  }

  // Generate admin JWT token
  static generateAdminToken(payload) {
    return jwt.sign(
      { 
        adminId: payload.adminId,
        username: payload.username,
        role: payload.role,
        type: 'admin'
      },
      config.adminJwt.secret,
      { 
        expiresIn: config.adminJwt.expiresIn,
        issuer: 'rishta-admin',
        audience: 'rishta-admins'
      }
    );
  }

  // Verify user token
  static verifyUserToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret, {
        issuer: 'rishta-app',
        audience: 'rishta-users'
      });
      
      if (decoded.type !== 'user') {
        throw new Error('Invalid token type');
      }
      
      return { success: true, decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Verify admin token
  static verifyAdminToken(token) {
    try {
      const decoded = jwt.verify(token, config.adminJwt.secret, {
        issuer: 'rishta-admin',
        audience: 'rishta-admins'
      });
      
      if (decoded.type !== 'admin') {
        throw new Error('Invalid token type');
      }
      
      return { success: true, decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    return jwt.sign(
      { 
        userId: payload.userId,
        type: 'refresh'
      },
      config.jwt.secret,
      { 
        expiresIn: '30d',
        issuer: 'rishta-app'
      }
    );
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret, {
        issuer: 'rishta-app'
      });
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }
      
      return { success: true, decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Decode token without verification (for debugging)
  static decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Get token expiry time
  static getTokenExpiry(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = JWTUtils;