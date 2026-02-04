# Deployment Instructions for Live Server

## 📦 Production Build Package

This package contains the complete matrimonial website ready for deployment.

## 🚀 Quick Deployment Steps

### 1. Upload Files
Upload all files to your live server via FTP/SFTP or cPanel File Manager.

### 2. Install Dependencies
```bash
cd /path/to/your/website
npm install --production
```

### 3. Build the Application
```bash
npm run build
```

### 4. Start the Production Server
```bash
npm run start
```

Or use PM2 for production:
```bash
npm install -g pm2
pm2 start npm --name "rishta-matrimonial" -- start
pm2 save
pm2 startup
```

## 🔧 Environment Configuration

### Frontend (.env.production)
Create `.env.production` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

### Backend (backend/.env)
Update `backend/.env` with your production database credentials:
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=rishta_matrimonial
DB_PORT=3306

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE rishta_matrimonial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Import Schema
```bash
mysql -u your_user -p rishta_matrimonial < database/schema.sql
```

### 3. Import Seed Data (Optional)
```bash
mysql -u your_user -p rishta_matrimonial < database/seed-data.sql
```

## 🌐 Web Server Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache Configuration (.htaccess)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Update JWT_SECRET with a strong random string
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure firewall rules
- [ ] Set up regular database backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable CSP headers

## 📊 Monitoring

### Check Application Status
```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:5000/api/health
```

### View Logs
```bash
# PM2 logs
pm2 logs rishta-matrimonial

# Or direct logs
tail -f logs/app.log
```

## 🔄 Updates & Maintenance

### Update Application
```bash
git pull origin main
npm install
npm run build
pm2 restart rishta-matrimonial
```

### Database Backup
```bash
mysqldump -u your_user -p rishta_matrimonial > backup_$(date +%Y%m%d).sql
```

### Clear Cache
```bash
rm -rf .next/cache
npm run build
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Database Connection Error
- Check database credentials in `.env`
- Verify database server is running
- Check firewall rules
- Verify user permissions

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Support

For technical support or questions:
- Email: support@rishta.com
- Documentation: https://docs.rishta.com
- GitHub Issues: https://github.com/your-repo/issues

## 📝 Notes

- Default admin credentials: admin@rishta.com / Admin@123
- Change admin password immediately after first login
- Regular backups are recommended
- Monitor server resources (CPU, RAM, Disk)
- Keep Node.js and dependencies updated

## ✅ Post-Deployment Checklist

- [ ] Application is accessible via domain
- [ ] Database is connected and working
- [ ] User registration works
- [ ] Login/Logout functionality works
- [ ] Profile creation works
- [ ] Image uploads work
- [ ] Email notifications work (if configured)
- [ ] Payment gateway works (if configured)
- [ ] SSL certificate is installed
- [ ] Backups are configured
- [ ] Monitoring is set up

---

**Version:** 2.0.0  
**Last Updated:** February 2026  
**Build Date:** $(date)
