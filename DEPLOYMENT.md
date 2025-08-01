# 🚀 Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**: `jeslamusa/estate-house-plans`
5. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

```
VITE_API_URL=https://your-backend-url.com/api
```

**Replace `your-backend-url.com` with your actual backend URL**

### Step 3: Deploy

Click "Deploy" and wait for the build to complete.

## Backend Deployment (Railway/Heroku)

### Option 1: Railway (Recommended)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Deploy from GitHub repo**: `jeslamusa/estate-house-plans`
5. **Set Root Directory**: `backend`
6. **Add Environment Variables**:
   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=estate_house_plans
   DB_PORT=3306
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5001
   NODE_ENV=production
   ```

### Option 2: Heroku

1. **Install Heroku CLI**
2. **Login to Heroku**
3. **Create new app**
4. **Deploy using Git**

## Database Setup

### Option 1: Railway Database
- Create a MySQL database in Railway
- Use the provided connection string

### Option 2: PlanetScale
- Create a free MySQL database at [PlanetScale.com](https://planetscale.com)
- Use the connection string provided

### Option 3: Local MySQL (for testing)
- Install MySQL locally
- Create database: `estate_house_plans`
- Run: `mysql -u root -p < backend/database/schema.sql`

## Demo Mode (No Database Required)

The application can run in demo mode without a database:

1. **Set environment variable**: `NODE_ENV=demo`
2. **Backend will use mock data**
3. **All features work except data persistence**

## Testing Your Deployment

### Frontend URL
- Your Vercel URL will be: `https://your-project.vercel.app`

### Backend URL
- Your Railway/Heroku URL will be: `https://your-app.railway.app`

### Update Frontend Environment
After getting your backend URL, update the Vercel environment variable:
```
VITE_API_URL=https://your-app.railway.app/api
```

## Admin Access

- **URL**: `https://your-project.vercel.app/admin`
- **Email**: `admin@estateplans.com`
- **Password**: `admin123`

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure backend allows your frontend domain
2. **API 404**: Check if backend URL is correct in environment variables
3. **Build Failures**: Check if all dependencies are in package.json

### Support
- **Phone**: 0765443843
- **Email**: info@estateplans.com 