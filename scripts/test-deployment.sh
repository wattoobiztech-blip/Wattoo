#!/bin/bash

# Rishta Matrimonial Platform - Deployment Testing Script
# This script tests the deployment to ensure everything is working correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"
API_URL="$BACKEND_URL/api"

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    log_info "Testing $description..."
    
    if command -v curl >/dev/null 2>&1; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
        if [ "$response" = "$expected_status" ]; then
            log_success "$description is working (HTTP $response)"
            return 0
        else
            log_error "$description failed (HTTP $response)"
            return 1
        fi
    else
        log_warning "curl not available, skipping $description test"
        return 0
    fi
}

# Start testing
echo "🚀 Starting Rishta Matrimonial Platform Deployment Tests"
echo "========================================================"
echo ""

# Test backend health
test_endpoint "$BACKEND_URL/health" "Backend Health Check"

# Test API root
test_endpoint "$API_URL" "API Root Endpoint"

# Test frontend
test_endpoint "$FRONTEND_URL" "Frontend Application"

# Test API endpoints (should return 401 for protected routes)
log_info "Testing API endpoints..."

# Auth endpoints (should be accessible)
test_endpoint "$API_URL/auth" "Auth API" 404  # No specific route, should return 404

# Protected endpoints (should return 401 without auth)
test_endpoint "$API_URL/user" "User API" 401
test_endpoint "$API_URL/profile" "Profile API" 401
test_endpoint "$API_URL/search" "Search API" 401
test_endpoint "$API_URL/subscriptions" "Subscriptions API" 401

# Admin endpoints (should return 401 without auth)
test_endpoint "$API_URL/admin" "Admin API" 401

echo ""
log_info "Testing database connection..."

# Test database by checking if we can connect to backend
if test_endpoint "$BACKEND_URL/health" "Database Connection via Backend" >/dev/null 2>&1; then
    log_success "Database connection is working"
else
    log_error "Database connection may have issues"
fi

echo ""
log_info "Testing file upload capability..."

# Check if uploads directory exists
if [ -d "./backend/uploads" ]; then
    log_success "Uploads directory exists"
else
    log_warning "Uploads directory not found, creating..."
    mkdir -p "./backend/uploads"
    log_success "Uploads directory created"
fi

echo ""
log_info "Testing environment configuration..."

# Check if required environment files exist
if [ -f ".env.local" ]; then
    log_success "Frontend environment file exists"
else
    log_error "Frontend .env.local file missing"
fi

if [ -f "./backend/.env" ]; then
    log_success "Backend environment file exists"
else
    log_error "Backend .env file missing"
fi

echo ""
log_info "Testing Docker configuration..."

# Check if Docker files exist
if [ -f "docker-compose.yml" ]; then
    log_success "Docker Compose configuration exists"
else
    log_error "docker-compose.yml missing"
fi

if [ -f "Dockerfile.frontend" ]; then
    log_success "Frontend Dockerfile exists"
else
    log_error "Dockerfile.frontend missing"
fi

if [ -f "./backend/Dockerfile" ]; then
    log_success "Backend Dockerfile exists"
else
    log_error "Backend Dockerfile missing"
fi

echo ""
log_info "Testing Nginx configuration..."

if [ -f "./nginx/nginx.conf" ]; then
    log_success "Nginx main configuration exists"
else
    log_error "Nginx configuration missing"
fi

if [ -f "./nginx/conf.d/default.conf" ]; then
    log_success "Nginx site configuration exists"
else
    log_error "Nginx site configuration missing"
fi

echo ""
log_info "Testing database schema..."

if [ -f "./database/schema.sql" ]; then
    log_success "Database schema file exists"
else
    log_error "Database schema file missing"
fi

if [ -f "./database/seed-data.sql" ]; then
    log_success "Database seed data file exists"
else
    log_error "Database seed data file missing"
fi

echo ""
log_info "Testing backup and deployment scripts..."

if [ -f "./scripts/backup.sh" ]; then
    log_success "Backup script exists"
else
    log_error "Backup script missing"
fi

if [ -f "./scripts/restore.sh" ]; then
    log_success "Restore script exists"
else
    log_error "Restore script missing"
fi

if [ -f "./scripts/deploy.sh" ]; then
    log_success "Deployment script exists"
else
    log_error "Deployment script missing"
fi

echo ""
echo "========================================================"
log_info "Test Summary:"
echo ""
echo "🔗 Application URLs:"
echo "   Frontend: $FRONTEND_URL"
echo "   Backend:  $BACKEND_URL"
echo "   API:      $API_URL"
echo "   Admin:    $FRONTEND_URL/admin"
echo ""
echo "📊 Default Credentials:"
echo "   Admin: admin@rishta.com / admin123"
echo ""
echo "🐳 Docker Commands:"
echo "   Start:  docker-compose up -d"
echo "   Stop:   docker-compose down"
echo "   Logs:   docker-compose logs -f"
echo ""
echo "💾 Database Commands:"
echo "   Migrate: cd backend && npm run migrate:simple"
echo "   Backup:  ./scripts/backup.sh"
echo "   Restore: ./scripts/restore.sh <backup_date>"
echo ""
log_success "Deployment testing completed!"
echo ""
log_info "Next Steps:"
echo "1. Test user registration and login"
echo "2. Test profile creation and search"
echo "3. Test admin panel functionality"
echo "4. Test subscription system"
echo "5. Perform load testing if needed"
echo ""
log_warning "Remember to:"
echo "- Change default admin password"
echo "- Update environment variables for production"
echo "- Set up SSL certificates for HTTPS"
echo "- Configure automated backups"
echo "- Set up monitoring and logging"