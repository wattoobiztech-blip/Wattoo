-- Seed data for Rishta Matrimonial Platform
USE rishta;

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT IGNORE INTO admin_users (username, email, password_hash, full_name, role, permissions, created_at)
VALUES (
  'admin',
  'admin@rishta.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G',
  'System Administrator',
  'super_admin',
  '["all"]',
  NOW()
);

-- Insert sample subscription plans data (this would typically be in a separate plans table)
-- For now, we'll add some sample users and profiles for testing

-- Sample users (passwords are 'password123' hashed)
INSERT IGNORE INTO users (email, password_hash, full_name, phone, gender, date_of_birth, is_active, is_verified, created_at)
VALUES 
  ('john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', 'John Doe', '+1234567890', 'male', '1990-05-15', TRUE, TRUE, NOW()),
  ('jane.smith@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', 'Jane Smith', '+1234567891', 'female', '1992-08-22', TRUE, TRUE, NOW()),
  ('mike.johnson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', 'Mike Johnson', '+1234567892', 'male', '1988-12-10', TRUE, TRUE, NOW()),
  ('sarah.wilson@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', 'Sarah Wilson', '+1234567893', 'female', '1995-03-18', TRUE, TRUE, NOW());

-- Sample profiles
INSERT IGNORE INTO profiles (user_id, name, age, cast, religion, height, city, state, country, education, job_business, job_title, income_annual, about_me, profile_completed, is_verified, verification_status, created_at)
VALUES 
  (1, 'John Doe', 34, 'General', 'Christian', '5\'10"', 'New York', 'NY', 'USA', 'Masters in Engineering', 'job', 'Software Engineer', 85000.00, 'Looking for a life partner who shares similar values and interests.', TRUE, TRUE, 'approved', NOW()),
  (2, 'Jane Smith', 32, 'General', 'Christian', '5\'6"', 'Los Angeles', 'CA', 'USA', 'MBA', 'job', 'Marketing Manager', 75000.00, 'Family-oriented person seeking a caring and understanding partner.', TRUE, TRUE, 'approved', NOW()),
  (3, 'Mike Johnson', 36, 'General', 'Christian', '6\'0"', 'Chicago', 'IL', 'USA', 'Bachelors in Business', 'business', 'Business Owner', 120000.00, 'Entrepreneur looking for someone who appreciates hard work and dedication.', TRUE, TRUE, 'approved', NOW()),
  (4, 'Sarah Wilson', 29, 'General', 'Christian', '5\'4"', 'Houston', 'TX', 'USA', 'Masters in Psychology', 'job', 'Clinical Psychologist', 68000.00, 'Compassionate professional seeking a meaningful relationship.', TRUE, TRUE, 'approved', NOW());

-- Sample subscriptions
INSERT IGNORE INTO subscriptions (user_id, plan_type, start_date, end_date, status, amount, currency, features, created_at)
VALUES 
  (1, 'golden', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 'active', 29.99, 'USD', '["unlimited_matches", "priority_support", "profile_boost"]', NOW()),
  (2, 'diamond', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 'active', 49.99, 'USD', '["unlimited_matches", "priority_support", "profile_boost", "advanced_search", "read_receipts"]', NOW()),
  (3, 'elite', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 12 MONTH), 'active', 99.99, 'USD', '["unlimited_matches", "priority_support", "profile_boost", "advanced_search", "read_receipts", "personal_matchmaker", "exclusive_events"]', NOW()),
  (4, 'free', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'active', 0.00, 'USD', '["basic_matches", "limited_search"]', NOW());

-- Sample profile views
INSERT IGNORE INTO profile_views (viewer_user_id, viewed_profile_id, viewed_at, ip_address)
VALUES 
  (1, 2, NOW(), '192.168.1.1'),
  (1, 4, NOW(), '192.168.1.1'),
  (2, 1, NOW(), '192.168.1.2'),
  (2, 3, NOW(), '192.168.1.2'),
  (3, 2, NOW(), '192.168.1.3'),
  (3, 4, NOW(), '192.168.1.3'),
  (4, 1, NOW(), '192.168.1.4'),
  (4, 3, NOW(), '192.168.1.4');

-- Sample interests
INSERT IGNORE INTO interests (user_id, interest_user_id, status, message, created_at)
VALUES 
  (1, 2, 'pending', 'Hi, I would like to connect with you. Your profile seems very interesting!', NOW()),
  (3, 4, 'accepted', 'Hello, I think we have a lot in common. Would love to get to know you better.', NOW()),
  (2, 3, 'pending', 'Your entrepreneurial spirit is inspiring. Would like to connect.', NOW());

-- Update profile view counts
UPDATE profiles SET profile_views = (
  SELECT COUNT(*) FROM profile_views WHERE viewed_profile_id = profiles.id
);

-- Sample admin comments
INSERT IGNORE INTO admin_comments (profile_id, admin_id, comment, category, created_at)
VALUES 
  (1, 1, 'Profile verified successfully. All documents are authentic.', 'verification', NOW()),
  (2, 1, 'Background check completed. No issues found.', 'background_check', NOW()),
  (3, 1, 'Business verification completed successfully.', 'verification', NOW()),
  (4, 1, 'Professional credentials verified.', 'verification', NOW());