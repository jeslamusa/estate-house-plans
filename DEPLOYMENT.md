# 🚀 Fresh Deployment Guide - Estate House Plans

## 📋 **Deployment Overview**

This guide will help you deploy your estate house plans application to production:

- **Backend**: Render (Node.js API)
- **Frontend**: Vercel (React App)
- **Database**: PlanetScale (MySQL - Free Tier)

---

## 🗄️ **Step 1: Database Setup (PlanetScale)**

### 1.1 Create PlanetScale Account
1. Go to [PlanetScale.com](https://planetscale.com/)
2. Sign up for a free account
3. Create a new database project

### 1.2 Get Database Connection
1. In your PlanetScale dashboard, click on your database
2. Go to "Connect" tab
3. Copy the connection string (it looks like: `mysql://username:password@host/database`)

---

## ⚙️ **Step 2: Backend Deployment (Render)**

### 2.1 Prepare Backend
1. Make sure your backend code is committed to GitHub
2. Ensure `render.yaml` is in your root directory

### 2.2 Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `estate-house-plans-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### 2.3 Add Environment Variables
In Render dashboard, add these environment variables:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=your-planetscale-connection-string
```

### 2.4 Deploy
Click "Create Web Service" and wait for deployment.

---

## 🎨 **Step 3: Frontend Deployment (Vercel)**

### 3.1 Prepare Frontend
1. Update your frontend API configuration to point to your Render backend
2. Commit changes to GitHub

### 3.2 Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com/)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variables
In Vercel dashboard, add:
```
VITE_API_URL=https://your-backend-service-name.onrender.com/api
```

### 3.4 Deploy
Click "Deploy" and wait for build completion.

---

## 🔧 **Step 4: Database Initialization**

### 4.1 Run Database Setup
After backend deployment, initialize your database:

1. **Option A: Use PlanetScale Console**
   - Go to your PlanetScale database
   - Open the SQL console
   - Run the schema from `backend/database/schema.sql`

2. **Option B: Local Setup**
   ```bash
   cd backend
   node setup-database.js
   ```

### 4.2 Verify Database
Check that your database has:
- Users table with admin user
- House plans table with sample data
- Proper indexes

---

## 🌐 **Step 5: Final Configuration**

### 5.1 Update CORS Settings
Make sure your backend allows your frontend domain:

```javascript
// In backend/server.js
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000' // for development
  ],
  credentials: true
}));
```

### 5.2 Test Your Deployment
1. **Backend Health Check**: `https://your-backend.onrender.com/api/health`
2. **Frontend**: `https://your-frontend.vercel.app`
3. **Admin Panel**: `https://your-frontend.vercel.app/admin`

---

## 🔑 **Step 6: Admin Access**

### 6.1 Default Admin Credentials
- **Email**: `admin@estateplans.com`
- **Password**: `admin123`

### 6.2 Change Default Password
After first login, change the admin password for security.

---

## 📊 **Step 7: Monitoring & Maintenance**

### 7.1 Monitor Logs
- **Render**: Check backend logs in dashboard
- **Vercel**: Check frontend build logs

### 7.2 Performance
- Monitor database performance in PlanetScale
- Check API response times
- Monitor frontend load times

---

## 🚨 **Troubleshooting**

### Common Issues:

1. **Database Connection Failed**
   - Verify DATABASE_URL in Render
   - Check PlanetScale database status
   - Ensure SSL is enabled

2. **CORS Errors**
   - Update CORS configuration in backend
   - Verify frontend URL is allowed

3. **Build Failures**
   - Check package.json dependencies
   - Verify build commands
   - Check for syntax errors

4. **Environment Variables**
   - Ensure all variables are set correctly
   - Check for typos in variable names

---

## 📞 **Support**

If you encounter issues:
1. Check the logs in your deployment platforms
2. Verify all environment variables
3. Test database connectivity
4. Check CORS configuration

---

## 🎉 **Success!**

Once deployed, your application will be available at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Admin**: `https://your-project.vercel.app/admin`

Your estate house plans application is now live and ready for users! 