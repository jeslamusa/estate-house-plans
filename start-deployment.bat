@echo off
echo 🚀 Estate House Plans - Complete Deployment Automation
echo ====================================================
echo.

echo [INFO] Starting complete deployment process...
echo.

echo [STEP 1] Running automated deployment preparation...
call auto-deploy.bat

echo.
echo [STEP 2] Starting interactive deployment guide...
echo.
echo The automated script will now guide you through:
echo - Database setup (PlanetScale)
echo - Backend deployment (Render)
echo - Frontend deployment (Vercel)
echo.
echo Please follow the prompts and have your database connection string ready.
echo.

node auto-deploy.js

echo.
echo [STEP 3] Deployment completed! Checking status...
echo.

timeout /t 5 /nobreak >nul

node check-deployment.js

echo.
echo 🎉 Deployment process completed!
echo.
echo If you need to check deployment status later, run:
echo   node check-deployment.js
echo.
pause 