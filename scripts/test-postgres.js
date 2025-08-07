import { 
  getAllMembers, 
  getBoatStatus, 
  createMember,
  getMemberByNumber
} from '../src/lib/database-postgres.js';

async function testPostgreSQL() {
  console.log('🧪 Testing PostgreSQL database connection...');
  
  try {
    // Test 1: Get all members
    console.log('\n1️⃣ Testing getAllMembers...');
    const members = await getAllMembers();
    console.log(`✅ Found ${members.length} members`);
    
    // Test 2: Get boat status
    console.log('\n2️⃣ Testing getBoatStatus...');
    const boatStatus = await getBoatStatus('boat-1');
    console.log(`✅ Boat status: ${JSON.stringify(boatStatus)}`);
    
    // Test 3: Create a test member
    console.log('\n3️⃣ Testing createMember...');
    const testMemberNumber = `TEST-${Date.now()}`;
    await createMember(testMemberNumber, 'Test User', '123-456-7890', 'test@example.com', false, '1234');
    console.log(`✅ Created test member: ${testMemberNumber}`);
    
    // Test 4: Get the test member
    console.log('\n4️⃣ Testing getMemberByNumber...');
    const testMember = await getMemberByNumber(testMemberNumber);
    console.log(`✅ Retrieved test member: ${testMember.name}`);
    
    console.log('\n🎉 All PostgreSQL tests passed!');
    
  } catch (error) {
    console.error('❌ PostgreSQL test failed:', error);
    throw error;
  }
}

// Run test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testPostgreSQL().catch(console.error);
}

export { testPostgreSQL }; 