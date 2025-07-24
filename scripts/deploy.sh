#!/bin/bash

# Deployment script for Tutorbuddy
# Usage: ./scripts/deploy.sh [--force] [--skip-tests]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
FORCE=false
SKIP_TESTS=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --force)
      FORCE=true
      shift
      ;;
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--force] [--skip-tests]"
      exit 1
      ;;
  esac
done

echo -e "${GREEN}🚀 Starting Tutorbuddy deployment...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
  exit 1
fi

# Create backup
echo -e "${YELLOW}📦 Creating backup of current deployment...${NC}"
if [ -d ".git" ]; then
  git rev-parse HEAD > .backup_commit
  echo "Backup created: $(cat .backup_commit)"
fi

# Pull latest code
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
git fetch origin main
git reset --hard origin/main

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Run tests (unless skipped)
if [ "$SKIP_TESTS" = false ]; then
  echo -e "${YELLOW}🧪 Running linting...${NC}"
  npm run lint
  
  echo -e "${YELLOW}🔍 Type checking...${NC}"
  npx tsc --noEmit
  
  echo -e "${YELLOW}✅ All tests passed!${NC}"
else
  echo -e "${YELLOW}⏭️  Skipping tests...${NC}"
fi

# Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Restart PM2 process
echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
pm2 restart tutorbuddy

# Check if application is running
echo -e "${YELLOW}🔍 Checking application status...${NC}"
sleep 5

if pm2 status | grep -q "online"; then
  echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
  echo -e "${GREEN}📊 PM2 Status:${NC}"
  pm2 status
else
  echo -e "${RED}❌ Deployment failed - application not running${NC}"
  echo -e "${YELLOW}🔄 Attempting rollback...${NC}"
  
  if [ -f ".backup_commit" ]; then
    echo "Rolling back to previous commit..."
    git reset --hard $(cat .backup_commit)
    npm ci
    npm run build
    pm2 restart tutorbuddy
    echo -e "${GREEN}✅ Rollback completed${NC}"
  else
    echo -e "${RED}❌ No backup found, cannot rollback${NC}"
  fi
  exit 1
fi

echo -e "${GREEN}🎉 Deployment process completed!${NC}" 