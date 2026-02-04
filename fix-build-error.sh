#!/bin/bash

echo "=========================================="
echo "Fixing Build Errors - Cleaning and Rebuilding"
echo "=========================================="
echo ""

# Step 1: Stop any running processes
echo "Step 1: Stopping any running Next.js processes..."
pkill -f "next" || true
sleep 2

# Step 2: Clean build cache and dependencies
echo ""
echo "Step 2: Cleaning build cache and node_modules..."
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

# Step 3: Clear npm cache
echo ""
echo "Step 3: Clearing npm cache..."
npm cache clean --force

# Step 4: Reinstall dependencies
echo ""
echo "Step 4: Reinstalling dependencies..."
npm install

# Step 5: Build the application
echo ""
echo "Step 5: Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ Build completed successfully!"
    echo "=========================================="
    echo ""
    echo "You can now start the application with:"
    echo "  npm run start"
    echo ""
    echo "Or use PM2:"
    echo "  pm2 start ecosystem.config.js"
    echo "  pm2 save"
    echo ""
else
    echo ""
    echo "=========================================="
    echo "✗ Build failed!"
    echo "=========================================="
    echo ""
    echo "Please check the error messages above."
    echo "If the issue persists, verify:"
    echo "  1. Node.js version (should be 18.x or higher)"
    echo "  2. npm version (should be 9.x or higher)"
    echo ""
    echo "Check versions with:"
    echo "  node --version"
    echo "  npm --version"
    echo ""
    exit 1
fi
