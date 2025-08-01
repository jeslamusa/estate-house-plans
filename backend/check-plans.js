const mysql = require('mysql2');

function checkPlans() {
  let connection;
  
  try {
    console.log('🔍 Checking house plans...');
    
    // Connect to MySQL
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'estate_house_plans'
    });

    console.log('✅ Connected to database');

    // Check house_plans table structure
    connection.query('DESCRIBE house_plans', (err, results) => {
      if (err) {
        console.error('❌ Error describing house_plans table:', err.message);
        return;
      }
      
      console.log('📋 House_plans table columns:');
      results.forEach(row => {
        console.log(`  - ${row.Field}: ${row.Type}`);
      });
      
      // Check all plans
      connection.query('SELECT * FROM house_plans', (err, results) => {
        if (err) {
          console.error('❌ Error checking plans:', err.message);
          return;
        }
        
        console.log(`\n📊 Found ${results.length} plans:`);
        results.forEach(plan => {
          console.log(`  - ID: ${plan.id}`);
          console.log(`    Name: ${plan.name}`);
          console.log(`    Free: ${plan.is_free}`);
          console.log(`    Price: ${plan.price}`);
          console.log(`    Description: ${plan.description}`);
          console.log('    ---');
        });
        
        // Check if we need to add some paid plans
        const freePlans = results.filter(p => p.is_free);
        const paidPlans = results.filter(p => !p.is_free);
        
        console.log(`\n💰 Free plans: ${freePlans.length}`);
        console.log(`💳 Paid plans: ${paidPlans.length}`);
        
        if (paidPlans.length === 0) {
          console.log('\n➕ Adding a paid plan for testing...');
          
          const insertPaidPlan = `
            INSERT INTO house_plans 
            (name, description, length, width, area, bedrooms, bathrooms, floors, price, is_free)
            VALUES ('Luxury Villa', 'Spacious 4-bedroom luxury villa with modern amenities', 32, 20, 640, 4, 3, 2, 49.99, false)
          `;
          
          connection.query(insertPaidPlan, (err) => {
            if (err) {
              console.error('❌ Error adding paid plan:', err.message);
            } else {
              console.log('✅ Paid plan added successfully');
            }
            connection.end();
          });
        } else {
          connection.end();
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

checkPlans(); 