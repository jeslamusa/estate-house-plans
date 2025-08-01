const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function completeFix() {
  let connection;
  
  try {
    console.log('🔧 Complete System Fix Starting...');
    
    // Connect to MySQL without database
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('✅ Connected to MySQL');

    // Drop and recreate database
    connection.query('DROP DATABASE IF EXISTS estate_house_plans', (err) => {
      if (err) {
        console.error('❌ Error dropping database:', err.message);
        return;
      }
      console.log('🗑️ Old database dropped');
      
      // Create fresh database
      connection.query('CREATE DATABASE estate_house_plans', (err) => {
        if (err) {
          console.error('❌ Error creating database:', err.message);
          return;
        }
        console.log('✅ Fresh database created');
        
        // Use the database
        connection.query('USE estate_house_plans', (err) => {
          if (err) {
            console.error('❌ Error using database:', err.message);
            return;
          }
          console.log('✅ Using database');
          
          // Create admins table with all required columns
          const createAdminsTable = `
            CREATE TABLE admins (
              id INT AUTO_INCREMENT PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              name VARCHAR(255) NOT NULL,
              bio TEXT,
              phone VARCHAR(20),
              avatar_url VARCHAR(500),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          connection.query(createAdminsTable, (err) => {
            if (err) {
              console.error('❌ Error creating admins table:', err.message);
              return;
            }
            console.log('✅ Admins table created with all columns');
            
            // Create house_plans table
            const createPlansTable = `
              CREATE TABLE house_plans (
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
            `;
            
            connection.query(createPlansTable, (err) => {
              if (err) {
                console.error('❌ Error creating plans table:', err.message);
                return;
              }
              console.log('✅ House plans table created');
              
              // Create downloads table
              const createDownloadsTable = `
                CREATE TABLE downloads (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  plan_id INT NOT NULL,
                  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (plan_id) REFERENCES house_plans(id) ON DELETE CASCADE
                )
              `;
              
              connection.query(createDownloadsTable, (err) => {
                if (err) {
                  console.error('❌ Error creating downloads table:', err.message);
                  return;
                }
                console.log('✅ Downloads table created');
                
                // Create admin user
                bcrypt.hash('admin123', 10).then(passwordHash => {
                  const insertAdmin = `
                    INSERT INTO admins (email, password_hash, name, bio, phone) 
                    VALUES (?, ?, ?, ?, ?)
                  `;
                  
                  connection.query(insertAdmin, [
                    'admin@estateplans.com',
                    passwordHash,
                    'Admin User',
                    'System Administrator',
                    '+1234567890'
                  ], (err) => {
                    if (err) {
                      console.error('❌ Error creating admin:', err.message);
                      return;
                    }
                    console.log('✅ Admin user created');
                    
                    // Insert sample plans (mix of free and paid)
                    const plans = [
                      ['Modern Family Home', 'Beautiful 3-bedroom home with open concept design', 24, 16, 384, 3, 2, 1, 0, true],
                      ['Luxury Villa', 'Spacious 4-bedroom luxury villa with modern amenities', 32, 20, 640, 4, 3, 2, 49.99, false],
                      ['Cozy Cottage', 'Charming 2-bedroom cottage perfect for small families', 18, 12, 216, 2, 1, 1, 0, true],
                      ['Modern Apartment', 'Contemporary 2-bedroom apartment design', 20, 15, 300, 2, 2, 1, 29.99, false],
                      ['Family Mansion', 'Large 5-bedroom mansion with premium features', 40, 25, 1000, 5, 4, 2, 99.99, false]
                    ];
                    
                    let plansInserted = 0;
                    plans.forEach((plan, index) => {
                      const insertPlan = `
                        INSERT INTO house_plans 
                        (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                      `;
                      
                      connection.query(insertPlan, plan, (err) => {
                        if (err) {
                          console.error(`❌ Error creating plan ${index + 1}:`, err.message);
                        } else {
                          plansInserted++;
                          console.log(`✅ Plan ${index + 1} created: ${plan[0]}`);
                        }
                        
                        if (plansInserted === plans.length) {
                          console.log('✅ All sample plans created');
                          
                          // Add some sample downloads
                          for (let i = 0; i < 15; i++) {
                            const planId = Math.floor(Math.random() * 5) + 1;
                            connection.query('INSERT INTO downloads (plan_id) VALUES (?)', [planId], (err) => {
                              if (err) console.error('❌ Error creating download:', err.message);
                            });
                          }
                          console.log('✅ Sample downloads created');
                          
                          // Update download counts
                          connection.query(`
                            UPDATE house_plans hp 
                            SET download_count = (
                              SELECT COUNT(*) FROM downloads d WHERE d.plan_id = hp.id
                            )
                          `, (err) => {
                            if (err) {
                              console.error('❌ Error updating download counts:', err.message);
                            } else {
                              console.log('✅ Download counts updated');
                            }
                            
                            // Create upload directories
                            const uploadDirs = ['uploads', 'uploads/images', 'uploads/plans', 'uploads/avatars'];
                            uploadDirs.forEach(dir => {
                              const dirPath = path.join(__dirname, dir);
                              if (!fs.existsSync(dirPath)) {
                                fs.mkdirSync(dirPath, { recursive: true });
                                console.log(`✅ Created directory: ${dir}`);
                              }
                            });
                            
                            console.log('\n🎉 Complete System Fix Successful!');
                            console.log('📧 Admin: admin@estateplans.com');
                            console.log('🔑 Password: admin123');
                            console.log('💰 Free plans: 2');
                            console.log('💳 Paid plans: 3');
                            
                            connection.end();
                          });
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

completeFix(); 