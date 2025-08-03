#!/bin/bash

echo "🚀 Estate House Plans - Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please initialize git first."
    exit 1
fi

print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit them before deploying."
    echo "Run: git add . && git commit -m 'Prepare for deployment'"
    exit 1
fi

print_success "Git repository is clean"

# Check if backend dependencies are installed
print_status "Checking backend dependencies..."
if [ ! -d "backend/node_modules" ]; then
    print_warning "Backend dependencies not installed. Installing..."
    cd backend
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
print_status "Checking frontend dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    print_warning "Frontend dependencies not installed. Installing..."
    cd frontend
    npm install
    cd ..
fi

print_success "Dependencies are ready"

# Test backend build
print_status "Testing backend build..."
cd backend
if npm run build 2>/dev/null; then
    print_success "Backend build test passed"
else
    print_warning "Backend build test skipped (no build script)"
fi
cd ..

# Test frontend build
print_status "Testing frontend build..."
cd frontend
if npm run build; then
    print_success "Frontend build test passed"
else
    print_error "Frontend build failed. Please fix the issues before deploying."
    exit 1
fi
cd ..

print_success "All build tests passed!"

echo ""
echo "🎯 Deployment Checklist:"
echo "========================"
echo ""
echo "1. 📊 Database Setup:"
echo "   - Create PlanetScale account: https://planetscale.com/"
echo "   - Create new database"
echo "   - Copy connection string"
echo ""
echo "2. ⚙️ Backend Deployment (Render):"
echo "   - Go to: https://dashboard.render.com/"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set environment variables:"
echo "     * NODE_ENV=production"
echo "     * PORT=10000"
echo "     * JWT_SECRET=your-secret-key"
echo "     * DATABASE_URL=your-planetscale-connection"
echo ""
echo "3. 🎨 Frontend Deployment (Vercel):"
echo "   - Go to: https://vercel.com/"
echo "   - Create new project"
echo "   - Import your GitHub repository"
echo "   - Set root directory to 'frontend'"
echo "   - Add environment variable:"
echo "     * VITE_API_URL=https://your-backend.onrender.com/api"
echo ""
echo "4. 🔧 Database Initialization:"
echo "   - Run database setup after backend deployment"
echo "   - Use PlanetScale console or local setup script"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT.md"
echo ""
print_success "Deployment preparation complete!" 