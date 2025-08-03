@echo off
echo 🚀 Estate House Plans - Automated Deployment
echo ==============================================
echo.

echo [INFO] Starting automated deployment process...
echo.

echo [STEP 1] Checking prerequisites...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed. Please install Git first.
    pause
    exit /b 1
)
echo [SUCCESS] Git is installed

if not exist ".git" (
    echo [ERROR] Not in a git repository. Please run this from your project root.
    pause
    exit /b 1
)
echo [SUCCESS] Git repository found

echo.
echo [STEP 2] Preparing code for deployment...

if not exist "backend\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo [INFO] Testing frontend build...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed. Please fix the issues before deploying.
    pause
    exit /b 1
)
cd ..

echo [INFO] Pushing to GitHub...
git add .
git commit -m "Auto-deploy: Prepare for deployment"
git push origin main

echo.
echo [SUCCESS] Code preparation completed!
echo.

echo ==============================================
echo 🗄️ DATABASE SETUP (PlanetScale)
echo ==============================================
echo.
echo Please follow these steps:
echo 1. Go to https://planetscale.com/
echo 2. Sign up for a free account
echo 3. Create a new database named: estate-house-plans
echo 4. Get your connection string from the Connect tab
echo.
echo After you have your database connection string, run:
echo node auto-deploy.js
echo.
echo This will guide you through the rest of the deployment process.
echo.

pause 