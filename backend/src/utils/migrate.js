const { pool } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

// Database migration script
class DatabaseMigration {
  
  static async createDatabase() {
    try {
      // Create database if it doesn't exist
      await pool.execute(`CREATE DATABASE IF NOT EXISTS rishta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log('✅ Database created/verified successfully');
    } catch (error) {
      console.error('❌ Database creation failed:', error.message);
      throw error;
    }
  }

  static async createTables() {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_active (is_active),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Profiles table
      `CREATE TABLE IF NOT EXISTS profiles (
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
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_age (age),
        INDEX idx_religion (religion),
        INDEX idx_city (city),
        INDEX idx_verified (is_verified),
        INDEX idx_featured (is_featured),
        INDEX idx_completed (profile_completed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Subscriptions table
      `CREATE TABLE IF NOT EXISTS subscriptions (
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
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_plan_type (plan_type),
        INDEX idx_status (status),
        INDEX idx_end_date (end_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Profile views table (MariaDB compatible)
      `CREATE TABLE IF NOT EXISTS profile_views (
        id INT PRIMARY KEY AUTO_INCREMENT,
        viewer_user_id INT,
        viewed_profile_id INT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        FOREIGN KEY (viewer_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (viewed_profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        INDEX idx_viewer (viewer_user_id),
        INDEX idx_viewed (viewed_profile_id),
        INDEX idx_viewed_at (viewed_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Interests/Match requests table
      `CREATE TABLE IF NOT EXISTS interests (
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
        FOREIGN KEY (interest_user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_interest_user_id (interest_user_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        UNIQUE KEY unique_interest (user_id, interest_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Payments table
      `CREATE TABLE IF NOT EXISTS payments (
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
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_subscription_id (subscription_id),
        INDEX idx_status (status),
        INDEX idx_payment_date (payment_date),
        INDEX idx_transaction_id (transaction_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Admin users table
      `CREATE TABLE IF NOT EXISTS admin_users (
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Admin comments table
      `CREATE TABLE IF NOT EXISTS admin_comments (
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
        FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
        INDEX idx_profile_id (profile_id),
        INDEX idx_admin_id (admin_id),
        INDEX idx_category (category),
        INDEX idx_resolved (is_resolved),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // User reports table
      `CREATE TABLE IF NOT EXISTS user_reports (
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
        FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL,
        INDEX idx_reported_user (reported_user_id),
        INDEX idx_reporter_user (reporter_user_id),
        INDEX idx_status (status),
        INDEX idx_severity (severity),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Search preferences table
      `CREATE TABLE IF NOT EXISTS search_preferences (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE,
        min_age INT,
        max_age INT,
        preferred_religion VARCHAR(50),
        preferred_cast VARCHAR(50),
        preferred_cities TEXT,
        preferred_states TEXT,
        preferred_countries TEXT,
        min_height VARCHAR(20),
        max_height VARCHAR(20),
        education_preference VARCHAR(100),
        income_preference DECIMAL(12,2),
        marital_status_preference TEXT,
        smoking_preference ENUM('any', 'never', 'occasionally'),
        drinking_preference ENUM('any', 'never', 'occasionally'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

      // Activity logs table
      `CREATE TABLE IF NOT EXISTS activity_logs (
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
        FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_admin_id (admin_id),
        INDEX idx_action (action),
        INDEX idx_entity (entity_type, entity_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ];

    try {
      for (const [index, tableSQL] of tables.entries()) {
        await pool.execute(tableSQL);
        console.log(`✅ Table ${index + 1}/${tables.length} created successfully`);
      }
      console.log('✅ All tables created successfully');
    } catch (error) {
      console.error('❌ Table creation failed:', error.message);
      throw error;
    }
  }

  static async seedDefaultData() {
    try {
      // Create default admin user
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123', 12);
      
      await pool.execute(`
        INSERT IGNORE INTO admin_users (username, email, password_hash, full_name, role, permissions, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [
        'admin',
        'admin@rishta.com',
        adminPassword,
        'System Administrator',
        'super_admin',
        JSON.stringify(['all'])
      ]);

      // Create sample subscription plans data (this would typically be in a separate plans table)
      console.log('✅ Default admin user created (username: admin, password: admin123)');
      
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      throw error;
    }
  }

  static async runMigration() {
    try {
      console.log('🚀 Starting database migration...');
      
      await this.createDatabase();
      await this.createTables();
      await this.seedDefaultData();
      
      console.log('✅ Database migration completed successfully!');
      console.log('\n📋 Migration Summary:');
      console.log('- Database: rishta');
      console.log('- Tables: 11 tables created');
      console.log('- Default admin: admin@rishta.com (password: admin123)');
      console.log('\n🔗 You can now start the server with: npm run dev');
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    } finally {
      await pool.end();
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  DatabaseMigration.runMigration();
}

module.exports = DatabaseMigration;