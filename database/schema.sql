-- Rishta Matrimonial Database Schema
-- MariaDB/MySQL Compatible

-- Create database
CREATE DATABASE IF NOT EXISTS rishta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rishta;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  gender ENUM('male', 'female', 'other'),
  date_of_birth DATE,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP NULL,
  phone_verified_at TIMESTAMP NULL,
  last_login TIMESTAMP NULL,
  login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  name VARCHAR(100) NOT NULL,
  age INT,
  cast VARCHAR(50),
  religion VARCHAR(50),
  height VARCHAR(20),
  weight VARCHAR(20),
  color VARCHAR(30),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  other_nationality VARCHAR(100),
  job_business ENUM('job', 'business'),
  job_title VARCHAR(100),
  job_company VARCHAR(100),
  company_address TEXT,
  business_name VARCHAR(100),
  business_type VARCHAR(100),
  business_address TEXT,
  income_monthly DECIMAL(12,2),
  income_annual DECIMAL(12,2),
  education VARCHAR(100),
  about_me TEXT,
  looking_for TEXT,
  hobbies TEXT,
  languages_spoken TEXT,
  marital_status ENUM('never_married', 'divorced', 'widowed') DEFAULT 'never_married',
  children INT DEFAULT 0,
  smoking ENUM('never', 'occasionally', 'regularly') DEFAULT 'never',
  drinking ENUM('never', 'occasionally', 'regularly') DEFAULT 'never',
  picture_url TEXT,
  gallery_images TEXT,
  profile_completed BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  featured_expiry DATE NULL,
  profile_views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  plan_type ENUM('free', 'golden', 'diamond', 'elite') DEFAULT 'free',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'active',
  payment_method VARCHAR(50),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  transaction_id VARCHAR(100),
  auto_renew BOOLEAN DEFAULT FALSE,
  features TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Profile views table
CREATE TABLE IF NOT EXISTS profile_views (
  id INT PRIMARY KEY AUTO_INCREMENT,
  viewer_user_id INT,
  viewed_profile_id INT,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (viewer_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (viewed_profile_id) REFERENCES profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Interests table
CREATE TABLE IF NOT EXISTS interests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  interest_user_id INT,
  status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
  message TEXT,
  responded_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (interest_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  subscription_id INT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE,
  gateway_response TEXT,
  status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
  failure_reason TEXT,
  refund_amount DECIMAL(10,2),
  refunded_at TIMESTAMP NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('super_admin', 'admin', 'moderator', 'support') DEFAULT 'admin',
  permissions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin comments table
CREATE TABLE IF NOT EXISTS admin_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT,
  admin_id INT,
  comment TEXT NOT NULL,
  category ENUM('background_check', 'verification', 'support', 'matchmaking', 'red_flag', 'general') DEFAULT 'general',
  is_resolved BOOLEAN DEFAULT FALSE,
  attachments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User reports table
CREATE TABLE IF NOT EXISTS user_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reported_user_id INT,
  reporter_user_id INT,
  reason VARCHAR(255) NOT NULL,
  category ENUM('inappropriate_behavior', 'fake_profile', 'harassment', 'spam', 'other') NOT NULL,
  description TEXT,
  evidence TEXT,
  status ENUM('pending', 'reviewed', 'resolved', 'dismissed') DEFAULT 'pending',
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  admin_notes TEXT,
  reviewed_by INT,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  admin_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  old_values TEXT,
  new_values TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;