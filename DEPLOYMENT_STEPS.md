# 🚀 Deployment Steps for jeslamusa/estate-house-plans

## ✅ **Step 1: Code is Ready!**
Your code has been successfully pushed to: `https://github.com/jeslamusa/estate-house-plans`

---

## 🗄️ **Step 2: Set Up Database (PlanetScale)**

### 2.1 Create PlanetScale Account
1. Go to [PlanetScale.com](https://planetscale.com/)
2. Click "Sign Up" and create a free account
3. After login, click "New Database"
4. Name it: `estate-house-plans`
5. Choose the free plan
6. Click "Create Database"

### 2.2 Get Connection String
1. In your database dashboard, click "Connect"
2. Select "Connect with MySQL"
3. Copy the connection string (looks like: `mysql://username:password@host/database`)
4. **Save this - you'll need it for Render**

---

## ⚙️ **Step 3: Deploy Backend to Render**

### 3.1 Create Render Account
1. Go to [Render.com](https://render.com/)
2. Click "Get Started" and sign up with GitHub
3. Authorize Render to access your GitHub account

### 3.2 Deploy Backend Service
1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository: `jeslamusa/estate-house-plans`
3. Configure the service:
   - **Name**: `estate-house-plans-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### 3.3 Add Environment Variables
In the Render dashboard, add these environment variables:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=estate-house-plans-secret-key-2024
DATABASE_URL=your-planetscale-connection-string-here
```

### 3.4 Deploy
Click "Create Web Service" and wait for deployment (5-10 minutes)

**Your backend URL will be**: `https://estate-house-plans-backend.onrender.com`

---

## 🎨 **Step 4: Deploy Frontend to Vercel**

### 4.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com/)
2. Click "Sign Up" and sign up with GitHub
3. Authorize Vercel to access your GitHub account

### 4.2 Deploy Frontend
1. In Vercel dashboard, click "New Project"
2. Import your repository: `jeslamusa/estate-house-plans`
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Add Environment Variable
In Vercel dashboard, add this environment variable:
```
VITE_API_URL=https://estate-house-plans-backend.onrender.com/api
```

### 4.4 Deploy
Click "Deploy" and wait for build completion (2-3 minutes)

**Your frontend URL will be**: `https://estate-house-plans.vercel.app`

---

## 🔧 **Step 5: Initialize Database**

### 5.1 Option A: Use PlanetScale Console
1. Go back to your PlanetScale dashboard
2. Click on your database
3. Go to "Console" tab
4. Copy and paste the contents of `backend/database/schema.sql`
5. Click "Run" to execute the schema

### 5.2 Option B: Local Setup (if you have database access)
```bash
cd backend
node setup-database.js
```

---

## 🌐 **Step 6: Test Your Deployment**

### 6.1 Test Backend
Visit: `https://estate-house-plans-backend.onrender.com/api/health`
Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

### 6.2 Test Frontend
Visit: `https://estate-house-plans.vercel.app`
Should show your estate house plans website

### 6.3 Test Admin Panel
Visit: `https://estate-house-plans.vercel.app/admin`
Login with:
- **Email**: `admin@estateplans.com`
- **Password**: `admin123`

---

## 🔑 **Step 7: Final Configuration**

### 7.1 Update CORS (if needed)
If you get CORS errors, update your backend CORS settings in `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://estate-house-plans.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### 7.2 Redeploy Backend
After making CORS changes, commit and push to GitHub. Render will automatically redeploy.

---

## 🎉 **Success! Your App is Live!**

### Your Live URLs:
- **🏠 Main Website**: `https://estate-house-plans.vercel.app`
- **⚙️ Backend API**: `https://estate-house-plans-backend.onrender.com`
- **🔧 Admin Panel**: `https://estate-house-plans.vercel.app/admin`

### Admin Access:
- **Email**: `admin@estateplans.com`
- **Password**: `admin123`

---

## 🚨 **Troubleshooting**

### If Backend Fails:
1. Check Render logs in dashboard
2. Verify environment variables
3. Check database connection string

### If Frontend Fails:
1. Check Vercel build logs
2. Verify VITE_API_URL environment variable
3. Check for build errors

### If Database Issues:
1. Verify PlanetScale connection string
2. Check if schema was executed properly
3. Test database connection

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test database connectivity
4. Check CORS configuration

Your estate house plans application is now ready for production deployment! 🚀 