import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4321';

async function testMemberLogin() {
  console.log('🧪 Testing Member Login API...\n');
  
  try {
    // Test 1: Member Login
    console.log('1. Testing member login with valid credentials...');
    const loginResponse = await fetch(`${BASE_URL}/api/member-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        memberNumber: '1001', 
        pin: '111' 
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    if (loginData.success) {
      console.log('✅ Login successful!\n');
      
      // Test 2: Profile API
      console.log('2. Testing profile API...');
      const profileResponse = await fetch(`${BASE_URL}/api/profile?memberNumber=1001`);
      const profileData = await profileResponse.json();
      console.log('Profile Response Status:', profileResponse.status);
      console.log('Profile Response:', JSON.stringify(profileData, null, 2));
      
      if (profileData.success) {
        console.log('✅ Profile API working!\n');
      } else {
        console.log('❌ Profile API failed:', profileData.error);
      }
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testDatabaseDirectly() {
  console.log('\n🔍 Testing Database Directly...\n');
  
  try {
    const { verifyMemberCredentials, getMemberByNumber } = await import('./src/lib/database-postgres.js');
    
    // Test member credentials
    console.log('1. Testing verifyMemberCredentials...');
    const member = await verifyMemberCredentials('1001', '111');
    console.log('Member verification result:', member ? 'SUCCESS' : 'FAILED');
    if (member) {
      console.log('Member data:', JSON.stringify(member, null, 2));
    }
    
    // Test getMemberByNumber
    console.log('\n2. Testing getMemberByNumber...');
    const memberData = await getMemberByNumber('1001');
    console.log('getMemberByNumber result:', memberData ? 'SUCCESS' : 'FAILED');
    if (memberData) {
      console.log('Member data:', JSON.stringify(memberData, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await testDatabaseDirectly();
  await testMemberLogin();
  
  console.log('\n🏁 Tests completed!');
}

runTests(); 