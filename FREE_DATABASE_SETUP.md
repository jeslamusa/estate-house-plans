# 🆓 Free Database Setup Guide

## 🚀 **Railway (Recommended - Easiest)**

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app/)
2. Click "Start Deploying"
3. Sign up with your GitHub account (free)

### Step 2: Create Database
1. In Railway dashboard, click "New Project"
2. Choose "Deploy from GitHub repo"
3. Select your repository: `jeslamusa/estate-house-plans`
4. Click "Deploy Now"

### Step 3: Add MySQL Database
1. In your Railway project, click "New"
2. Select "Database" → "MySQL"
3. Click "Deploy"
4. Wait for database to be created

### Step 4: Get Connection String
1. Click on your MySQL database
2. Go to "Connect" tab
3. Copy the connection string (looks like: `mysql://user:pass@host:port/database`)

### Step 5: Use in Deployment
- Paste the connection string when prompted in the deployment script

---

## 🆓 **Alternative: Supabase (PostgreSQL)**

### Step 1: Create Supabase Account
1. Go to [Supabase.com](https://supabase.com/)
2. Click "Start your project"
3. Sign up with GitHub (free)

### Step 2: Create Project
1. Click "New Project"
2. Choose your organization
3. Enter project name: `estate-house-plans`
4. Enter database password
5. Choose region (closest to you)
6. Click "Create new project"

### Step 3: Get Connection String
1. Go to Settings → Database
2. Copy the connection string
3. It looks like: `postgresql://postgres:password@host:port/postgres`

---

## 🆓 **Alternative: Neon (PostgreSQL)**

### Step 1: Create Neon Account
1. Go to [Neon.tech](https://neon.tech/)
2. Click "Get Started"
3. Sign up with GitHub (free)

### Step 2: Create Database
1. Click "Create Project"
2. Enter project name: `estate-house-plans`
3. Choose region
4. Click "Create Project"

### Step 3: Get Connection String
1. In your project dashboard
2. Click "Connection Details"
3. Copy the connection string

---

## 🎯 **Which One Should You Choose?**

- **Railway**: Easiest, works with your existing GitHub repo
- **Supabase**: Most features, PostgreSQL
- **Neon**: Fastest, PostgreSQL

**Recommendation**: Start with Railway - it's the simplest! 