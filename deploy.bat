@echo off
echo 🚀 Estate House Plans - Deployment Preparation
echo ============================================
echo.

echo [INFO] Checking git status...
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] You have uncommitted changes. Please commit them before deploying.
    echo Run: git add . ^&^& git commit -m "Prepare for deployment"
    pause
    exit /b 1
)
echo [SUCCESS] Git repository is clean

echo.
echo [INFO] Checking backend dependencies...
if not exist "backend\node_modules" (
    echo [WARNING] Backend dependencies not installed. Installing...
    cd backend
    call npm install
    cd ..
)

echo.
echo [INFO] Checking frontend dependencies...
if not exist "frontend\node_modules" (
    echo [WARNING] Frontend dependencies not installed. Installing...
    cd frontend
    call npm install
    cd ..
)

echo.
echo [SUCCESS] Dependencies are ready

echo.
echo [INFO] Testing frontend build...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed. Please fix the issues before deploying.
    pause
    exit /b 1
)
cd ..

echo.
echo [SUCCESS] All build tests passed!

echo.
echo 🎯 Deployment Checklist:
echo ========================
echo.
echo 1. 📊 Database Setup:
echo    - Create PlanetScale account: https://planetscale.com/
echo    - Create new database
echo    - Copy connection string
echo.
echo 2. ⚙️ Backend Deployment (Render):
echo    - Go to: https://dashboard.render.com/
echo    - Create new Web Service
echo    - Connect your GitHub repository
echo    - Set environment variables:
echo      * NODE_ENV=production
echo      * PORT=10000
echo      * JWT_SECRET=your-secret-key
echo      * DATABASE_URL=your-planetscale-connection
echo.
echo 3. 🎨 Frontend Deployment (Vercel):
echo    - Go to: https://vercel.com/
echo    - Create new project
echo    - Import your GitHub repository
echo    - Set root directory to 'frontend'
echo    - Add environment variable:
echo      * VITE_API_URL=https://your-backend.onrender.com/api
echo.
echo 4. 🔧 Database Initialization:
echo    - Run database setup after backend deployment
echo    - Use PlanetScale console or local setup script
echo.
echo 📖 For detailed instructions, see: DEPLOYMENT.md
echo.
echo [SUCCESS] Deployment preparation complete!
pause 