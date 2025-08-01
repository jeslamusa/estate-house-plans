const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
  let connection;
  
  try {
    console.log('Testing database connection...');
    
    // Try to connect to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS estate_house_plans');
    console.log('✅ Database created/verified');

    // Use the database
    await connection.execute('USE estate_house_plans');

    // Create tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS house_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        length DECIMAL(10,2),
        width DECIMAL(10,2),
        area DECIMAL(10,2),
        bedrooms INT,
        bathrooms INT,
        floors INT,
        price DECIMAL(10,2) DEFAULT 0.00,
        is_free BOOLEAN DEFAULT TRUE,
        image_url VARCHAR(500),
        file_url VARCHAR(500),
        download_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_id INT NOT NULL,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tables created');

    // Insert admin user
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await connection.execute(`
      INSERT INTO admins (email, password_hash) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE password_hash = ?
    `, ['admin@estateplans.com', passwordHash, passwordHash]);

    console.log('✅ Admin user created');

    // Insert sample house plans
    const samplePlans = [
      {
        name: 'Modern Family Home',
        description: 'A beautiful 3-bedroom modern family home with open concept living space.',
        length: 24.0,
        width: 16.0,
        area: 384.0,
        bedrooms: 3,
        bathrooms: 2,
        floors: 1,
        price: 0.00,
        is_free: true
      },
      {
        name: 'Luxury Villa',
        description: 'Spacious 4-bedroom luxury villa with premium finishes.',
        length: 32.0,
        width: 20.0,
        area: 640.0,
        bedrooms: 4,
        bathrooms: 3,
        floors: 2,
        price: 49.99,
        is_free: false
      }
    ];

    for (const plan of samplePlans) {
      await connection.execute(`
        INSERT INTO house_plans 
        (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [plan.name, plan.description, plan.length, plan.width, plan.area, plan.bedrooms, plan.bathrooms, plan.floors, plan.price, plan.is_free]);
    }

    console.log('✅ Sample house plans inserted');

    // Test query
    const [plans] = await connection.execute('SELECT COUNT(*) as count FROM house_plans');
    console.log(`✅ Found ${plans[0].count} house plans in database`);

    await connection.end();
    console.log('✅ Database test completed successfully!');
    console.log('📧 Admin email: admin@estateplans.com');
    console.log('🔑 Admin password: admin123');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

testDatabase(); 