#!/bin/bash

# Rishta Matrimonial Platform - Backup Script
# This script creates backups of the database and uploaded files

set -e

# Configuration
BACKUP_DIR="/opt/rishta/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🚀 Starting backup process at $(date)"

# Database backup
echo "📊 Creating database backup..."
docker-compose exec -T mysql mysqldump \
  -u root \
  -p"$MYSQL_ROOT_PASSWORD" \
  --single-transaction \
  --routines \
  --triggers \
  rishta > "$BACKUP_DIR/database_$DATE.sql"

if [ $? -eq 0 ]; then
  echo "✅ Database backup completed: database_$DATE.sql"
  gzip "$BACKUP_DIR/database_$DATE.sql"
  echo "✅ Database backup compressed"
else
  echo "❌ Database backup failed"
  exit 1
fi

# Files backup
echo "📁 Creating files backup..."
if [ -d "./uploads" ]; then
  tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" uploads/
  echo "✅ Files backup completed: uploads_$DATE.tar.gz"
else
  echo "⚠️  Uploads directory not found, skipping files backup"
fi

# Configuration backup
echo "⚙️  Creating configuration backup..."
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" \
  .env* \
  docker-compose*.yml \
  nginx/ \
  mysql/ \
  --exclude=node_modules \
  --exclude=.git 2>/dev/null || true

echo "✅ Configuration backup completed: config_$DATE.tar.gz"

# Cleanup old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Backup summary
echo ""
echo "📋 Backup Summary:"
echo "- Date: $(date)"
echo "- Location: $BACKUP_DIR"
echo "- Files created:"
ls -lh "$BACKUP_DIR"/*_$DATE.* 2>/dev/null || echo "  No files created"

echo ""
echo "✅ Backup process completed successfully!"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# echo "☁️  Uploading to cloud storage..."
# aws s3 cp "$BACKUP_DIR/database_$DATE.sql.gz" s3://your-backup-bucket/rishta/
# aws s3 cp "$BACKUP_DIR/uploads_$DATE.tar.gz" s3://your-backup-bucket/rishta/
# aws s3 cp "$BACKUP_DIR/config_$DATE.tar.gz" s3://your-backup-bucket/rishta/