#!/bin/bash

# Rishta Matrimonial - Deployment Script for Port 3002
# This script will deploy the application on port 3002

echo "=========================================="
echo "Rishta Matrimonial - Port 3002 Deployment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Stop any existing process on port 3002
echo -e "${YELLOW}Stopping any existing process on port 3002...${NC}"
fuser -k 3002/tcp 2>/dev/null || true
sleep 2

# Stop PM2 process if exists
echo -e "${YELLOW}Stopping PM2 process if exists...${NC}"
pm2 stop rishta-web 2>/dev/null || true
pm2 delete rishta-web 2>/dev/null || true

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --production

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Start with PM2
echo -e "${YELLOW}Starting application with PM2 on port 3002...${NC}"
pm2 start npm --name "rishta-web" -- start

# Save PM2 configuration
echo -e "${YELLOW}Saving PM2 configuration...${NC}"
pm2 save

# Setup PM2 startup
echo -e "${YELLOW}Setting up PM2 startup...${NC}"
pm2 startup

echo ""
echo -e "${GREEN}=========================================="
echo -e "✅ Application deployed successfully!"
echo -e "==========================================${NC}"
echo ""
echo -e "${GREEN}Application is running on:${NC}"
echo -e "  ${GREEN}http://localhost:3002${NC}"
echo -e "  ${GREEN}http://your-domain.com:3002${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  pm2 status          - Check application status"
echo -e "  pm2 logs rishta-web - View application logs"
echo -e "  pm2 restart rishta-web - Restart application"
echo -e "  pm2 stop rishta-web - Stop application"
echo ""

# Show PM2 status
pm2 status
