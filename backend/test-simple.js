const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Testing MySQL connection...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('✅ MySQL connection successful');
    
    // Test database creation
    await connection.execute('CREATE DATABASE IF NOT EXISTS estate_house_plans');
    console.log('✅ Database created/verified');
    
    await connection.execute('USE estate_house_plans');
    console.log('✅ Using database');
    
    // Test table creation
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admins table created');
    
    await connection.end();
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection(); 