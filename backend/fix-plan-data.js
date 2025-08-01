const mysql = require('mysql2');

function fixPlanData() {
  let connection;
  
  try {
    console.log('🔧 Fixing plan data (free vs paid)...');
    
    // Connect to MySQL
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'estate_house_plans'
    });

    console.log('✅ Connected to database');

    // Fix the plans - set is_free correctly based on price
    const updates = [
      { id: 1, name: 'Modern Family Home', price: 0, is_free: true },
      { id: 2, name: 'Luxury Villa', price: 49.99, is_free: false },
      { id: 3, name: 'Cozy Cottage', price: 0, is_free: true },
      { id: 4, name: 'Modern Apartment', price: 29.99, is_free: false },
      { id: 5, name: 'Family Mansion', price: 99.99, is_free: false }
    ];

    let updatesCompleted = 0;
    updates.forEach((update) => {
      const query = 'UPDATE house_plans SET price = ?, is_free = ? WHERE id = ?';
      
      connection.query(query, [update.price, update.is_free, update.id], (err) => {
        if (err) {
          console.error(`❌ Error updating plan ${update.id}:`, err.message);
        } else {
          console.log(`✅ Updated plan ${update.id}: ${update.name} - ${update.is_free ? 'FREE' : '$' + update.price}`);
        }
        
        updatesCompleted++;
        if (updatesCompleted === updates.length) {
          console.log('\n🎉 All plans updated correctly!');
          
          // Verify the changes
          connection.query('SELECT id, name, price, is_free FROM house_plans ORDER BY id', (err, results) => {
            if (err) {
              console.error('❌ Error verifying plans:', err.message);
            } else {
              console.log('\n📊 Updated Plan Data:');
              results.forEach(plan => {
                console.log(`   ${plan.id}. ${plan.name} - ${plan.is_free ? 'FREE' : '$' + plan.price}`);
              });
            }
            connection.end();
          });
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

fixPlanData(); 