# Port 3002 Setup Guide - Rishta Matrimonial

## Quick Commands (Server par run karein)

### Option 1: Direct Start (Simple)
```bash
# Port 3002 par start karein
PORT=3002 npm run start
```

### Option 2: PM2 ke sath (Recommended for Production)
```bash
# PM2 install karein (agar nahi hai)
npm install -g pm2

# Application start karein
pm2 start ecosystem.config.js

# Status check karein
pm2 status

# Logs dekhein
pm2 logs rishta-web

# Restart karein
pm2 restart rishta-web

# Stop karein
pm2 stop rishta-web
```

### Option 3: Deployment Script Use Karein
```bash
# Script ko executable banayein
chmod +x deploy-port-3002.sh

# Script run karein
./deploy-port-3002.sh
```

## Complete Setup Steps

### Step 1: Purani process ko stop karein
```bash
# Port 3002 par running process ko kill karein
fuser -k 3002/tcp

# Ya PM2 se stop karein
pm2 stop all
pm2 delete all
```

### Step 2: Dependencies install karein
```bash
npm install --production
```

### Step 3: Application build karein
```bash
npm run build
```

### Step 4: Application start karein

**Method A: Direct Start**
```bash
npm run start
# Application port 3002 par start ho jayegi
```

**Method B: PM2 ke sath**
```bash
# PM2 se start karein
pm2 start ecosystem.config.js

# PM2 configuration save karein
pm2 save

# System reboot par auto-start enable karein
pm2 startup
# Jo command output mein aaye, use run karein
```

**Method C: Background mein run karein**
```bash
# Nohup ke sath
nohup npm run start > output.log 2>&1 &

# Process ID check karein
ps aux | grep node
```

## Nginx Configuration (Agar domain use kar rahe hain)

### Nginx config file edit karein:
```bash
sudo nano /etc/nginx/sites-available/pakistanrishtaonline
```

### Configuration add karein:
```nginx
server {
    listen 80;
    server_name pakistanrishtaonline.com www.pakistanrishtaonline.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Nginx restart karein:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Environment Variables

### .env.local file banayein:
```bash
nano .env.local
```

### Ye content add karein:
```env
# Application
PORT=3002
NODE_ENV=production

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://pakistanrishtaonline.com

# Database (backend/.env mein)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=rishta_matrimonial
```

## Troubleshooting

### Problem: Port already in use
```bash
# Solution 1: Process ko kill karein
fuser -k 3002/tcp

# Solution 2: Process ID find karein aur kill karein
lsof -ti:3002
kill -9 $(lsof -ti:3002)

# Solution 3: PM2 se stop karein
pm2 stop all
pm2 delete all
```

### Problem: Application crash ho rahi hai
```bash
# Logs check karein
pm2 logs rishta-web

# Ya direct logs dekhein
tail -f logs/combined.log

# Memory check karein
pm2 monit
```

### Problem: Build fail ho rahi hai
```bash
# Node modules delete karke fresh install karein
rm -rf node_modules
rm package-lock.json
npm install

# Phir build karein
npm run build
```

## Useful Commands

### Application Management
```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop rishta-web

# Restart
pm2 restart rishta-web

# Delete
pm2 delete rishta-web

# Status
pm2 status

# Logs
pm2 logs rishta-web

# Monitor
pm2 monit
```

### Port Check
```bash
# Port 3002 check karein
netstat -tulpn | grep 3002

# Ya
lsof -i:3002

# Process details
ps aux | grep node
```

### Application Access
```bash
# Local access
curl http://localhost:3002

# Remote access (browser mein)
http://your-server-ip:3002
http://pakistanrishtaonline.com
```

## Production Checklist

- [ ] Port 3002 par application start ho gayi
- [ ] PM2 se application manage ho rahi hai
- [ ] PM2 startup configured hai
- [ ] Nginx reverse proxy configured hai
- [ ] SSL certificate installed hai (optional)
- [ ] Environment variables set hain
- [ ] Database connected hai
- [ ] Logs properly save ho rahe hain
- [ ] Application browser mein open ho rahi hai

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run start` | Application start karein |
| `pm2 start ecosystem.config.js` | PM2 se start karein |
| `pm2 status` | Status check karein |
| `pm2 logs rishta-web` | Logs dekhein |
| `pm2 restart rishta-web` | Restart karein |
| `fuser -k 3002/tcp` | Port 3002 free karein |

## Support

Agar koi problem aaye to:
1. Logs check karein: `pm2 logs rishta-web`
2. Status check karein: `pm2 status`
3. Port check karein: `lsof -i:3002`
4. Process check karein: `ps aux | grep node`

---

**Application URL:** http://localhost:3002  
**Port:** 3002  
**Process Name:** rishta-web
