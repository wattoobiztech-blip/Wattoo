# Rishta Matrimonial - Quick Start Guide (Urdu)

## 📦 Package Details

**File:** `rishta-matrimonial-20260201_201645.zip`  
**Size:** 3.78 MB  
**Port:** 3002  
**Date:** 1 February 2026

---

## 🚀 Sabse Aasan Tareeqa (3 Steps)

### Step 1: Extract karein
```bash
unzip rishta-matrimonial-20260201_201645.zip
cd rishta-matrimonial-20260201_201645
```

### Step 2: Script ko executable banayein
```bash
chmod +x deploy-port-3002.sh
```

### Step 3: Deploy karein
```bash
./deploy-port-3002.sh
```

**Bas! Application port 3002 par chal rahi hai! 🎉**

---

## 🔧 Manual Setup (Agar script kaam na kare)

### 1. Dependencies install karein
```bash
npm install --production
```

### 2. Application build karein
```bash
npm run build
```

### 3. PM2 install karein
```bash
npm install -g pm2
```

### 4. Application start karein
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Status check karein
```bash
pm2 status
```

---

## 🌐 Application Access Karein

### Browser mein kholen:
- **Local:** http://localhost:3002
- **Server IP:** http://your-server-ip:3002
- **Domain:** http://pakistanrishtaonline.com

---

## 📝 Important Commands

### Application Control
```bash
# Start karein
pm2 start ecosystem.config.js

# Stop karein
pm2 stop rishta-web

# Restart karein
pm2 restart rishta-web

# Status dekhein
pm2 status

# Logs dekhein
pm2 logs rishta-web
```

### Port Check
```bash
# Port 3002 check karein
lsof -i:3002

# Port free karein
fuser -k 3002/tcp
```

---

## ⚠️ Common Problems aur Solutions

### Problem 1: Port already in use
```bash
# Solution:
fuser -k 3002/tcp
pm2 restart rishta-web
```

### Problem 2: Application crash ho rahi hai
```bash
# Solution:
pm2 logs rishta-web
pm2 restart rishta-web
```

### Problem 3: Build fail ho rahi hai
```bash
# Solution:
rm -rf node_modules
npm install
npm run build
```

---

## 📂 Important Files

| File | Description |
|------|-------------|
| `deploy-port-3002.sh` | Automatic deployment script |
| `ecosystem.config.js` | PM2 configuration |
| `PORT_3002_SETUP.md` | Complete Urdu guide |
| `package.json` | Port 3002 configured |
| `.env.local` | Environment variables |

---

## 🔐 Environment Variables Setup

### .env.local file banayein:
```bash
nano .env.local
```

### Ye content add karein:
```env
PORT=3002
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://pakistanrishtaonline.com
```

### Backend environment (backend/.env):
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=rishta_matrimonial
JWT_SECRET=your_secret_key
```

---

## ✅ Deployment Checklist

- [ ] ZIP file extract ho gayi
- [ ] Dependencies install ho gayi (`npm install`)
- [ ] Application build ho gayi (`npm run build`)
- [ ] PM2 install ho gaya
- [ ] Application start ho gayi
- [ ] Port 3002 par chal rahi hai
- [ ] Browser mein khul rahi hai
- [ ] Database connected hai

---

## 🆘 Help Chahiye?

### Logs dekhein:
```bash
pm2 logs rishta-web
```

### Status check karein:
```bash
pm2 status
pm2 monit
```

### Process check karein:
```bash
ps aux | grep node
netstat -tulpn | grep 3002
```

---

## 📞 Documentation

Zyada details ke liye ye files padhein:
1. **PORT_3002_SETUP.md** - Complete Urdu guide
2. **DEPLOYMENT_INSTRUCTIONS.md** - Quick start
3. **LATEST_PACKAGE_INFO.md** - Package details
4. **DEPLOYMENT.md** - Full deployment guide

---

## 🎯 Quick Reference

| Command | Kya karta hai |
|---------|---------------|
| `npm run start` | Application start |
| `pm2 start ecosystem.config.js` | PM2 se start |
| `pm2 status` | Status check |
| `pm2 logs rishta-web` | Logs dekho |
| `pm2 restart rishta-web` | Restart karo |
| `fuser -k 3002/tcp` | Port free karo |
| `lsof -i:3002` | Port check karo |

---

## 🌟 Features

✅ Complete user profile system  
✅ Match browsing  
✅ Subscription management  
✅ Settings page  
✅ Modern UI design  
✅ Pakistani localization  
✅ Port 3002 configured  
✅ PM2 ready  

---

**Application URL:** http://localhost:3002  
**Port:** 3002  
**Process Name:** rishta-web  
**Status:** Production Ready ✅

---

Koi problem ho to `pm2 logs rishta-web` command se logs check karein!

**Happy Deploying! 🚀**
