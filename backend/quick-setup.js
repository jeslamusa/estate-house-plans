#!/usr/bin/env node

const setupDatabase = require('./setup-database');

console.log('🏠 Estate House Plans - Database Setup');
console.log('=====================================');
console.log('');

// Check if we're in the right directory
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
  console.error('❌ Error: Please run this script from the backend directory');
  console.error('   cd backend && node quick-setup.js');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('⚠️  No .env file found. Creating one with default values...');
  
  const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=estate_house_plans
DB_PORT=3306

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
`;

  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('✅ Created .env file with default values');
  console.log('   Please update the database credentials in .env file');
  console.log('');
}

console.log('🚀 Starting database setup...');
console.log('');

setupDatabase()
  .then(() => {
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Start your frontend: cd ../frontend && npm run dev');
    console.log('   3. Access admin panel: http://localhost:3000/admin');
    console.log('   4. Login with: admin@estateplans.com / admin123');
    console.log('');
  })
  .catch((error) => {
    console.error('');
    console.error('❌ Setup failed!');
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check your database credentials in .env file');
    console.error('   3. Ensure you have proper permissions');
    console.error('   4. Try running: mysql -u root -p');
    console.error('');
    console.error('📞 For help, check the DEPLOYMENT.md file');
    console.error('');
    process.exit(1);
  }); 