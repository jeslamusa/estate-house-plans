const axios = require('axios');

async function testFinal() {
  console.log('🧪 Final System Test...\n');
  
  try {
    // Test backend health
    console.log('1️⃣ Testing Backend Health...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', healthResponse.data.status);
    
    // Test plans endpoint
    console.log('\n2️⃣ Testing Plans Endpoint...');
    const plansResponse = await axios.get('http://localhost:5000/api/plans');
    console.log('✅ Plans loaded:', plansResponse.data.plans.length, 'plans');
    
    // Show plan details
    plansResponse.data.plans.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.name} - ${plan.is_free ? 'FREE' : '$' + plan.price}`);
    });
    
    // Test admin login
    console.log('\n3️⃣ Testing Admin Login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@estateplans.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    
    // Test profile endpoint with token
    console.log('\n4️⃣ Testing Profile Endpoint...');
    const token = loginResponse.data.token;
    const profileResponse = await axios.get('http://localhost:5000/api/profile/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile loaded:', profileResponse.data.name);
    
    // Test stats endpoint
    console.log('\n5️⃣ Testing Stats Endpoint...');
    const statsResponse = await axios.get('http://localhost:5000/api/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Stats loaded successfully');
    
    console.log('\n🎉 All Tests Passed! System is working correctly!');
    console.log('\n📱 Your Application URLs:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend: http://localhost:5000');
    console.log('   Admin: http://localhost:3000/admin');
    console.log('\n🔑 Login Credentials:');
    console.log('   Email: admin@estateplans.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testFinal(); 