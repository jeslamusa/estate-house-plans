const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupComplete() {
  let connection;
  
  try {
    console.log('🚀 Starting complete database setup...');
    
    // Connect to MySQL server
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
    console.log('📋 Creating tables...');
    
    // Admins table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // House plans table
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

    // Downloads table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_id INT NOT NULL,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE
      )
    `);

    // Payments table for tracking purchases
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        transaction_id VARCHAR(255),
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ All tables created');

    // Create indexes
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_house_plans_created_at ON house_plans(created_at)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_house_plans_is_free ON house_plans(is_free)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_downloads_plan_id ON downloads(plan_id)');
    await connection.execute('CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON downloads(downloaded_at)');

    console.log('✅ Indexes created');

    // Insert admin user
    console.log('👤 Creating admin user...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await connection.execute(`
      INSERT INTO admins (email, password_hash) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE password_hash = ?
    `, ['admin@estateplans.com', passwordHash, passwordHash]);

    console.log('✅ Admin user created');

    // Insert sample house plans
    console.log('🏠 Inserting sample house plans...');
    const samplePlans = [
      {
        name: 'Modern Family Home',
        description: 'A beautiful 3-bedroom modern family home with open concept living space and large windows for natural light. Perfect for growing families who want contemporary design with functionality.',
        length: 24.0,
        width: 16.0,
        area: 384.0,
        bedrooms: 3,
        bathrooms: 2,
        floors: 1,
        price: 0.00,
        is_free: true,
        image_url: '/uploads/images/modern-family-home.jpg',
        file_url: '/uploads/plans/modern-family-home.pdf'
      },
      {
        name: 'Luxury Villa',
        description: 'Spacious 4-bedroom luxury villa with premium finishes, swimming pool, and stunning architectural design. Features high-end materials and smart home technology.',
        length: 32.0,
        width: 20.0,
        area: 640.0,
        bedrooms: 4,
        bathrooms: 3,
        floors: 2,
        price: 49.99,
        is_free: false,
        image_url: '/uploads/images/luxury-villa.jpg',
        file_url: '/uploads/plans/luxury-villa.pdf'
      },
      {
        name: 'Cozy Cottage',
        description: 'Charming 2-bedroom cottage perfect for small families or vacation homes with rustic appeal. Features exposed beams and a warm, inviting atmosphere.',
        length: 18.0,
        width: 12.0,
        area: 216.0,
        bedrooms: 2,
        bathrooms: 1,
        floors: 1,
        price: 0.00,
        is_free: true,
        image_url: '/uploads/images/cozy-cottage.jpg',
        file_url: '/uploads/plans/cozy-cottage.pdf'
      },
      {
        name: 'Contemporary Townhouse',
        description: 'Modern 3-story townhouse with rooftop terrace, perfect for urban living with style. Features open floor plans and energy-efficient design.',
        length: 20.0,
        width: 14.0,
        area: 280.0,
        bedrooms: 3,
        bathrooms: 2.5,
        floors: 3,
        price: 29.99,
        is_free: false,
        image_url: '/uploads/images/contemporary-townhouse.jpg',
        file_url: '/uploads/plans/contemporary-townhouse.pdf'
      },
      {
        name: 'Minimalist Studio',
        description: 'Elegant studio apartment with minimalist design principles. Perfect for singles or couples who appreciate clean lines and efficient use of space.',
        length: 16.0,
        width: 12.0,
        area: 192.0,
        bedrooms: 1,
        bathrooms: 1,
        floors: 1,
        price: 0.00,
        is_free: true,
        image_url: '/uploads/images/minimalist-studio.jpg',
        file_url: '/uploads/plans/minimalist-studio.pdf'
      },
      {
        name: 'Executive Penthouse',
        description: 'Luxurious penthouse with panoramic views and premium amenities. Features high ceilings, custom finishes, and smart home integration.',
        length: 28.0,
        width: 18.0,
        area: 504.0,
        bedrooms: 3,
        bathrooms: 3.5,
        floors: 1,
        price: 79.99,
        is_free: false,
        image_url: '/uploads/images/executive-penthouse.jpg',
        file_url: '/uploads/plans/executive-penthouse.pdf'
      }
    ];

    for (const plan of samplePlans) {
      await connection.execute(`
        INSERT INTO house_plans 
        (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free, image_url, file_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [plan.name, plan.description, plan.length, plan.width, plan.area, plan.bedrooms, plan.bathrooms, plan.floors, plan.price, plan.is_free, plan.image_url, plan.file_url]);
    }

    console.log('✅ Sample house plans inserted');

    // Insert sample downloads for statistics
    console.log('📊 Creating sample download data...');
    const [plans] = await connection.execute('SELECT id FROM house_plans LIMIT 4');
    
    for (let i = 0; i < 15; i++) {
      const randomPlan = plans[Math.floor(Math.random() * plans.length)];
      const randomDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days
      
      await connection.execute(`
        INSERT INTO downloads (plan_id, downloaded_at)
        VALUES (?, ?)
      `, [randomPlan.id, randomDate]);
    }

    // Update download counts
    await connection.execute(`
      UPDATE house_plans hp 
      SET download_count = (
        SELECT COUNT(*) FROM downloads d WHERE d.plan_id = hp.id
      )
    `);

    console.log('✅ Sample download data created');

    // Create uploads directories
    const uploadsDir = path.join(__dirname, 'uploads');
    const imagesDir = path.join(uploadsDir, 'images');
    const plansDir = path.join(uploadsDir, 'plans');

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    if (!fs.existsSync(plansDir)) fs.mkdirSync(plansDir);

    console.log('✅ Upload directories created');

    // Verify setup
    const [planCount] = await connection.execute('SELECT COUNT(*) as count FROM house_plans');
    const [downloadCount] = await connection.execute('SELECT COUNT(*) as count FROM downloads');
    const [adminCount] = await connection.execute('SELECT COUNT(*) as count FROM admins');

    console.log('\n📈 Setup Summary:');
    console.log(`   • House Plans: ${planCount[0].count}`);
    console.log(`   • Downloads: ${downloadCount[0].count}`);
    console.log(`   • Admin Users: ${adminCount[0].count}`);

    await connection.end();
    console.log('\n✅ Complete database setup finished successfully!');
    console.log('\n🔑 Admin Login:');
    console.log('   Email: admin@estateplans.com');
    console.log('   Password: admin123');
    console.log('\n🌐 Access your application:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend API: http://localhost:5000');
    console.log('   Admin Dashboard: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

setupComplete(); 