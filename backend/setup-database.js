const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    // First, connect without specifying database to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS estate_house_plans');
    console.log('✅ Database created/verified');

    // Use the database
    await connection.execute('USE estate_house_plans');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log('✅ Database schema created');

    // Insert sample house plans
    const samplePlans = [
      {
        name: 'Modern Family Home',
        description: 'A beautiful 3-bedroom modern family home with open concept living space and large windows for natural light.',
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
        description: 'Spacious 4-bedroom luxury villa with premium finishes, swimming pool, and stunning architectural design.',
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
        description: 'Charming 2-bedroom cottage perfect for small families or vacation homes with rustic appeal.',
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
        description: 'Modern 3-story townhouse with rooftop terrace, perfect for urban living with style.',
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
      }
    ];

    for (const plan of samplePlans) {
      await connection.execute(
        `INSERT INTO house_plans 
         (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free, image_url, file_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plan.name, plan.description, plan.length, plan.width, plan.area, plan.bedrooms, plan.bathrooms, plan.floors, plan.price, plan.is_free, plan.image_url, plan.file_url]
      );
    }

    console.log('✅ Sample house plans inserted');

    // Create uploads directories if they don't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    const imagesDir = path.join(uploadsDir, 'images');
    const plansDir = path.join(uploadsDir, 'plans');

    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    if (!fs.existsSync(plansDir)) fs.mkdirSync(plansDir);

    console.log('✅ Upload directories created');

    await connection.end();
    console.log('✅ Database setup completed successfully!');
    console.log('📧 Admin email: admin@estateplans.com');
    console.log('🔑 Admin password: admin123');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

setupDatabase(); 