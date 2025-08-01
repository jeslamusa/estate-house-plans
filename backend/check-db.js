const mysql = require('mysql2');

function checkDatabase() {
  let connection;
  
  try {
    console.log('🔍 Checking database structure...');
    
    // Connect to MySQL
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'estate_house_plans'
    });

    console.log('✅ Connected to database');

    // Check admins table structure
    connection.query('DESCRIBE admins', (err, results) => {
      if (err) {
        console.error('❌ Error describing admins table:', err.message);
        return;
      }
      console.log('📋 Admins table structure:');
      results.forEach(row => {
        console.log(`  - ${row.Field}: ${row.Type} ${row.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
      
      // Check house_plans table structure
      connection.query('DESCRIBE house_plans', (err, results) => {
        if (err) {
          console.error('❌ Error describing house_plans table:', err.message);
          return;
        }
        console.log('\n📋 House_plans table structure:');
        results.forEach(row => {
          console.log(`  - ${row.Field}: ${row.Type} ${row.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
        
        // Check sample data
        connection.query('SELECT * FROM house_plans LIMIT 3', (err, results) => {
          if (err) {
            console.error('❌ Error checking house_plans data:', err.message);
            return;
          }
          console.log('\n📊 Sample house plans:');
          results.forEach(plan => {
            console.log(`  - ID: ${plan.id}, Name: ${plan.name}, Free: ${plan.is_free}, Price: ${plan.price}`);
          });
          
          connection.end();
        });
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

checkDatabase(); 