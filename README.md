# 🏠 Estate House Plans - Full Stack Application

A modern web application for browsing and purchasing house plans, built with React frontend and Node.js backend.

## 🌐 Live Demo

- **Frontend**: [https://estate-house-plans-frontend.onrender.com](https://estate-house-plans-frontend.onrender.com)
- **Admin Dashboard**: [https://estate-house-plans-frontend.onrender.com/admin](https://estate-house-plans-frontend.onrender.com/admin)
- **Backend API**: [https://estate-house-plans-backend.onrender.com](https://estate-house-plans-backend.onrender.com)

## 🔐 Admin Access

- **Email**: `admin@estateplans.com`
- **Password**: `admin123`

## 🏠 Features

### For Users
- **Browse House Plans**: View a collection of architectural designs
- **Filter & Search**: Find plans by bedrooms, bathrooms, area, and price
- **Purchase System**: Buy paid plans with contact form
- **Free Downloads**: Download free house plans instantly
- **Responsive Design**: Works on desktop, tablet, and mobile

### For Admins
- **Admin Dashboard**: Manage house plans and view analytics
- **Purchase Notifications**: Get notified when users want to buy plans
- **Customer Details**: View customer contact information for communication
- **Plan Management**: Add, edit, and delete house plans

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MySQL** database (with demo mode fallback)
- **JWT** authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL (optional - runs in demo mode without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeslamusa/estate-house-plans.git
   cd estate-house-plans
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Backend (.env file in backend folder)
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=estate_house_plans
   DB_PORT=3306
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5001
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Admin Dashboard: http://localhost:3000/admin

## 🚀 Free Deployment (Render)

### Option 1: One-Click Deploy (Recommended)

1. **Click the button below to deploy to Render:**
   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy/schema-new?schema=https://raw.githubusercontent.com/jeslamusa/estate-house-plans/main/render.yaml)

2. **Or manually deploy:**
   - Go to [Render.com](https://render.com)
   - Sign up with your GitHub account
   - Click "New +" → "Blueprint"
   - Connect your repository: `jeslamusa/estate-house-plans`
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to deploy both frontend and backend

### Option 2: Manual Deployment

#### Backend Deployment
1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `estate-house-plans-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-secret-key
   ```

#### Frontend Deployment
1. Click "New +" → "Static Site"
2. Configure:
   - **Name**: `estate-house-plans-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

## 📱 Contact Information

- **Phone**: 0765443843
- **Email**: info@estateplans.com
- **Social Media**:
  - Facebook: jesla.mmassy
  - Twitter: _j.e.s.l.a
  - Instagram: _j.e.s.l.a
  - WhatsApp: 0765443843

## 🛒 Purchase System

When users want to buy a house plan:

1. **User fills purchase form** with contact details
2. **Admin receives notification** with customer information
3. **Admin can contact customer** using provided phone/email
4. **Admin approves/rejects** the purchase request

## 📁 Project Structure

```
estate-house-plans/
├── backend/                 # Node.js/Express server
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=estate_house_plans
DB_PORT=3306
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 🆘 Support

For support, email info@estateplans.com or call 0765443843.

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the real estate community** 