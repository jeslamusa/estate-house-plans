const mysql = require('mysql2');

function addSampleImages() {
  let connection;
  
  try {
    console.log('🖼️ Adding sample images to plans...');
    
    // Connect to MySQL
    connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306,
      database: 'estate_house_plans'
    });

    console.log('✅ Connected to database');

    // Sample image URLs for house plans
    const imageUpdates = [
      { id: 1, image_url: '/uploads/images/modern-family-home.jpg' },
      { id: 2, image_url: '/uploads/images/luxury-villa.jpg' },
      { id: 3, image_url: '/uploads/images/cozy-cottage.jpg' },
      { id: 4, image_url: '/uploads/images/modern-apartment.jpg' },
      { id: 5, image_url: '/uploads/images/family-mansion.jpg' }
    ];

    let updatesCompleted = 0;
    imageUpdates.forEach((update) => {
      const query = 'UPDATE house_plans SET image_url = ? WHERE id = ?';
      
      connection.query(query, [update.image_url, update.id], (err) => {
        if (err) {
          console.error(`❌ Error updating plan ${update.id}:`, err.message);
        } else {
          console.log(`✅ Updated plan ${update.id} with image: ${update.image_url}`);
        }
        
        updatesCompleted++;
        if (updatesCompleted === imageUpdates.length) {
          console.log('\n🎉 All plans updated with sample images!');
          console.log('📝 Note: These are placeholder image paths. In a real app, you would upload actual images.');
          connection.end();
        }
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) connection.end();
  }
}

addSampleImages(); 