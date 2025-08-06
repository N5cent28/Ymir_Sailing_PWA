import { createMember } from './src/lib/database.js';

async function addTestMembers() {
  try {
    console.log('🔄 Adding test members...');
    
    // Add some test members
    const testMembers = [
      {
        memberNumber: '1001',
        name: 'John Smith',
        phone: '+1234567890',
        email: 'john@example.com',
        pin: '111'
      },
      {
        memberNumber: '1002',
        name: 'Sarah Johnson',
        phone: '+1234567891',
        email: 'sarah@example.com',
        pin: '222'
      },
      {
        memberNumber: '1003',
        name: 'Mike Wilson',
        phone: '+1234567892',
        email: 'mike@example.com',
        pin: '333'
      }
    ];
    
    for (const member of testMembers) {
      await createMember(
        member.memberNumber,
        member.name,
        member.phone,
        member.email,
        false, // not admin
        member.pin
      );
      console.log(`✅ Added ${member.name} (Member #${member.memberNumber}, PIN: ${member.pin})`);
    }
    
    console.log('\n🎉 Test members added successfully!');
    console.log('\nTest Member Login Credentials:');
    console.log('John Smith: Member #1001, PIN: 111');
    console.log('Sarah Johnson: Member #1002, PIN: 222');
    console.log('Mike Wilson: Member #1003, PIN: 333');
    console.log('\nYou can now test member login at /en/profile');
    
  } catch (error) {
    console.error('❌ Error adding test members:', error);
  }
}

// Run the script
addTestMembers();