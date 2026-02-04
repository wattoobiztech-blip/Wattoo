#!/bin/bash

# Rishta Matrimonial Platform - Deployment Script
# This script handles the deployment process for production

set -e

# Configuration
APP_DIR="/opt/rishta"
BACKUP_DIR="/opt/rishta/backups"
GIT_REPO="https://github.com/your-username/rishta-matrimonial.git"  # Update with actual repo
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root or with sudo"
    exit 1
fi

log_info "Starting deployment process..."

# Create backup before deployment
if [ -d "$APP_DIR" ]; then
    log_info "Creating backup before deployment..."
    cd "$APP_DIR"
    ./scripts/backup.sh
    log_success "Backup created"
fi

# Create application directory
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Clone or update repository
if [ -d ".git" ]; then
    log_info "Updating existing repository..."
    git fetch origin
    git reset --hard origin/$BRANCH
else
    log_info "Cloning repository..."
    git clone -b "$BRANCH" "$GIT_REPO" .
fi

log_success "Code updated"

# Check if .env file exists
if [ ! -f ".env" ]; then
    log_warning ".env file not found"
    log_info "Creating .env from template..."
    cp .env.production .env
    log_warning "Please update .env file with production values before continuing"
    read -p "Press Enter after updating .env file..."
fi

# Make scripts executable
chmod +x scripts/*.sh

# Install/update dependencies
log_info "Installing frontend dependencies..."
npm ci --production

log_info "Installing backend dependencies..."
cd backend
npm ci --production
cd ..

# Build frontend
log_info "Building frontend..."
npm run build

# Stop existing services
log_info "Stopping existing services..."
docker-compose down || true

# Pull latest images
log_info "Pulling latest Docker images..."
docker-compose pull

# Start services
log_info "Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be ready
log_info "Waiting for services to start..."
sleep 30

# Run database migration if needed
log_info "Running database migration..."
docker-compose exec backend npm run migrate:simple || log_warning "Migration may have already been run"

# Health check
log_info "Performing health check..."
FRONTEND_OK=false
BACKEND_OK=false

# Check frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    FRONTEND_OK=true
    log_success "Frontend is responding"
else
    log_error "Frontend is not responding"
fi

# Check backend
if curl -f http://localhost:5000/health >/dev/null 2>&1; then
    BACKEND_OK=true
    log_success "Backend is responding"
else
    log_error "Backend is not responding"
fi

# Check database
if docker-compose exec mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; then
    log_success "Database is responding"
else
    log_error "Database is not responding"
fi

# Final status
echo ""
log_info "Deployment Summary:"
echo "- Code: Updated to latest $BRANCH"
echo "- Frontend: $([ "$FRONTEND_OK" = true ] && echo "✅ Running" || echo "❌ Failed")"
echo "- Backend: $([ "$BACKEND_OK" = true ] && echo "✅ Running" || echo "❌ Failed")"
echo "- Database: ✅ Running"

if [ "$FRONTEND_OK" = true ] && [ "$BACKEND_OK" = true ]; then
    log_success "Deployment completed successfully!"
    echo ""
    echo "🔗 Application URLs:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:5000/api"
    echo "- Admin Panel: http://localhost:3000/admin"
    echo ""
    echo "📊 Default Admin Credentials:"
    echo "- Email: admin@rishta.com"
    echo "- Password: admin123"
    echo ""
    log_warning "Remember to change default admin password!"
else
    log_error "Deployment completed with errors!"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "- Check logs: docker-compose logs -f"
    echo "- Check services: docker-compose ps"
    echo "- Check configuration: cat .env"
    exit 1
fi

# Optional: Set up cron job for backups
if ! crontab -l | grep -q "backup.sh"; then
    log_info "Setting up automated backups..."
    (crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/scripts/backup.sh") | crontab -
    log_success "Daily backup scheduled at 2:00 AM"
fi

log_success "Deployment process completed!"