const mysql = require('mysql2');

function debugDatabase() {
  let connection;
  
  try {
    console.log('🔍 Debugging database...');
    
    // Connect to MySQL
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'estate_house_plans'
    });

    console.log('✅ Connected to database');

    // Check if admins table exists
    connection.query('SHOW TABLES LIKE "admins"', (err, results) => {
      if (err) {
        console.error('❌ Error checking admins table:', err.message);
        return;
      }
      
      if (results.length === 0) {
        console.log('❌ Admins table does not exist!');
        connection.end();
        return;
      }
      
      console.log('✅ Admins table exists');
      
      // Check admins table structure
      connection.query('DESCRIBE admins', (err, results) => {
        if (err) {
          console.error('❌ Error describing admins table:', err.message);
          return;
        }
        
        console.log('📋 Admins table columns:');
        results.forEach(row => {
          console.log(`  - ${row.Field}: ${row.Type}`);
        });
        
        // Check if name column exists
        const hasNameColumn = results.some(row => row.Field === 'name');
        console.log(`\n🔍 Name column exists: ${hasNameColumn}`);
        
        if (!hasNameColumn) {
          console.log('➕ Adding name column...');
          connection.query('ALTER TABLE admins ADD COLUMN name VARCHAR(255) AFTER email', (err) => {
            if (err) {
              console.error('❌ Error adding name column:', err.message);
            } else {
              console.log('✅ Name column added successfully');
            }
            
            // Add other missing columns
            connection.query('ALTER TABLE admins ADD COLUMN bio TEXT AFTER name', (err) => {
              if (err && !err.message.includes('Duplicate column name')) {
                console.error('❌ Error adding bio column:', err.message);
              } else {
                console.log('✅ Bio column added or already exists');
              }
              
              connection.query('ALTER TABLE admins ADD COLUMN phone VARCHAR(20) AFTER bio', (err) => {
                if (err && !err.message.includes('Duplicate column name')) {
                  console.error('❌ Error adding phone column:', err.message);
                } else {
                  console.log('✅ Phone column added or already exists');
                }
                
                connection.query('ALTER TABLE admins ADD COLUMN avatar_url VARCHAR(500) AFTER phone', (err) => {
                  if (err && !err.message.includes('Duplicate column name')) {
                    console.error('❌ Error adding avatar_url column:', err.message);
                  } else {
                    console.log('✅ Avatar_url column added or already exists');
                  }
                  
                  // Update admin with name
                  connection.query("UPDATE admins SET name = 'Admin User' WHERE email = 'admin@estateplans.com'", (err) => {
                    if (err) {
                      console.error('❌ Error updating admin:', err.message);
                    } else {
                      console.log('✅ Admin updated with name');
                    }
                    
                    console.log('✅ Database fixed!');
                    connection.end();
                  });
                });
              });
            });
          });
        } else {
          console.log('✅ Name column already exists');
          connection.end();
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

debugDatabase(); 