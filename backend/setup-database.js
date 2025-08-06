require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');

const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up database...');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement) {
        await pool.query(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminQuery = `
      INSERT INTO users (name, email, password, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password = EXCLUDED.password,
        role = EXCLUDED.role
      RETURNING id, email, role
    `;

    const adminResult = await pool.query(adminQuery, [
      'Admin User',
      'admin@estateplans.com',
      hashedPassword,
      'admin'
    ]);

    console.log('✅ Admin user created/updated');
    console.log('📧 Email: admin@estateplans.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 ID:', adminResult.rows[0].id);

    // Create sample house plans
    const samplePlans = [
      {
        title: 'Modern Family Home',
        description: 'A beautiful 3-bedroom modern family home with open concept living space and large windows for natural light.',
        price: 0.00,
        bedrooms: 3,
        bathrooms: 2,
        square_feet: 1800,
        image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/modern-family-home.pdf'
      },
      {
        title: 'Luxury Villa',
        description: 'Spacious 4-bedroom luxury villa with premium finishes, swimming pool, and stunning architectural design.',
        price: 49.99,
        bedrooms: 4,
        bathrooms: 3,
        square_feet: 2800,
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/luxury-villa.pdf'
      },
      {
        title: 'Cozy Cottage',
        description: 'Charming 2-bedroom cottage perfect for small families or vacation homes with rustic appeal.',
        price: 0.00,
        bedrooms: 2,
        bathrooms: 1,
        square_feet: 1200,
        image_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/cozy-cottage.pdf'
      },
      {
        title: 'Contemporary Townhouse',
        description: 'Modern 3-story townhouse with rooftop terrace, perfect for urban living with style.',
        price: 29.99,
        bedrooms: 3,
        bathrooms: 2,
        square_feet: 2000,
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/contemporary-townhouse.pdf'
      },
      {
        title: 'Minimalist Bungalow',
        description: 'Clean and simple 2-bedroom bungalow with modern minimalist design and efficient use of space.',
        price: 0.00,
        bedrooms: 2,
        bathrooms: 1,
        square_feet: 1400,
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/minimalist-bungalow.pdf'
      },
      {
        title: 'Executive Mansion',
        description: 'Grand 5-bedroom executive mansion with luxury amenities, home theater, and wine cellar.',
        price: 99.99,
        bedrooms: 5,
        bathrooms: 4,
        square_feet: 4500,
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
        file_url: '/uploads/plans/executive-mansion.pdf'
      }
    ];

    for (const plan of samplePlans) {
      const planQuery = `
        INSERT INTO house_plans (title, description, price, bedrooms, bathrooms, square_feet, image_url, file_url, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (title)
        DO UPDATE SET
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          bedrooms = EXCLUDED.bedrooms,
          bathrooms = EXCLUDED.bathrooms,
          square_feet = EXCLUDED.square_feet,
          image_url = EXCLUDED.image_url,
          file_url = EXCLUDED.file_url
        RETURNING id
      `;

      await pool.query(planQuery, [
        plan.title,
        plan.description,
        plan.price,
        plan.bedrooms,
        plan.bathrooms,
        plan.square_feet,
        plan.image_url,
        plan.file_url
      ]);
    }

    console.log('✅ Sample house plans created');

    // Create uploads directories if they don't exist
    const uploadsDir = path.join(__dirname, 'Uploads');
    const plansDir = path.join(uploadsDir, 'plans');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log('✅ Created uploads directory');
    }
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir);
      console.log('✅ Created plans directory');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📊 Database Summary:');
    console.log('   - Admin user created');
    console.log('   - 6 sample house plans added');
    console.log('   - Upload directories created');
    console.log('');
    console.log('🔗 Access your application:');
    console.log('   - Frontend: http://localhost:3000');
    console.log('   - Backend API: http://localhost:5001');
    console.log('   - Admin Panel: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Database setup failed:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  } finally {
    await pool.end();
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupDatabase;
