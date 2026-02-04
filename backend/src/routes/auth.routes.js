const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const { authenticateUser } = require('../middleware/auth.middleware');
const { validate, validateRequired, validateEmailFormat, validateStringLength } = require('../middleware/validation.middleware');
const ValidationUtils = require('../utils/validation');

// User Registration
router.post('/register', [
  ValidationUtils.validateRegistration(),
  validate
], AuthController.register);

// User Login
router.post('/login', [
  ValidationUtils.validateLogin(),
  validate
], AuthController.login);

// Refresh Token
router.post('/refresh', [
  validateRequired(['refreshToken']),
  validate
], AuthController.refreshToken);

// Logout
router.post('/logout', authenticateUser, AuthController.logout);

// Forgot Password
router.post('/forgot-password', [
  ValidationUtils.validateEmail(),
  validate
], AuthController.forgotPassword);

// Reset Password
router.post('/reset-password', [
  validateRequired(['token', 'newPassword']),
  ValidationUtils.validatePassword(),
  validate
], AuthController.resetPassword);

// Verify Email
router.get('/verify-email/:token', AuthController.verifyEmail);

// Resend Verification Email
router.post('/resend-verification', authenticateUser, AuthController.resendVerification);

// Change Password (authenticated user)
router.post('/change-password', [
  authenticateUser,
  validateRequired(['currentPassword', 'newPassword']),
  ValidationUtils.validatePassword(),
  validate
], AuthController.changePassword);

// Get Current User Profile
router.get('/profile', authenticateUser, AuthController.getProfile);

// Update User Profile
router.put('/profile', [
  authenticateUser,
  validateStringLength('fullName', 2, 100),
  validate
], AuthController.updateProfile);

module.exports = router;