import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkMembers() {
  try {
    console.log('🔍 Checking current members in database...');
    
    const db = await open({
      filename: path.join(process.cwd(), 'boats.db'),
      driver: sqlite3.Database
    });
    
    // Get all members
    const members = await db.all('SELECT member_number, name, phone, email, is_admin, pin FROM members ORDER BY member_number');
    
    console.log(`\n📊 Found ${members.length} members in database:\n`);
    
    members.forEach(member => {
      const pinStatus = member.pin ? `PIN: ${member.pin}` : 'NO PIN SET';
      const adminStatus = member.is_admin ? ' (ADMIN)' : '';
      console.log(`Member #${member.member_number}: ${member.name}${adminStatus} - ${pinStatus}`);
    });
    
    // Check for members without PINs
    const membersWithoutPin = members.filter(m => !m.pin);
    if (membersWithoutPin.length > 0) {
      console.log(`\n⚠️  ${membersWithoutPin.length} members without PINs:`);
      membersWithoutPin.forEach(member => {
        console.log(`  - Member #${member.member_number}: ${member.name}`);
      });
    }
    
    await db.close();
    
  } catch (error) {
    console.error('❌ Error checking members:', error);
  }
}

checkMembers(); 