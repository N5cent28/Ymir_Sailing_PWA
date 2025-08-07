import { createMember } from './src/lib/database-postgres.js';

async function reAddMembers() {
  try {
    console.log('🔄 Re-adding all test members...');
    
    // Add Noah as admin
    await createMember(
      '1234', // member number
      'Noah Nicol', // name
      '+1234567890', // phone
      'noah@example.com', // email
      true, // is admin
      '123' // pin
    );
    console.log('✅ Added Noah Nicol as admin (Member #1234, PIN: 123)');
    
    // Add test members from the original add-test-members.js
    await createMember('1001', 'John Smith', '+3541234567', 'john@example.com', false, '111');
    await createMember('1002', 'Emma Johnson', '+3542345678', 'emma@example.com', false, '222');
    await createMember('1003', 'Michael Brown', '+3543456789', 'michael@example.com', false, '333');
    await createMember('1004', 'Sarah Davis', '+3544567890', 'sarah@example.com', false, '444');
    await createMember('1005', 'David Wilson', '+3545678901', 'david@example.com', false, '555');
    await createMember('1006', 'Lisa Anderson', '+3546789012', 'lisa@example.com', false, '666');
    await createMember('1007', 'James Taylor', '+3547890123', 'james@example.com', false, '777');
    await createMember('1008', 'Maria Garcia', '+3548901234', 'maria@example.com', false, '888');
    await createMember('1009', 'Robert Martinez', '+3549012345', 'robert@example.com', false, '999');
    await createMember('1010', 'Jennifer Lee', '+3540123456', 'jennifer@example.com', false, '000');
    
    console.log('✅ Added all test members successfully!');
    console.log('\n🎉 All members re-added successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Noah Nicol: Member #1234, PIN: 123');
    console.log('\nTest Member Credentials:');
    console.log('John Smith: Member #1001, PIN: 111');
    console.log('Emma Johnson: Member #1002, PIN: 222');
    console.log('Michael Brown: Member #1003, PIN: 333');
    console.log('Sarah Davis: Member #1004, PIN: 444');
    console.log('David Wilson: Member #1005, PIN: 555');
    console.log('Lisa Anderson: Member #1006, PIN: 666');
    console.log('James Taylor: Member #1007, PIN: 777');
    console.log('Maria Garcia: Member #1008, PIN: 888');
    console.log('Robert Martinez: Member #1009, PIN: 999');
    console.log('Jennifer Lee: Member #1010, PIN: 000');
    console.log('\nYou can now login as admin at /en/profile');
    console.log('Or test with any of the member accounts above!');
    
  } catch (error) {
    console.error('❌ Error re-adding members:', error);
  }
}

reAddMembers(); 