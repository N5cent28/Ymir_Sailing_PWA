import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Import all database functions
import {
  getBoatStatus,
  createCheckIn,
  getActiveCheckIns,
  createMember,
  getMemberByNumber,
  reportMaintenanceIssue,
  getMaintenanceIssues,
  sendMessage,
  getMessages,
  sendFriendRequest,
  getFriends,
  createPlannedOuting,
  getPlannedOutings
} from '../src/lib/database-postgres.js';

async function testAllDatabaseFunctions() {
  console.log('🧪 Testing all database functions...\n');
  
  const client = await pool.connect();
  try {
    // Test 1: Boat Status
    console.log('1️⃣ Testing boat status...');
    const boatStatus = await getBoatStatus('boat-1');
    console.log(`✅ Boat status: ${boatStatus.name} - ${boatStatus.status}`);
    
    // Test 2: Member Management
    console.log('\n2️⃣ Testing member management...');
    const testMemberNumber = 'TEST001';
    const testMemberName = 'Test User';
    
    // Create test member
    await createMember(testMemberNumber, testMemberName, '+1234567890', 'test@example.com');
    console.log(`✅ Created test member: ${testMemberName}`);
    
    // Get test member
    const member = await getMemberByNumber(testMemberNumber);
    console.log(`✅ Retrieved member: ${member.name}`);
    
    // Test 3: Check-in System
    console.log('\n3️⃣ Testing check-in system...');
    const departureTime = new Date();
    const expectedReturn = new Date();
    expectedReturn.setHours(expectedReturn.getHours() + 4);
    
    const checkInId = await createCheckIn('boat-1', testMemberName, departureTime, expectedReturn, testMemberNumber, '+1234567890');
    console.log(`✅ Created check-in: ID ${checkInId}`);
    
    // Get active check-ins
    const activeCheckIns = await getActiveCheckIns('boat-1');
    console.log(`✅ Active check-ins: ${activeCheckIns.length}`);
    
    // Test 4: Maintenance System
    console.log('\n4️⃣ Testing maintenance system...');
    const maintenanceId = await reportMaintenanceIssue({
      boat_id: 'boat-2',
      reported_by: testMemberNumber,
      issue_type: 'test',
      description: 'Test maintenance issue',
      severity: 'low'
    });
    console.log(`✅ Created maintenance issue: ID ${maintenanceId}`);
    
    // Get maintenance issues
    const maintenanceIssues = await getMaintenanceIssues();
    console.log(`✅ Total maintenance issues: ${maintenanceIssues.length}`);
    
    // Test 5: Messaging System
    console.log('\n5️⃣ Testing messaging system...');
    await sendMessage(testMemberNumber, '1234', 'Test message from database test');
    console.log(`✅ Sent test message`);
    
    const messages = await getMessages(testMemberNumber, '1234');
    console.log(`✅ Retrieved ${messages.length} messages`);
    
    // Test 6: Social Features
    console.log('\n6️⃣ Testing social features...');
    await sendFriendRequest(testMemberNumber, '1234');
    console.log(`✅ Sent friend request`);
    
    const friends = await getFriends(testMemberNumber);
    console.log(`✅ Friends count: ${friends.length}`);
    
    // Test 7: Planned Outings
    console.log('\n7️⃣ Testing planned outings...');
    const outingId = await createPlannedOuting({
      title: 'Test Outing',
      description: 'Test outing description',
      date: '2024-01-15',
      time: '14:00',
      location: 'Test Location',
      max_participants: 5,
      created_by: testMemberNumber
    });
    console.log(`✅ Created planned outing: ID ${outingId}`);
    
    const outings = await getPlannedOutings();
    console.log(`✅ Total planned outings: ${outings.length}`);
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await client.query('DELETE FROM outing_participants WHERE outing_id = $1', [outingId]);
    await client.query('DELETE FROM planned_outings WHERE id = $1', [outingId]);
    await client.query('DELETE FROM messages WHERE sender_member_number = $1 OR receiver_member_number = $1', [testMemberNumber]);
    await client.query('DELETE FROM user_friends WHERE member_number1 = $1 OR member_number2 = $1', [testMemberNumber]);
    await client.query('DELETE FROM maintenance_issues WHERE reported_by = $1', [testMemberNumber]);
    await client.query('DELETE FROM check_ins WHERE member_number = $1', [testMemberNumber]);
    await client.query('DELETE FROM members WHERE member_number = $1', [testMemberNumber]);
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 All database functions tested successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testAllDatabaseFunctions().catch(console.error);
}

export { testAllDatabaseFunctions }; 