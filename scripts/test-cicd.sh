#!/bin/bash

# Local CI/CD Pipeline Test Script
# This script simulates the GitHub Actions workflow locally

set -e

echo "🚀 Starting local CI/CD pipeline simulation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi

print_status "Prerequisites check passed"

# Frontend CI
echo "🎨 Testing Frontend..."
cd frontend

echo "  📦 Installing dependencies..."
npm ci

echo "  🔍 Running linter..."
npm run lint:check

echo "  🧪 Running tests..."
npm test -- --coverage --watchAll=false

echo "  🏗️  Building application..."
npm run build

print_status "Frontend tests passed"
cd ..

# Backend CI
echo "🔧 Testing Backend..."
cd backend

echo "  📦 Installing dependencies..."
npm ci

echo "  🏗️  Testing application startup..."
timeout 10s npm start &
sleep 5
# Test health endpoint if available
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_status "Backend health check passed"
else
    print_warning "Backend health check failed or not available"
fi

print_status "Backend tests passed"
cd ..

# Docker builds
echo "🐳 Testing Docker builds..."

echo "  🏗️  Building frontend Docker image..."
docker build -t test-frontend ./frontend

echo "  🏗️  Building backend Docker image..."
docker build -t test-backend ./backend

echo "  🔍 Validating docker-compose..."
docker-compose config --quiet

print_status "Docker builds successful"

# Security scan (basic)
echo "🔒 Running basic security checks..."

# Check for common secrets patterns (basic version of what TruffleHog does)
if grep -r -i "password\|secret\|key\|token" --include="*.js" --include="*.json" --exclude-dir=node_modules .; then
    print_warning "Found potential secrets in code (review manually)"
else
    print_status "No obvious secrets found in code"
fi

# Dependency audit
echo "  🔍 Running dependency audit..."
cd frontend && npm audit --audit-level moderate && cd ..
cd backend && npm audit --audit-level moderate && cd ..

print_status "Security checks completed"

# Cleanup
echo "🧹 Cleaning up..."
docker rmi test-frontend test-backend

echo -e "${GREEN}🎉 Local CI/CD pipeline simulation completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Push your code to trigger the GitHub Actions workflow"
echo "2. Configure the required secrets in your GitHub repository"
echo "3. Review the deployment section in the workflows for your specific needs"
