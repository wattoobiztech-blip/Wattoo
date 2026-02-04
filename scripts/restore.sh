#!/bin/bash

# Rishta Matrimonial Platform - Restore Script
# This script restores backups of the database and uploaded files

set -e

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo "❌ Usage: $0 <backup_date>"
    echo "   Example: $0 20240120_143000"
    echo ""
    echo "Available backups:"
    ls -la /opt/rishta/backups/ | grep -E "(database|uploads|config)_[0-9]{8}_[0-9]{6}"
    exit 1
fi

BACKUP_DATE=$1
BACKUP_DIR="/opt/rishta/backups"

echo "🚀 Starting restore process for backup: $BACKUP_DATE"

# Check if backup files exist
DB_BACKUP="$BACKUP_DIR/database_$BACKUP_DATE.sql.gz"
FILES_BACKUP="$BACKUP_DIR/uploads_$BACKUP_DATE.tar.gz"
CONFIG_BACKUP="$BACKUP_DIR/config_$BACKUP_DATE.tar.gz"

if [ ! -f "$DB_BACKUP" ]; then
    echo "❌ Database backup not found: $DB_BACKUP"
    exit 1
fi

# Confirm restore operation
echo "⚠️  WARNING: This will overwrite existing data!"
echo "Database backup: $DB_BACKUP"
[ -f "$FILES_BACKUP" ] && echo "Files backup: $FILES_BACKUP"
[ -f "$CONFIG_BACKUP" ] && echo "Config backup: $CONFIG_BACKUP"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Stop services
echo "🛑 Stopping services..."
docker-compose down

# Restore database
echo "📊 Restoring database..."
docker-compose up -d mysql
sleep 10  # Wait for MySQL to start

# Decompress and restore database
gunzip -c "$DB_BACKUP" | docker-compose exec -T mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" rishta

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully"
else
    echo "❌ Database restore failed"
    exit 1
fi

# Restore files
if [ -f "$FILES_BACKUP" ]; then
    echo "📁 Restoring files..."
    rm -rf uploads/
    tar -xzf "$FILES_BACKUP"
    echo "✅ Files restored successfully"
fi

# Restore configuration (optional)
if [ -f "$CONFIG_BACKUP" ] && [ "$2" = "--include-config" ]; then
    echo "⚙️  Restoring configuration..."
    tar -xzf "$CONFIG_BACKUP"
    echo "✅ Configuration restored successfully"
    echo "⚠️  Please review configuration files before starting services"
fi

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "⚠️  Frontend may not be ready yet"
fi

if curl -f http://localhost:5000/health >/dev/null 2>&1; then
    echo "✅ Backend is responding"
else
    echo "⚠️  Backend may not be ready yet"
fi

echo ""
echo "✅ Restore process completed!"
echo "📋 Summary:"
echo "- Database: Restored from $DB_BACKUP"
[ -f "$FILES_BACKUP" ] && echo "- Files: Restored from $FILES_BACKUP"
[ -f "$CONFIG_BACKUP" ] && [ "$2" = "--include-config" ] && echo "- Config: Restored from $CONFIG_BACKUP"
echo ""
echo "🔗 Application should be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:5000"
echo "- Admin: http://localhost:3000/admin"