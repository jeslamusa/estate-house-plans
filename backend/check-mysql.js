const mysql = require('mysql2/promise');

async function checkMySQL() {
  try {
    console.log('🔍 Checking MySQL connection...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });

    console.log('✅ MySQL is running and accessible!');
    console.log('✅ Connection successful');
    
    // Test a simple query
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', result);
    
    await connection.end();
    console.log('✅ All checks passed!');
    
  } catch (error) {
    console.error('❌ MySQL Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Check if MySQL service is started');
    console.log('3. Verify username/password in the script');
    console.log('4. Try running: net start mysql');
  }
}

checkMySQL(); 