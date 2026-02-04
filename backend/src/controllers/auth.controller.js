const User = require('../models/user.model');
const JWTUtils = require('../utils/jwt');
const Helpers = require('../utils/helpers');

class AuthController {
  
  // User registration
  static async register(req, res) {
    try {
      const { email, password, fullName, phone, gender, dateOfBirth } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json(
          Helpers.formatError('Email already registered', 409)
        );
      }

      // Create new user
      const userData = {
        email,
        password,
        fullName,
        phone,
        gender,
        dateOfBirth
      };

      const user = await User.create(userData);

      // Generate JWT token
      const token = JWTUtils.generateUserToken({
        userId: user.id,
        email: user.email
      });

      // Generate refresh token
      const refreshToken = JWTUtils.generateRefreshToken({
        userId: user.id
      });

      res.status(201).json(
        Helpers.formatResponse(
          true,
          'User registered successfully',
          {
            user: {
              id: user.id,
              email: user.email,
              fullName: user.full_name,
              phone: user.phone,
              gender: user.gender,
              isVerified: user.is_verified,
              createdAt: user.created_at
            },
            token,
            refreshToken
          }
        )
      );
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json(
        Helpers.formatError('Registration failed', 500)
      );
    }
  }

  // User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmailForAuth(email);
      if (!user) {
        return res.status(401).json(
          Helpers.formatError('Invalid email or password', 401)
        );
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json(
          Helpers.formatError('Account is deactivated', 401)
        );
      }

      // Check if user is locked
      const isLocked = await User.isLocked(user.id);
      if (isLocked) {
        return res.status(423).json(
          Helpers.formatError('Account is temporarily locked due to multiple failed login attempts', 423)
        );
      }

      // Verify password
      const isPasswordValid = await Helpers.comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        // Increment login attempts
        await User.incrementLoginAttempts(user.id);
        return res.status(401).json(
          Helpers.formatError('Invalid email or password', 401)
        );
      }

      // Update last login and reset login attempts
      await User.updateLastLogin(user.id);

      // Generate JWT token
      const token = JWTUtils.generateUserToken({
        userId: user.id,
        email: user.email
      });

      // Generate refresh token
      const refreshToken = JWTUtils.generateRefreshToken({
        userId: user.id
      });

      // Remove password from response
      delete user.password_hash;

      res.json(
        Helpers.formatResponse(
          true,
          'Login successful',
          {
            user: {
              id: user.id,
              email: user.email,
              fullName: user.full_name,
              phone: user.phone,
              gender: user.gender,
              isVerified: user.is_verified,
              lastLogin: user.last_login,
              createdAt: user.created_at
            },
            token,
            refreshToken
          }
        )
      );
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(
        Helpers.formatError('Login failed', 500)
      );
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json(
          Helpers.formatError('Refresh token is required', 400)
        );
      }

      // Verify refresh token
      const { success, decoded, error } = JWTUtils.verifyRefreshToken(refreshToken);
      
      if (!success) {
        return res.status(401).json(
          Helpers.formatError(`Invalid refresh token: ${error}`, 401)
        );
      }

      // Check if user still exists and is active
      const user = await User.findById(decoded.userId);
      if (!user || !user.is_active) {
        return res.status(401).json(
          Helpers.formatError('User not found or inactive', 401)
        );
      }

      // Generate new tokens
      const newToken = JWTUtils.generateUserToken({
        userId: user.id,
        email: user.email
      });

      const newRefreshToken = JWTUtils.generateRefreshToken({
        userId: user.id
      });

      res.json(
        Helpers.formatResponse(
          true,
          'Token refreshed successfully',
          {
            token: newToken,
            refreshToken: newRefreshToken
          }
        )
      );
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json(
        Helpers.formatError('Token refresh failed', 500)
      );
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just return a success response
      res.json(
        Helpers.formatResponse(
          true,
          'Logout successful'
        )
      );
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json(
        Helpers.formatError('Logout failed', 500)
      );
    }
  }

  // Forgot password
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json(
          Helpers.formatResponse(
            true,
            'If the email exists, a password reset link has been sent'
          )
        );
      }

      // Generate reset token (in real implementation, save this to database with expiry)
      const resetToken = Helpers.generateRandomString(32);
      
      // In a real implementation, you would:
      // 1. Save the reset token to database with expiry time
      // 2. Send email with reset link containing the token
      
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      res.json(
        Helpers.formatResponse(
          true,
          'If the email exists, a password reset link has been sent',
          {
            // In development, return the token for testing
            ...(process.env.NODE_ENV === 'development' && { resetToken })
          }
        )
      );
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json(
        Helpers.formatError('Password reset request failed', 500)
      );
    }
  }

  // Reset password
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json(
          Helpers.formatError('Token and new password are required', 400)
        );
      }

      // In a real implementation, you would:
      // 1. Find the reset token in database
      // 2. Check if it's not expired
      // 3. Get the associated user
      // 4. Update the user's password
      // 5. Delete the reset token

      // For now, we'll simulate this process
      // In development, we'll accept any token for testing
      if (process.env.NODE_ENV === 'development') {
        // This is just for testing - find user by email in the token
        // In real implementation, you'd have a proper token system
        res.json(
          Helpers.formatResponse(
            true,
            'Password reset successful'
          )
        );
      } else {
        res.status(400).json(
          Helpers.formatError('Invalid or expired reset token', 400)
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json(
        Helpers.formatError('Password reset failed', 500)
      );
    }
  }

  // Verify email
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // In a real implementation, you would:
      // 1. Verify the email verification token
      // 2. Mark the user as verified
      // 3. Delete the verification token

      // For now, we'll simulate this
      if (req.user) {
        await User.verifyEmail(req.user.id);
        
        res.json(
          Helpers.formatResponse(
            true,
            'Email verified successfully'
          )
        );
      } else {
        res.status(400).json(
          Helpers.formatError('Invalid verification token', 400)
        );
      }
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json(
        Helpers.formatError('Email verification failed', 500)
      );
    }
  }

  // Resend verification email
  static async resendVerification(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json(
          Helpers.formatError('Authentication required', 401)
        );
      }

      if (req.user.is_verified) {
        return res.status(400).json(
          Helpers.formatError('Email is already verified', 400)
        );
      }

      // In a real implementation, you would:
      // 1. Generate a new verification token
      // 2. Save it to database
      // 3. Send verification email

      const verificationToken = Helpers.generateRandomString(32);
      console.log(`Verification token for ${req.user.email}: ${verificationToken}`);

      res.json(
        Helpers.formatResponse(
          true,
          'Verification email sent',
          {
            // In development, return the token for testing
            ...(process.env.NODE_ENV === 'development' && { verificationToken })
          }
        )
      );
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json(
        Helpers.formatError('Failed to send verification email', 500)
      );
    }
  }

  // Change password (authenticated user)
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!req.user) {
        return res.status(401).json(
          Helpers.formatError('Authentication required', 401)
        );
      }

      // Get user with password hash
      const user = await User.findByEmailForAuth(req.user.email);
      
      // Verify current password
      const isCurrentPasswordValid = await Helpers.comparePassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json(
          Helpers.formatError('Current password is incorrect', 400)
        );
      }

      // Update password
      await User.update(req.user.id, { password: newPassword });

      res.json(
        Helpers.formatResponse(
          true,
          'Password changed successfully'
        )
      );
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json(
        Helpers.formatError('Password change failed', 500)
      );
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json(
          Helpers.formatError('Authentication required', 401)
        );
      }

      const user = await User.findById(req.user.id);
      
      res.json(
        Helpers.formatResponse(
          true,
          'Profile retrieved successfully',
          {
            user: {
              id: user.id,
              email: user.email,
              fullName: user.full_name,
              phone: user.phone,
              gender: user.gender,
              dateOfBirth: user.date_of_birth,
              isVerified: user.is_verified,
              isActive: user.is_active,
              lastLogin: user.last_login,
              createdAt: user.created_at
            }
          }
        )
      );
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json(
        Helpers.formatError('Failed to retrieve profile', 500)
      );
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json(
          Helpers.formatError('Authentication required', 401)
        );
      }

      const { fullName, phone, dateOfBirth } = req.body;
      
      const updateData = Helpers.cleanObject({
        full_name: fullName,
        phone,
        date_of_birth: dateOfBirth
      });

      const updatedUser = await User.update(req.user.id, updateData);

      res.json(
        Helpers.formatResponse(
          true,
          'Profile updated successfully',
          {
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              fullName: updatedUser.full_name,
              phone: updatedUser.phone,
              gender: updatedUser.gender,
              dateOfBirth: updatedUser.date_of_birth,
              isVerified: updatedUser.is_verified,
              isActive: updatedUser.is_active,
              lastLogin: updatedUser.last_login,
              createdAt: updatedUser.created_at
            }
          }
        )
      );
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json(
        Helpers.formatError('Profile update failed', 500)
      );
    }
  }
}

module.exports = AuthController;