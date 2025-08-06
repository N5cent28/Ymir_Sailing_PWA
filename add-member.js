import { createMember } from './src/lib/database.js';

async function addDemoMember() {
  try {
    // Add Noah Nicol as a demo member
    await createMember(
      '1234',           // member number
      'Noah Nicol',     // name
      '+16082172631',   // phone
      'noah@example.com' // email (optional)
    );
    
    console.log('✅ Successfully added Noah Nicol as member #1234');
    console.log('📱 Phone: +16082172631');
    console.log('📧 Email: noah@example.com');
    console.log('\nYou can now use member number 1234 to test the system!');
    
  } catch (error) {
    console.error('❌ Error adding member:', error);
  }
}

// Run the script
addDemoMember(); 