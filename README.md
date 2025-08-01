# Estate House Plans - Full Stack Application

A modern web application for browsing and purchasing house plans, built with React frontend and Node.js backend.

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

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL (optional - runs in demo mode without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
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

## 🔐 Admin Access

**Demo Credentials:**
- Email: `admin@estateplans.com`
- Password: `admin123`

## 🛒 Purchase System

When users want to buy a house plan:

1. **User fills purchase form** with contact details
2. **Admin receives notification** with customer information
3. **Admin can contact customer** using provided phone/email
4. **Admin approves/rejects** the purchase request

## 📱 Contact Information

- **Phone**: 0765443843
- **Email**: info@estateplans.com
- **Social Media**:
  - Facebook: jesla.mmassy
  - Twitter: _j.e.s.l.a
  - Instagram: _j.e.s.l.a
  - WhatsApp: 0765443843

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email info@estateplans.com or call 0765443843. 