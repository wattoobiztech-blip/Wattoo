# Build Error Fix Guide | بلڈ ایرر ٹھیک کرنے کی گائیڈ

## مسئلہ | Problem
```
Error: Unexpected token `motion`. Expected jsx identifier
```

یہ ایرر `framer-motion` لائبریری کے ساتھ مسئلہ کی وجہ سے آتی ہے۔

## حل | Solution

### آپشن 1: خودکار فکس اسکرپٹ (تیز ترین)

```bash
# اسکرپٹ کو executable بنائیں
chmod +x fix-build-error.sh

# اسکرپٹ چلائیں
./fix-build-error.sh
```

یہ اسکرپٹ خودکار طور پر:
1. چلتے ہوئے Next.js processes کو بند کرے گا
2. `.next` اور `node_modules` کو صاف کرے گا
3. npm cache کو صاف کرے گا
4. Dependencies دوبارہ install کرے گا
5. Application کو build کرے گا

### آپشن 2: دستی طریقہ (قدم بہ قدم)

```bash
# 1. چلتے ہوئے processes بند کریں
pkill -f "next"

# 2. پرانی فائلیں صاف کریں
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

# 3. npm cache صاف کریں
npm cache clean --force

# 4. Dependencies دوبارہ install کریں
npm install

# 5. Application build کریں
npm run build
```

## بلڈ کامیاب ہونے کے بعد | After Successful Build

### عام طریقہ سے شروع کریں:
```bash
npm run start
```

### یا PM2 استعمال کریں (بہتر):
```bash
# PM2 سے شروع کریں
pm2 start ecosystem.config.js

# Configuration save کریں
pm2 save

# Status چیک کریں
pm2 status

# Logs دیکھیں
pm2 logs rishta-matrimonial
```

## اگر مسئلہ برقرار رہے | If Problem Persists

### 1. Node.js ورژن چیک کریں
```bash
node --version
```
**ضروری:** Node.js 18.x یا اس سے اوپر ہونا چاہیے

اگر پرانا ورژن ہے تو update کریں:
```bash
# nvm استعمال کرتے ہوئے
nvm install 18
nvm use 18

# یا براہ راست download کریں
# https://nodejs.org/
```

### 2. npm ورژن چیک کریں
```bash
npm --version
```
**ضروری:** npm 9.x یا اس سے اوپر ہونا چاہیے

اگر پرانا ورژن ہے تو update کریں:
```bash
npm install -g npm@latest
```

### 3. Disk Space چیک کریں
```bash
df -h
```
کم از کم 1GB خالی جگہ ہونی چاہیے

### 4. Permissions چیک کریں
```bash
# اگر permission errors آئیں
sudo chown -R $USER:$USER /home/pakistanrishtaonline/htdocs/web
```

## عام مسائل اور حل | Common Issues and Solutions

### مسئلہ: "EACCES: permission denied"
```bash
sudo chown -R $USER:$USER .
```

### مسئلہ: "ENOSPC: no space left on device"
```bash
# Disk space صاف کریں
npm cache clean --force
rm -rf /tmp/*
```

### مسئلہ: "Cannot find module"
```bash
# Dependencies دوبارہ install کریں
rm -rf node_modules package-lock.json
npm install
```

## مدد کے لیے | For Help

اگر مسئلہ حل نہ ہو تو:
1. مکمل error message copy کریں
2. Node.js اور npm versions بتائیں
3. Operating system کی تفصیلات دیں

## فائل میں کیا تبدیلی ہوئی | What Was Fixed

`components/dashboard/profile/PhotosStep.tsx` میں:
- `framer-motion` کے `motion.div` components کو عام `div` سے بدل دیا
- JSX syntax errors ٹھیک کر دیے
- Unused imports ہٹا دیے
- Deprecated `substr()` کو `substring()` سے بدل دیا

یہ تبدیلیاں functionality کو متاثر نہیں کرتیں، صرف build error ٹھیک کرتی ہیں۔

## تصدیق | Verification

بلڈ کامیاب ہونے کے بعد:
```bash
# Application شروع کریں
npm run start

# Browser میں کھولیں
# http://your-server-ip:3002
```

اگر صفحہ کھل جائے تو سب ٹھیک ہے! ✓
