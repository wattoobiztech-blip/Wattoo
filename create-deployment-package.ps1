# Rishta Matrimonial - Deployment Package Creator
# This script creates a clean deployment package with all necessary files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Rishta Matrimonial - Deployment Package" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set variables
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$packageName = "rishta-matrimonial-$timestamp"
$tempDir = ".\temp-deploy"
$zipFile = "$packageName.zip"

Write-Host "Creating deployment package: $packageName" -ForegroundColor Green
Write-Host ""

# Clean up any existing temp directory
if (Test-Path $tempDir) {
    Write-Host "Cleaning up existing temp directory..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force
}

# Create temp directory
Write-Host "Creating temporary directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy essential files and directories
Write-Host "Copying project files..." -ForegroundColor Yellow

$itemsToCopy = @(
    "app",
    "components",
    "lib",
    "public",
    "database",
    "backend",
    "scripts",
    "docs",
    "nginx",
    "mysql",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    "postcss.config.js",
    ".env.local",
    ".env.production",
    "docker-compose.yml",
    "docker-compose.prod.yml",
    "Dockerfile.frontend",
    "ecosystem.config.js",
    "fix-build-error.sh",
    "deploy-port-3002.sh",
    "start-3002.sh",
    "README.md",
    "DEPLOYMENT.md",
    "PORT_3002_SETUP.md",
    "QUICK_START_URDU.md",
    "BUILD_FIX_GUIDE_URDU.md"
)

foreach ($item in $itemsToCopy) {
    if (Test-Path $item) {
        Write-Host "  Copying $item..." -ForegroundColor Gray
        if (Test-Path $item -PathType Container) {
            Copy-Item -Path $item -Destination "$tempDir\$item" -Recurse -Force
        } else {
            Copy-Item -Path $item -Destination "$tempDir\$item" -Force
        }
    }
}

# Exclude unnecessary files from temp directory
Write-Host "Cleaning up unnecessary files..." -ForegroundColor Yellow

$excludePatterns = @(
    "node_modules",
    ".next",
    ".git",
    ".vscode",
    "*.log",
    "*.tsbuildinfo",
    "temp-deploy"
)

foreach ($pattern in $excludePatterns) {
    $itemsToRemove = Get-ChildItem -Path $tempDir -Recurse -Force -Filter $pattern -ErrorAction SilentlyContinue
    foreach ($item in $itemsToRemove) {
        Write-Host "  Removing $($item.FullName)..." -ForegroundColor Gray
        Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Create deployment instructions
Write-Host "Creating deployment instructions..." -ForegroundColor Yellow

$deploymentInstructions = @"
# Rishta Matrimonial - Deployment Instructions
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Package Contents

This deployment package includes:
- ✅ Complete Next.js frontend application (Port 3002)
- ✅ Node.js backend API
- ✅ Database schema and seed data
- ✅ Docker configuration files
- ✅ Nginx configuration
- ✅ PM2 ecosystem configuration
- ✅ Build fix script (fix-build-error.sh)
- ✅ Deployment scripts for port 3002
- ✅ All user pages (Profile, Matches, Subscription, Settings)
- ✅ Profile viewing system
- ✅ Header with navigation and user menu
- ✅ Footer with logo linking
- ✅ Image storage system
- ✅ Pakistani localization
- ✅ Urdu documentation

## Latest Updates (Build Fix)

### Fixed Build Error
- ✅ Fixed `framer-motion` syntax error in PhotosStep.tsx
- ✅ Removed problematic motion.div components
- ✅ Fixed JSX structure issues
- ✅ Updated deprecated substr() to substring()
- ✅ Cleaned up unused imports

### Port 3002 Configuration
- ✅ Application configured to run on port 3002
- ✅ PM2 ecosystem configuration included
- ✅ Deployment scripts for port 3002
- ✅ Urdu documentation (QUICK_START_URDU.md)
- ✅ Build fix guide in Urdu (BUILD_FIX_GUIDE_URDU.md)

### User Menu Pages (Fully Functional)
1. **My Profile** (/user-profile)
   - Complete profile management
   - Photo gallery with upload
   - Profile statistics and completion
   - Privacy settings

2. **My Matches** (/matches)
   - Interactive match cards
   - Match statistics dashboard
   - Activity feed
   - Search and filters

3. **Subscription** (/subscription)
   - Three-tier pricing plans
   - Payment integration
   - Current subscription status
   - Auto-renewal management

4. **Settings** (/settings)
   - Account management
   - Privacy & security controls
   - Notification preferences
   - App customization

5. **Logout** (/logout)
   - Secure logout flow
   - Session cleanup

### Profile System
- Dynamic profile pages (/profile/[id])
- Image gallery with modal viewer
- Compatibility scoring
- Social media integration
- Report functionality

### Navigation
- Main header on all pages
- Logo links to home page
- User dropdown menu
- Mobile responsive

## Quick Start

### If You Had Build Error

If you encountered the build error on server, run the fix script first:

```bash
# Make script executable
chmod +x fix-build-error.sh

# Run the fix script
./fix-build-error.sh
```

This will:
1. Clean build cache and node_modules
2. Clear npm cache
3. Reinstall dependencies
4. Build the application

For detailed troubleshooting, see **BUILD_FIX_GUIDE_URDU.md**

### Option 1: Quick Start with PM2 (Port 3002)

1. Extract the package:
   ```bash
   unzip $zipFile
   cd $packageName
   ```

2. Run the deployment script:
   ```bash
   chmod +x deploy-port-3002.sh
   ./deploy-port-3002.sh
   ```

3. Access the application:
   - Frontend: http://your-server-ip:3002

### Option 2: Docker Deployment

1. Extract the package:
   ```bash
   unzip $zipFile
   cd $packageName
   ```

2. Start with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:5000

### Option 3: Manual Deployment

1. Install dependencies:
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   cd ..
   ```

2. Set up environment variables:
   ```bash
   # Copy and configure .env files
   cp .env.local.example .env.local
   cp backend/.env.example backend/.env
   ```

3. Set up database:
   ```bash
   # Import schema
   mysql -u root -p < database/schema.sql
   
   # Import seed data (optional)
   mysql -u root -p < database/seed-data.sql
   ```

4. Start the application:
   ```bash
   # Start backend
   cd backend
   npm start &
   cd ..

   # Start frontend (port 3002)
   npm run start
   
   # Or use PM2
   pm2 start ecosystem.config.js
   pm2 save
   ```

## Troubleshooting Build Errors

If you encounter build errors:

1. **Run the fix script:**
   ```bash
   chmod +x fix-build-error.sh
   ./fix-build-error.sh
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

3. **Check npm version:**
   ```bash
   npm --version  # Should be 9.x or higher
   ```

4. **See detailed guide:**
   - English: Check error messages in terminal
   - Urdu: Read BUILD_FIX_GUIDE_URDU.md

## Production Deployment

For production deployment, see DEPLOYMENT.md for detailed instructions including:
- AWS/VPS deployment
- SSL certificate setup
- Domain configuration
- Performance optimization
- Security hardening

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### Backend (backend/.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rishta_matrimonial
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## Database Setup

The package includes:
- `database/schema.sql` - Complete database structure
- `database/seed-data.sql` - Sample data for testing

Import these files in order to set up your database.

## Features Included

### Frontend
- ✅ Modern glassmorphism UI design
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ User authentication pages
- ✅ Profile management system
- ✅ Match browsing and filtering
- ✅ Subscription management
- ✅ Settings and preferences
- ✅ Image storage system
- ✅ Pakistani localization

### Backend
- ✅ RESTful API
- ✅ JWT authentication
- ✅ User management
- ✅ Profile CRUD operations
- ✅ Match algorithm
- ✅ Subscription handling
- ✅ Admin panel APIs

### Database
- ✅ User accounts
- ✅ Profiles
- ✅ Matches
- ✅ Subscriptions
- ✅ Messages
- ✅ Admin functions

## Support

For issues or questions:
1. **Build Errors:** See BUILD_FIX_GUIDE_URDU.md (Urdu) or run fix-build-error.sh
2. **Port 3002 Setup:** See PORT_3002_SETUP.md or QUICK_START_URDU.md
3. **General Deployment:** Check DEPLOYMENT.md for detailed documentation
4. **Project Overview:** Review README.md
5. **Specific Guides:** Check docs/ folder

## Important Files

- **fix-build-error.sh** - Automatic build error fix script
- **BUILD_FIX_GUIDE_URDU.md** - Build troubleshooting guide (Urdu)
- **deploy-port-3002.sh** - Deployment script for port 3002
- **QUICK_START_URDU.md** - Quick start guide (Urdu)
- **PORT_3002_SETUP.md** - Port 3002 configuration details
- **ecosystem.config.js** - PM2 configuration

## Version Information

- Next.js: 14.0.0
- Node.js: 18.x or higher
- MySQL: 8.0 or higher
- Package Date: $(Get-Date -Format "yyyy-MM-dd")

---
Built with ❤️ for connecting souls
"@

Set-Content -Path "$tempDir\DEPLOYMENT_INSTRUCTIONS.md" -Value $deploymentInstructions

# Create README for the package
$packageReadme = @"
# Rishta Matrimonial - Deployment Package

This is a complete deployment package for the Rishta Matrimonial website.

## What's Included

- Complete Next.js frontend application (Port 3002)
- Node.js backend API
- MySQL database schema and seed data
- Docker configuration for easy deployment
- PM2 ecosystem configuration
- Build fix script (fix-build-error.sh)
- Deployment scripts for port 3002
- Nginx configuration
- All documentation (English & Urdu)

## Quick Start

### If You Had Build Error (IMPORTANT!)

If you encountered this error on your server:
```
Error: Unexpected token `motion`. Expected jsx identifier
```

**Run the fix script first:**

```bash
# Make script executable
chmod +x fix-build-error.sh

# Run the fix script
./fix-build-error.sh
```

This will automatically:
1. Clean build cache and node_modules
2. Clear npm cache
3. Reinstall dependencies
4. Build the application

For detailed troubleshooting in Urdu, see **BUILD_FIX_GUIDE_URDU.md**

### Normal Deployment (Port 3002)

See **DEPLOYMENT_INSTRUCTIONS.md** for detailed setup instructions.

### Fastest Way to Deploy with PM2

```bash
# Run deployment script
chmod +x deploy-port-3002.sh
./deploy-port-3002.sh
```

The application will be available at:
- Frontend: http://your-server-ip:3002
- Backend: http://your-server-ip:5000

### Using Docker

```bash
# Using Docker (recommended)
docker-compose up -d
```

## Latest Features

✅ **BUILD FIX:** Fixed framer-motion syntax error
✅ **PORT 3002:** Application configured for port 3002
✅ Complete user profile management
✅ Match browsing and filtering system
✅ Subscription management with payment integration
✅ Settings and preferences
✅ Profile viewing with image galleries
✅ Header navigation on all pages
✅ Logo linking to home page
✅ Pakistani localization (cities, castes, currency)
✅ Modern glassmorphism UI design
✅ Fully responsive design
✅ PM2 process management
✅ Urdu documentation

## Important Files

### Build Fix & Troubleshooting
- **fix-build-error.sh** - Automatic build error fix script
- **BUILD_FIX_GUIDE_URDU.md** - Detailed troubleshooting guide (Urdu)

### Port 3002 Configuration
- **deploy-port-3002.sh** - Deployment script for port 3002
- **start-3002.sh** - Start script for port 3002
- **ecosystem.config.js** - PM2 configuration
- **PORT_3002_SETUP.md** - Port configuration details
- **QUICK_START_URDU.md** - Quick start guide (Urdu)

## Documentation

- **BUILD_FIX_GUIDE_URDU.md** - Build error troubleshooting (Urdu)
- **QUICK_START_URDU.md** - Quick start guide (Urdu)
- **PORT_3002_SETUP.md** - Port 3002 configuration
- **DEPLOYMENT_INSTRUCTIONS.md** - Quick start guide
- **DEPLOYMENT.md** - Detailed deployment guide
- **README.md** - Project overview
- **docs/** - Additional documentation

## Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- MySQL 8.0 or higher
- Docker (optional, but recommended)
- PM2 (optional, for process management)

## Troubleshooting

### Build Error
If you see: `Error: Unexpected token 'motion'`
- Run: `./fix-build-error.sh`
- See: BUILD_FIX_GUIDE_URDU.md

### Port Already in Use
If port 3002 is busy:
- Check: `lsof -i :3002`
- Kill: `kill -9 <PID>`
- Or use different port in package.json

### Node Version Issues
Check versions:
```bash
node --version  # Should be 18.x+
npm --version   # Should be 9.x+
```

## Support

For detailed documentation, see the included files:
- **BUILD_FIX_GUIDE_URDU.md** - Build error fixes (Urdu)
- **QUICK_START_URDU.md** - Quick start (Urdu)
- **DEPLOYMENT_INSTRUCTIONS.md** - Quick deployment
- **DEPLOYMENT.md** - Detailed deployment
- **PORT_3002_SETUP.md** - Port configuration
- **docs/IMAGE_STORAGE.md** - Image system
- **docs/LOGO_USAGE.md** - Logo guidelines

## What Was Fixed

### Build Error Fix
The previous package had a build error in `components/dashboard/profile/PhotosStep.tsx`:
```
Error: Unexpected token `motion`. Expected jsx identifier
```

**Fixed by:**
- Removed problematic `motion.div` components from framer-motion
- Fixed JSX structure issues
- Updated deprecated `substr()` to `substring()`
- Cleaned up unused imports

The fix maintains all functionality while resolving the build error.

---
Package created: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Build Error Fixed ✓**
**Port 3002 Configured ✓**
**Ready for Deployment ✓**
"@

Set-Content -Path "$tempDir\README_PACKAGE.md" -Value $packageReadme

# Create the zip file
Write-Host ""
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow

# Remove existing zip if it exists
if (Test-Path $zipFile) {
    Remove-Item -Path $zipFile -Force
}

# Create zip using PowerShell
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFile -CompressionLevel Optimal

# Clean up temp directory
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item -Path $tempDir -Recurse -Force

# Get file size
$fileSize = (Get-Item $zipFile).Length / 1MB
$fileSizeFormatted = "{0:N2} MB" -f $fileSize

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Deployment package created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Package Details:" -ForegroundColor Cyan
Write-Host "  File: $zipFile" -ForegroundColor White
Write-Host "  Size: $fileSizeFormatted" -ForegroundColor White
Write-Host "  Location: $(Get-Location)\$zipFile" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Extract the ZIP file on your server" -ForegroundColor White
Write-Host "  2. Read DEPLOYMENT_INSTRUCTIONS.md" -ForegroundColor White
Write-Host "  3. Run: docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "Happy Deploying! 🚀" -ForegroundColor Green
Write-Host ""
