# تازہ انسٹالیشن گائیڈ | Fresh Installation Guide

## 📦 نیا پیکیج | New Package

**فائل:** `rishta-matrimonial-20260201_221307.zip`  
**سائز:** 3.79 MB  
**حیثیت:** ✅ مکمل طور پر تیار - کوئی error نہیں

---

## 🚀 سرور پر انسٹال کریں | Install on Server

### قدم 1: پرانی فائلیں ہٹائیں (اگر ہیں)

```bash
# پرانے folder میں جائیں
cd /home/pakistanrishtaonline/htdocs

# پرانی web directory کا backup لیں (optional)
mv web web_backup_$(date +%Y%m%d)

# یا پرانی directory ہٹا دیں
rm -rf web
```

### قدم 2: نیا پیکیج اپ لوڈ کریں

```bash
# اپنے کمپیوٹر سے server پر upload کریں
scp rishta-matrimonial-20260201_221307.zip root@your-server-ip:/home/pakistanrishtaonline/htdocs/
```

### قدم 3: Extract کریں

```bash
# Server پر
cd /home/pakistanrishtaonline/htdocs
unzip rishta-matrimonial-20260201_221307.zip

# Folder کا نام بدلیں
mv rishta-matrimonial-20260201_221307 web

# Folder میں جائیں
cd web
```

### قدم 4: Dependencies Install کریں

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### قدم 5: Build کریں

```bash
npm run build
```

**یہ کامیابی سے مکمل ہو جائے گا - کوئی error نہیں آئے گی!** ✅

### قدم 6: شروع کریں

```bash
# PM2 سے شروع کریں (بہترین طریقہ)
pm2 start ecosystem.config.js
pm2 save

# یا عام طریقے سے
npm run start
```

### قدم 7: چیک کریں

```bash
# Status دیکھیں
pm2 status

# Logs دیکھیں
pm2 logs rishta-matrimonial
```

### قدم 8: Browser میں کھولیں

```
http://your-server-ip:3002
```

---

## ⚡ تیز طریقہ | Quick Method

سب کچھ ایک ساتھ:

```bash
cd /home/pakistanrishtaonline/htdocs && \
rm -rf web && \
unzip rishta-matrimonial-20260201_221307.zip && \
mv rishta-matrimonial-20260201_221307 web && \
cd web && \
npm install && \
cd backend && npm install && cd .. && \
npm run build && \
pm2 start ecosystem.config.js && \
pm2 save
```

---

## ✅ کیا کیا ٹھیک ہو گیا | What's Fixed

### 1. PhotosStep Error ✅
- **مسئلہ:** Photo upload میں error آتی تھی
- **حل:** Code ٹھیک کر دیا گیا
- **نتیجہ:** Photo upload اب کام کرتا ہے

### 2. SearchFilters Error ✅
- **مسئلہ:** Match filters میں error آتی تھی
- **حل:** Missing exports شامل کر دیے
- **نتیجہ:** Filters اب کام کرتے ہیں

### 3. Build Errors ✅
- **مسئلہ:** Build fail ہو جاتی تھی
- **حل:** تمام errors ٹھیک کر دیے
- **نتیجہ:** Build ہمیشہ کامیاب ہوتی ہے

---

## 📋 ضروریات | Requirements

### ضروری Software:
- Node.js 18.x یا اس سے اوپر
- npm 9.x یا اس سے اوپر
- MySQL 8.0 یا اس سے اوپر
- PM2 (optional لیکن بہتر)

### Versions چیک کریں:

```bash
node --version   # 18.x+ ہونا چاہیے
npm --version    # 9.x+ ہونا چاہیے
mysql --version  # 8.0+ ہونا چاہیے
```

### اگر پرانے versions ہیں:

```bash
# Node.js update کریں
nvm install 18
nvm use 18

# npm update کریں
npm install -g npm@latest

# PM2 install کریں
npm install -g pm2
```

---

## 🗄️ Database Setup

### قدم 1: Database بنائیں

```bash
mysql -u root -p
```

```sql
CREATE DATABASE rishta_matrimonial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'rishta_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON rishta_matrimonial.* TO 'rishta_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### قدم 2: Schema Import کریں

```bash
cd /home/pakistanrishtaonline/htdocs/web
mysql -u root -p rishta_matrimonial < database/schema.sql
```

### قدم 3: Sample Data (Optional)

```bash
mysql -u root -p rishta_matrimonial < database/seed-data.sql
```

---

## ⚙️ Configuration

### Frontend (.env.local)

```bash
cd /home/pakistanrishtaonline/htdocs/web
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://your-domain.com:3002
```

### Backend (backend/.env)

```bash
cd backend
nano .env
```

```env
PORT=5000
DB_HOST=localhost
DB_USER=rishta_user
DB_PASSWORD=your_strong_password
DB_NAME=rishta_matrimonial
JWT_SECRET=your_very_long_random_secret_key_here
NODE_ENV=production
```

---

## 🔍 تصدیق | Verification

### 1. Build چیک کریں

```bash
npm run build
```

**کامیاب output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

### 2. Application چیک کریں

```bash
pm2 status
```

**کامیاب output:**
```
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ status  │ restart │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ rishta-matrimonial   │ online  │ 0       │
└─────┴──────────────────────┴─────────┴─────────┘
```

### 3. Website چیک کریں

Browser میں کھولیں:
```
http://your-server-ip:3002
```

### 4. Features Test کریں

- [ ] Home page کھلتا ہے
- [ ] Registration کام کرتی ہے
- [ ] Login کام کرتا ہے
- [ ] Profile create ہوتا ہے
- [ ] Photos upload ہوتی ہیں ✅
- [ ] Matches دکھتے ہیں
- [ ] Filters کام کرتے ہیں ✅
- [ ] Subscription pages کام کرتے ہیں

---

## 🛠️ مسائل کا حل | Troubleshooting

### مسئلہ: Build fail ہو جائے

```bash
# Cache صاف کریں
rm -rf .next node_modules package-lock.json
npm cache clean --force

# دوبارہ install کریں
npm install

# دوبارہ build کریں
npm run build
```

### مسئلہ: Port 3002 busy ہے

```bash
# کون استعمال کر رہا ہے دیکھیں
lsof -i :3002

# Process بند کریں
kill -9 <PID>
```

### مسئلہ: Permission errors

```bash
# Ownership ٹھیک کریں
sudo chown -R $USER:$USER /home/pakistanrishtaonline/htdocs/web

# Permissions ٹھیک کریں
chmod -R 755 /home/pakistanrishtaonline/htdocs/web
```

### مسئلہ: Database connection fail

```bash
# MySQL چل رہا ہے چیک کریں
systemctl status mysql

# شروع کریں اگر بند ہے
sudo systemctl start mysql

# .env file میں credentials چیک کریں
nano backend/.env
```

---

## 📊 PM2 Commands

```bash
# شروع کریں
pm2 start ecosystem.config.js

# بند کریں
pm2 stop rishta-matrimonial

# دوبارہ شروع کریں
pm2 restart rishta-matrimonial

# Status دیکھیں
pm2 status

# Logs دیکھیں
pm2 logs rishta-matrimonial

# Monitoring
pm2 monit

# Configuration save کریں
pm2 save

# Startup script بنائیں (server restart پر auto-start)
pm2 startup
```

---

## 🔐 Security Tips

### 1. Strong Passwords استعمال کریں

```bash
# JWT secret generate کریں
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Firewall Setup کریں

```bash
# صرف ضروری ports کھولیں
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3002  # Application
sudo ufw enable
```

### 3. SSL Certificate لگائیں

```bash
# Let's Encrypt سے free SSL
sudo apt install certbot
sudo certbot --nginx -d your-domain.com
```

---

## 📈 Performance Tips

### 1. PM2 Cluster Mode

```bash
# Multiple instances چلائیں
pm2 start ecosystem.config.js -i max
```

### 2. Nginx Reverse Proxy

```bash
# Nginx install کریں
sudo apt install nginx

# Configuration file edit کریں
sudo nano /etc/nginx/sites-available/rishta
```

### 3. Database Optimization

```sql
-- Indexes شامل کریں
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE profiles ADD INDEX idx_user_id (user_id);
```

---

## ✅ کامیابی کی علامات | Success Indicators

اگر یہ سب کام کر رہے ہیں تو آپ کامیاب ہیں:

- ✅ `npm run build` بغیر error کے مکمل ہوتی ہے
- ✅ `pm2 status` میں "online" دکھتا ہے
- ✅ Website browser میں کھلتی ہے
- ✅ Registration اور login کام کرتے ہیں
- ✅ Profile creation کے تمام steps کام کرتے ہیں
- ✅ Photos upload ہوتی ہیں
- ✅ Match filters کام کرتے ہیں

---

## 📞 مدد | Help

### اگر کوئی مسئلہ ہو:

1. **Logs چیک کریں:**
   ```bash
   pm2 logs rishta-matrimonial
   ```

2. **Build errors:**
   ```bash
   npm run build
   ```

3. **Database errors:**
   ```bash
   mysql -u root -p rishta_matrimonial
   SHOW TABLES;
   ```

---

## 🎯 خلاصہ | Summary

| کام | حیثیت |
|-----|--------|
| Package تیار | ✅ ہو گیا |
| Errors ٹھیک | ✅ ہو گئیں |
| Build کام کرتی ہے | ✅ ہاں |
| تمام features | ✅ کام کر رہے ہیں |
| Port 3002 | ✅ configured |
| Documentation | ✅ مکمل |
| **تیار ہے** | ✅ **ہاں!** |

---

**پیکیج:** rishta-matrimonial-20260201_221307.zip  
**تاریخ:** 1 فروری 2026  
**حیثیت:** ✅ مکمل طور پر تیار  
**Errors:** ✅ کوئی نہیں

**آپ کی website تیار ہے!** 🎉🚀
