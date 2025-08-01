const axios = require('axios');

async function testPayment() {
  console.log('🧪 Testing Payment System...\n');
  
  try {
    // Test backend health
    console.log('1️⃣ Testing Backend Health...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', healthResponse.data.status);
    
    // Test plans endpoint to check free vs paid plans
    console.log('\n2️⃣ Testing Plans (Free vs Paid)...');
    const plansResponse = await axios.get('http://localhost:5000/api/plans');
    console.log('✅ Plans loaded:', plansResponse.data.plans.length, 'plans');
    
    // Show which plans are free vs paid
    const freePlans = plansResponse.data.plans.filter(p => p.is_free);
    const paidPlans = plansResponse.data.plans.filter(p => !p.is_free);
    
    console.log(`💰 Free plans: ${freePlans.length}`);
    freePlans.forEach(plan => {
      console.log(`   - ${plan.name} (ID: ${plan.id})`);
    });
    
    console.log(`💳 Paid plans: ${paidPlans.length}`);
    paidPlans.forEach(plan => {
      console.log(`   - ${plan.name} (ID: ${plan.id}) - $${plan.price}`);
    });
    
    // Test a specific paid plan
    if (paidPlans.length > 0) {
      const paidPlan = paidPlans[0];
      console.log(`\n3️⃣ Testing Paid Plan: ${paidPlan.name}`);
      console.log(`   - ID: ${paidPlan.id}`);
      console.log(`   - Price: $${paidPlan.price}`);
      console.log(`   - Is Free: ${paidPlan.is_free}`);
      console.log(`   - Image: ${paidPlan.image_url}`);
    }
    
    // Test a specific free plan
    if (freePlans.length > 0) {
      const freePlan = freePlans[0];
      console.log(`\n4️⃣ Testing Free Plan: ${freePlan.name}`);
      console.log(`   - ID: ${freePlan.id}`);
      console.log(`   - Price: $${freePlan.price}`);
      console.log(`   - Is Free: ${freePlan.is_free}`);
      console.log(`   - Image: ${freePlan.image_url}`);
    }
    
    console.log('\n🎉 Payment System Test Complete!');
    console.log('\n📱 Test Instructions:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Click on a PAID plan name → Should go to detail page');
    console.log('3. Click "Buy & Download" → Should show payment modal');
    console.log('4. Click on a FREE plan name → Should go to detail page');
    console.log('5. Click "Download Now" → Should download directly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testPayment(); 