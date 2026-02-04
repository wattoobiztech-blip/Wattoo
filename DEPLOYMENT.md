# Rishta Matrimonial Platform - Deployment Guide

This guide covers the complete deployment process for the Rishta Matrimonial Platform, including local development, testing, and production deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Docker Deployment](#docker-deployment)
6. [Production Deployment](#production-deployment)
7. [Testing Strategy](#testing-strategy)
8. [Monitoring & Logging](#monitoring--logging)
9. [Security Configuration](#security-configuration)
10. [Backup & Recovery](#backup--recovery)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: 18.x or higher
- **Database**: MySQL 8.0+ or MariaDB 10.6+
- **Docker**: 20.10+ (for containerized deployment)
- **Docker Compose**: 2.0+
- **Nginx**: 1.20+ (for production)

### Development Tools
- **Git**: Version control
- **npm**: Package manager
- **Postman**: API testing (optional)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rishta-matrimonial
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend Environment (.env.local)
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rishta Matrimonial
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_MOCK_PAYMENTS=true
```

#### Backend Environment (backend/.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=rishta
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_JWT_SECRET=admin_secret_key_change_this
FRONTEND_URL=http://localhost:3000
```

## Database Setup

### Option 1: XAMPP/Local MySQL

1. **Start XAMPP**
   - Start Apache and MySQL services
   - Access phpMyAdmin at `http://localhost/phpmyadmin`

2. **Run Database Migration**
   ```bash
   cd backend
   npm run migrate:simple
   ```

3. **Verify Database**
   - Check that `rishta` database is created
   - Verify all 10 tables are present
   - Default admin user: `admin@rishta.com` / `admin123`

### Option 2: Docker MySQL

```bash
docker run --name rishta-mysql \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=rishta \
  -e MYSQL_USER=rishta_user \
  -e MYSQL_PASSWORD=user_password \
  -p 3306:3306 \
  -d mysql:8.0
```

## Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

#### Start Frontend Server
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
npm run build
npm start
```

#### Start Backend
```bash
cd backend
npm start
```

## Docker Deployment

### 1. Environment Setup

Create `.env` file in root directory:
```env
# Database
MYSQL_ROOT_PASSWORD=secure_root_password_change_this
MYSQL_DATABASE=rishta
MYSQL_USER=rishta_user
MYSQL_PASSWORD=secure_user_password_change_this

# Application
NODE_ENV=production
JWT_SECRET=your_production_jwt_secret_change_this
ADMIN_JWT_SECRET=admin_production_secret_change_this
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 2. Build and Start Services
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Initialize Database
```bash
# Run migration inside backend container
docker-compose exec backend npm run migrate:simple
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin
- **Database**: localhost:3306

## Production Deployment

### 1. Server Setup

#### System Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB minimum
- **CPU**: 2 cores minimum

#### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. SSL Certificate Setup

#### Using Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Update Nginx Configuration
Uncomment HTTPS section in `nginx/conf.d/default.conf` and update domain names.

### 3. Production Environment

Create production `.env`:
```env
NODE_ENV=production
MYSQL_ROOT_PASSWORD=very_secure_root_password
MYSQL_DATABASE=rishta
MYSQL_USER=rishta_user
MYSQL_PASSWORD=very_secure_user_password
JWT_SECRET=production_jwt_secret_256_bit_key
ADMIN_JWT_SECRET=admin_production_secret_256_bit_key
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### 4. Deploy Application
```bash
# Clone repository
git clone <repository-url> /opt/rishta
cd /opt/rishta

# Set up environment
cp .env.production .env

# Deploy with Docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Initialize database
docker-compose exec backend npm run migrate:simple
```

## Testing Strategy

### 1. Unit Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

### 2. Integration Tests
```bash
# API integration tests
cd backend
npm run test:integration
```

### 3. End-to-End Tests
```bash
# E2E tests with Cypress
npm run test:e2e
```

### 4. Load Testing
```bash
# Using Artillery
npm install -g artillery
artillery run load-test.yml
```

## Monitoring & Logging

### 1. Application Logs
```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Log files location
./backend/logs/
```

### 2. Database Monitoring
```bash
# MySQL performance
docker-compose exec mysql mysql -u root -p -e "SHOW PROCESSLIST;"
```

### 3. System Monitoring
- **CPU/Memory**: Use `htop` or `top`
- **Disk Usage**: Use `df -h`
- **Network**: Use `netstat -tulpn`

### 4. Health Checks
- **Frontend**: http://localhost:3000/api/health
- **Backend**: http://localhost:5000/health
- **Database**: Check connection in backend logs

## Security Configuration

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique passwords
- Rotate JWT secrets regularly

### 2. Database Security
```sql
-- Create dedicated database user
CREATE USER 'rishta_user'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON rishta.* TO 'rishta_user'@'%';
FLUSH PRIVILEGES;
```

### 3. Nginx Security Headers
Already configured in `nginx/conf.d/default.conf`:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy

### 4. Rate Limiting
Configured in Nginx:
- API endpoints: 10 requests/second
- Login endpoint: 5 requests/minute

## Backup & Recovery

### 1. Database Backup
```bash
# Create backup
docker-compose exec mysql mysqldump -u root -p rishta > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup
echo "0 2 * * * /opt/rishta/scripts/backup.sh" | crontab -
```

### 2. File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### 3. Recovery Process
```bash
# Restore database
docker-compose exec -T mysql mysql -u root -p rishta < backup_file.sql

# Restore files
tar -xzf uploads_backup.tar.gz
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
docker-compose ps mysql

# Check database logs
docker-compose logs mysql

# Test connection
docker-compose exec backend npm run test:db
```

#### 2. Frontend Build Errors
```bash
# Clear cache
npm run clean
rm -rf .next node_modules
npm install
npm run build
```

#### 3. Backend API Errors
```bash
# Check backend logs
docker-compose logs backend

# Restart backend service
docker-compose restart backend
```

#### 4. Nginx Configuration Issues
```bash
# Test nginx configuration
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose exec nginx nginx -s reload
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_profiles_age_religion ON profiles(age, religion);
CREATE INDEX idx_users_active_verified ON users(is_active, is_verified);
```

#### 2. Frontend Optimization
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Implement caching strategies

#### 3. Backend Optimization
- Implement Redis caching
- Use connection pooling
- Optimize database queries
- Enable compression middleware

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Check application logs
   - Monitor disk usage
   - Review security logs

2. **Monthly**
   - Update dependencies
   - Review performance metrics
   - Backup verification

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Disaster recovery testing

### Getting Help

- **Documentation**: Check this deployment guide
- **Logs**: Always check application and system logs first
- **Community**: Search for similar issues online
- **Support**: Contact the development team

---

## Quick Reference

### Useful Commands
```bash
# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database migration
cd backend && npm run migrate:simple

# Docker deployment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Default Credentials
- **Admin Panel**: admin@rishta.com / admin123
- **Database**: root / (empty for local)

### Important URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Admin**: http://localhost:3000/admin
- **API Docs**: http://localhost:5000/api/docs (if implemented)

---

*Last updated: January 2026*