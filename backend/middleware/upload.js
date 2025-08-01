const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = './uploads';
const imagesDir = path.join(uploadDir, 'images');
const plansDir = path.join(uploadDir, 'plans');
const avatarsDir = path.join(uploadDir, 'avatars');

[uploadDir, imagesDir, plansDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for both images and plan files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on field name
    if (file.fieldname === 'image') {
      cb(null, imagesDir);
    } else if (file.fieldname === 'planFile') {
      cb(null, plansDir);
    } else if (file.fieldname === 'avatar') {
      cb(null, avatarsDir);
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.round(Math.random() * 1E9));
    let prefix = 'file-';
    if (file.fieldname === 'image') prefix = 'image-';
    else if (file.fieldname === 'planFile') prefix = 'plan-';
    else if (file.fieldname === 'avatar') prefix = 'avatar-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images, plan files, and avatars
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image' || file.fieldname === 'avatar') {
    // Image file validation
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'planFile') {
    // Plan file validation
    const allowedTypes = /pdf|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' || 
                     file.mimetype === 'application/zip' || 
                     file.mimetype === 'application/x-rar-compressed';

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and ZIP files are allowed for plans!'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

// Create single multer instance for both files
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit (covers both image and plan files)
  }
});

// Export the upload middleware
module.exports = {
  upload
}; 