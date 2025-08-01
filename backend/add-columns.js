const mysql = require('mysql2');

function addColumns() {
  let connection;
  
  try {
    console.log('🔧 Adding missing columns...');
    
    // Connect to MySQL
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'estate_house_plans'
    });

    console.log('✅ Connected to database');

    // Add name column
    connection.query('ALTER TABLE admins ADD COLUMN name VARCHAR(255) AFTER email', (err) => {
      if (err && !err.message.includes('Duplicate column name')) {
        console.error('❌ Error adding name column:', err.message);
      } else {
        console.log('✅ Name column added or already exists');
      }
      
      // Add bio column
      connection.query('ALTER TABLE admins ADD COLUMN bio TEXT AFTER name', (err) => {
        if (err && !err.message.includes('Duplicate column name')) {
          console.error('❌ Error adding bio column:', err.message);
        } else {
          console.log('✅ Bio column added or already exists');
        }
        
        // Add phone column
        connection.query('ALTER TABLE admins ADD COLUMN phone VARCHAR(20) AFTER bio', (err) => {
          if (err && !err.message.includes('Duplicate column name')) {
            console.error('❌ Error adding phone column:', err.message);
          } else {
            console.log('✅ Phone column added or already exists');
          }
          
          // Add avatar_url column
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
              
              console.log('✅ All columns added successfully!');
              connection.end();
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

addColumns(); 