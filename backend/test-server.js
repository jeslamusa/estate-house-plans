const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// CORS
app.use(cors());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🖼️  Images endpoint: http://localhost:${PORT}/uploads/images/`);
}); 