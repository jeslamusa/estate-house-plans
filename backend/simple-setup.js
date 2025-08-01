const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function simpleSetup() {
  let connection;
  
  try {
    console.log('🔧 Simple Database Setup...');
    
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('✅ Connected to MySQL');

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS estate_house_plans');
    console.log('✅ Database created');

    // Use database
    await connection.execute('USE estate_house_plans');
    console.log('✅ Using database');

    // Create admins table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        bio TEXT,
        phone VARCHAR(20),
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admins table created');

    // Create house_plans table
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ House plans table created');

    // Create downloads table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_id INT NOT NULL,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Downloads table created');

    // Insert admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    await connection.execute(`
      INSERT INTO admins (email, password_hash, name) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE password_hash = ?, name = ?
    `, ['admin@estateplans.com', passwordHash, 'Admin User', passwordHash, 'Admin User']);
    console.log('✅ Admin user created');

    // Insert sample plans
    const plans = [
      ['Modern Family Home', 'Beautiful 3-bedroom home', 24, 16, 384, 3, 2, 1, 0, true],
      ['Luxury Villa', 'Spacious 4-bedroom villa', 32, 20, 640, 4, 3, 2, 49.99, false],
      ['Cozy Cottage', 'Charming 2-bedroom cottage', 18, 12, 216, 2, 1, 1, 0, true]
    ];

    for (const plan of plans) {
      await connection.execute(`
        INSERT INTO house_plans 
        (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, plan);
    }
    console.log('✅ Sample plans created');

    // Add some downloads
    for (let i = 0; i < 10; i++) {
      await connection.execute(`
        INSERT INTO downloads (plan_id) VALUES (1)
      `);
    }
    console.log('✅ Sample downloads created');

    // Update download counts
    await connection.execute(`
      UPDATE house_plans hp 
      SET download_count = (
        SELECT COUNT(*) FROM downloads d WHERE d.plan_id = hp.id
      )
    `);
    console.log('✅ Download counts updated');

    console.log('✅ Setup complete!');
    console.log('📧 Admin: admin@estateplans.com');
    console.log('🔑 Password: admin123');

    await connection.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
  }
}

simpleSetup(); 