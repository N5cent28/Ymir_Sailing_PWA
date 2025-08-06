import { createMember } from './src/lib/database.js';

async function addAdmins() {
  try {
    console.log('🔄 Adding admin members...');
    
    // Add Noah Nicol as admin
    await createMember(
      '1234',           // member number
      'Noah Nicol',     // name
      '+16082172631',   // phone
      'noah@example.com', // email
      true,             // isAdmin
      '123'             // PIN
    );
    console.log('✅ Added Noah Nicol as admin (Member #1234, PIN: 123)');
    
    // Add Steve as admin
    await createMember(
      '5678',           // member number
      'Steve',          // name
      '+1234567890',    // phone
      'steve@example.com', // email
      true,             // isAdmin
      '456'             // PIN
    );
    console.log('✅ Added Steve as admin (Member #5678, PIN: 456)');
    
    console.log('\n🎉 Admin members added successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('Noah Nicol: Member #1234, PIN: 123');
    console.log('Steve: Member #5678, PIN: 456');
    console.log('\nYou can now log in at /en/admin-login');
    
  } catch (error) {
    console.error('❌ Error adding admins:', error);
  }
}

// Run the script
addAdmins(); 