const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupAdmin() {
  try {
    // Create database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'estate_house_plans',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to database');

    // Generate password hash for 'admin123'
    const password = 'admin123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    console.log('✅ Generated password hash');

    // Update or insert admin user
    const [result] = await connection.execute(
      'INSERT INTO admins (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
      ['admin@estateplans.com', passwordHash, passwordHash]
    );

    console.log('✅ Admin user created/updated successfully');
    console.log('📧 Email: admin@estateplans.com');
    console.log('🔑 Password: admin123');

    await connection.end();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    process.exit(1);
  }
}

setupAdmin(); 