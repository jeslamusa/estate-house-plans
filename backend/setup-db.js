const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Setting up database...');
    
    // Connect to MySQL without database
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('✅ Connected to MySQL');

    // Create database
    connection.query('CREATE DATABASE IF NOT EXISTS estate_house_plans', (err) => {
      if (err) {
        console.error('❌ Error creating database:', err.message);
        return;
      }
      console.log('✅ Database created');
      
      // Use database
      connection.query('USE estate_house_plans', (err) => {
        if (err) {
          console.error('❌ Error using database:', err.message);
          return;
        }
        console.log('✅ Using database');
        
        // Create admins table
        const createAdminsTable = `
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
        `;
        
        connection.query(createAdminsTable, (err) => {
          if (err) {
            console.error('❌ Error creating admins table:', err.message);
            return;
          }
          console.log('✅ Admins table created');
          
          // Create house_plans table
          const createPlansTable = `
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
          `;
          
          connection.query(createPlansTable, (err) => {
            if (err) {
              console.error('❌ Error creating plans table:', err.message);
              return;
            }
            console.log('✅ House plans table created');
            
            // Create downloads table
            const createDownloadsTable = `
              CREATE TABLE IF NOT EXISTS downloads (
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
              
              // Insert admin user
              bcrypt.hash('admin123', 10).then(passwordHash => {
                const insertAdmin = `
                  INSERT INTO admins (email, password_hash, name) 
                  VALUES ('admin@estateplans.com', '${passwordHash}', 'Admin User')
                  ON DUPLICATE KEY UPDATE password_hash = '${passwordHash}', name = 'Admin User'
                `;
                
                connection.query(insertAdmin, (err) => {
                  if (err) {
                    console.error('❌ Error creating admin:', err.message);
                    return;
                  }
                  console.log('✅ Admin user created');
                  
                  // Insert sample plans
                  const plans = [
                    ['Modern Family Home', 'Beautiful 3-bedroom home', 24, 16, 384, 3, 2, 1, 0, true],
                    ['Luxury Villa', 'Spacious 4-bedroom villa', 32, 20, 640, 4, 3, 2, 49.99, false],
                    ['Cozy Cottage', 'Charming 2-bedroom cottage', 18, 12, 216, 2, 1, 1, 0, true]
                  ];
                  
                  let plansInserted = 0;
                  plans.forEach((plan, index) => {
                    const insertPlan = `
                      INSERT INTO house_plans 
                      (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free)
                      VALUES ('${plan[0]}', '${plan[1]}', ${plan[2]}, ${plan[3]}, ${plan[4]}, ${plan[5]}, ${plan[6]}, ${plan[7]}, ${plan[8]}, ${plan[9]})
                    `;
                    
                    connection.query(insertPlan, (err) => {
                      if (err) {
                        console.error(`❌ Error creating plan ${index + 1}:`, err.message);
                      } else {
                        plansInserted++;
                        if (plansInserted === plans.length) {
                          console.log('✅ Sample plans created');
                          
                          // Add some downloads
                          for (let i = 0; i < 10; i++) {
                            connection.query('INSERT INTO downloads (plan_id) VALUES (1)', (err) => {
                              if (err) console.error('❌ Error creating download:', err.message);
                            });
                          }
                          console.log('✅ Sample downloads created');
                          
                          console.log('✅ Setup complete!');
                          console.log('📧 Admin: admin@estateplans.com');
                          console.log('🔑 Password: admin123');
                          
                          connection.end();
                        }
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

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

setupDatabase(); 