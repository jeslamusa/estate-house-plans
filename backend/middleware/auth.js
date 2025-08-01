require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Use the same simple secret
    const jwtSecret = 'simple-secret-2024';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Mock admin verification for demo mode
    const mockAdmin = {
      id: 1,
      email: 'admin@estateplans.com'
    };

    if (decoded.adminId !== mockAdmin.id) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.admin = mockAdmin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = auth; 