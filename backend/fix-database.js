const mysql = require('mysql2');

function fixDatabase() {
  let connection;
  
  try {
    console.log('🔧 Fixing database schema...');
    
    // Connect to MySQL
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'estate_house_plans'
    });

    console.log('✅ Connected to database');

    // Add missing columns to admins table
    const alterAdminsTable = `
      ALTER TABLE admins 
      ADD COLUMN IF NOT EXISTS name VARCHAR(255) AFTER email,
      ADD COLUMN IF NOT EXISTS bio TEXT AFTER name,
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20) AFTER bio,
      ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500) AFTER phone
    `;
    
    connection.query(alterAdminsTable, (err) => {
      if (err) {
        console.error('❌ Error altering admins table:', err.message);
        return;
      }
      console.log('✅ Admins table updated with missing columns');
      
      // Update existing admin with name
      const updateAdmin = `
        UPDATE admins 
        SET name = 'Admin User' 
        WHERE email = 'admin@estateplans.com'
      `;
      
      connection.query(updateAdmin, (err) => {
        if (err) {
          console.error('❌ Error updating admin:', err.message);
        } else {
          console.log('✅ Admin user updated with name');
        }
        
        // Add some sample plans if they don't exist
        const checkPlans = 'SELECT COUNT(*) as count FROM house_plans';
        connection.query(checkPlans, (err, results) => {
          if (err) {
            console.error('❌ Error checking plans:', err.message);
            connection.end();
            return;
          }
          
          if (results[0].count === 0) {
            console.log('📝 Adding sample plans...');
            
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
                    
                    console.log('✅ Database fix complete!');
                    connection.end();
                  }
                }
              });
            });
          } else {
            console.log('✅ Plans already exist');
            console.log('✅ Database fix complete!');
            connection.end();
          }
        });
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

fixDatabase(); 