import { getAllActiveCheckIns, getMemberBoatHours, getTotalBoatHours, calculateAndUpdateBoatHours } from './src/lib/database-postgres.js';

async function debugBoatHours() {
  try {
    console.log('🔍 Debugging Boat Hours Issue...\n');
    
    // 1. Check if there are any active check-ins
    console.log('1. Checking active check-ins...');
    const activeCheckIns = await getAllActiveCheckIns();
    console.log(`   Found ${activeCheckIns.length} active check-ins`);
    
    if (activeCheckIns.length > 0) {
      console.log('   Active check-ins:');
      activeCheckIns.forEach(checkIn => {
        console.log(`   - ${checkIn.boat_name || checkIn.boat_id}: ${checkIn.sailor_name} (${checkIn.member_number})`);
      });
    }
    
    // 2. Check ALL members in the database
    console.log('\n2. Checking all members in database...');
    
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    try {
      const client = await pool.connect();
      
      // Get all members
      const membersResult = await client.query('SELECT member_number, name FROM members ORDER BY member_number');
      console.log(`   Found ${membersResult.rows.length} total members`);
      
      if (membersResult.rows.length > 0) {
        console.log('   Members:');
        membersResult.rows.forEach(member => {
          console.log(`   - ${member.member_number}: ${member.name}`);
        });
      }
      
      // 3. Check ALL check-ins in the database
      console.log('\n3. Checking ALL check-ins in database...');
      const allCheckInsResult = await client.query(
        `SELECT c.*, b.name as boat_name 
         FROM check_ins c 
         JOIN boats b ON c.boat_id = b.id 
         ORDER BY c.departure_time DESC`
      );
      
      console.log(`   Found ${allCheckInsResult.rows.length} total check-ins in database`);
      
      if (allCheckInsResult.rows.length > 0) {
        console.log('   All check-ins:');
        allCheckInsResult.rows.forEach(checkIn => {
          const status = checkIn.actual_return ? 'COMPLETED' : 'ACTIVE';
          const duration = checkIn.actual_return ? 
            `${((new Date(checkIn.actual_return) - new Date(checkIn.departure_time)) / (1000 * 60 * 60)).toFixed(2)}h` : 'N/A';
          console.log(`   - ${checkIn.boat_name}: ${checkIn.sailor_name} (${checkIn.member_number}) [${status}] Duration: ${duration}`);
        });
      }
      
      // 4. Check boat_hours table
      console.log('\n4. Checking boat_hours table...');
      const boatHoursResult = await client.query('SELECT * FROM boat_hours ORDER BY recorded_at DESC');
      console.log(`   Found ${boatHoursResult.rows.length} records in boat_hours table`);
      
      if (boatHoursResult.rows.length > 0) {
        boatHoursResult.rows.forEach(record => {
          console.log(`   - Member: ${record.member_number}, Boat: ${record.boat_id}, Hours: ${record.hours}`);
        });
      }
      
      // 5. Check specific member (Noah Nicol with ID 1234)
      console.log('\n5. Checking for Noah Nicol (ID: 1234)...');
      
      // Check by member number
      const noahCheckInsResult = await client.query(
        `SELECT c.*, b.name as boat_name 
         FROM check_ins c 
         JOIN boats b ON c.boat_id = b.id 
         WHERE c.member_number = $1
         ORDER BY c.departure_time DESC`,
        ['1234']
      );
      
      console.log(`   Found ${noahCheckInsResult.rows.length} check-ins for member 1234`);
      
      if (noahCheckInsResult.rows.length > 0) {
        console.log('   Check-ins for Noah Nicol (1234):');
        noahCheckInsResult.rows.forEach(checkIn => {
          const status = checkIn.actual_return ? 'COMPLETED' : 'ACTIVE';
          const duration = checkIn.actual_return ? 
            `${((new Date(checkIn.actual_return) - new Date(checkIn.departure_time)) / (1000 * 60 * 60)).toFixed(2)}h` : 'N/A';
          console.log(`     - ${checkIn.boat_name}: ${checkIn.sailor_name} [${status}] Duration: ${duration} (ID: ${checkIn.id})`);
        });
      }
      
      // Also check by sailor name in case member_number is different
      const noahByNameResult = await client.query(
        `SELECT c.*, b.name as boat_name 
         FROM check_ins c 
         JOIN boats b ON c.boat_id = b.id 
         WHERE c.sailor_name ILIKE $1
         ORDER BY c.departure_time DESC`,
        ['%Noah%']
      );
      
      console.log(`   Found ${noahByNameResult.rows.length} check-ins for sailors named Noah`);
      
      if (noahByNameResult.rows.length > 0) {
        console.log('   Check-ins for sailors named Noah:');
        noahByNameResult.rows.forEach(checkIn => {
          const status = checkIn.actual_return ? 'COMPLETED' : 'ACTIVE';
          const duration = checkIn.actual_return ? 
            `${((new Date(checkIn.actual_return) - new Date(checkIn.departure_time)) / (1000 * 60 * 60)).toFixed(2)}h` : 'N/A';
          console.log(`     - ${checkIn.boat_name}: ${checkIn.sailor_name} (${checkIn.member_number}) [${status}] Duration: ${duration} (ID: ${checkIn.id})`);
        });
      }
      
      // Check boat hours specifically for member 1234
      console.log('\n6. Checking boat hours for Noah Nicol (1234)...');
      const noahBoatHoursResult = await client.query(
        'SELECT * FROM boat_hours WHERE member_number = $1 ORDER BY recorded_at DESC',
        ['1234']
      );
      
      console.log(`   Found ${noahBoatHoursResult.rows.length} boat hours records for member 1234`);
      
      if (noahBoatHoursResult.rows.length > 0) {
        noahBoatHoursResult.rows.forEach(record => {
          console.log(`     - Boat: ${record.boat_id}, Hours: ${record.hours}, Check-in ID: ${record.check_in_id}`);
        });
      }
      
      // Check total hours for member 1234
      const noahTotalHoursResult = await client.query(
        'SELECT SUM(hours) as total_hours FROM boat_hours WHERE member_number = $1',
        ['1234']
      );
      
      const noahTotalHours = noahTotalHoursResult.rows[0].total_hours || 0;
      console.log(`   Total hours for Noah Nicol: ${noahTotalHours}`);
      
      client.release();
    } finally {
      await pool.end();
    }
    
    console.log('\n✅ Debug complete!');
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  }
}

debugBoatHours(); 