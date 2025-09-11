// Fix existing timezone data in the database
// This script corrects the 5-hour offset in existing check-ins

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function fixExistingTimezoneData() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Fixing existing timezone data...');
    
    // Get all active check-ins with incorrect expected return times
    const result = await client.query(`
      SELECT id, expected_return, departure_time, sailor_name, boat_name
      FROM check_ins 
      WHERE actual_return IS NULL
      ORDER BY id DESC
    `);
    
    console.log(`Found ${result.rows.length} active check-ins to check`);
    
    for (const checkIn of result.rows) {
      const currentExpectedReturn = new Date(checkIn.expected_return);
      const currentDeparture = new Date(checkIn.departure_time);
      
      console.log(`\n--- Check-in ${checkIn.id} (${checkIn.sailor_name}) ---`);
      console.log(`Boat: ${checkIn.boat_name}`);
      console.log(`Current expected return: ${currentExpectedReturn.toISOString()} (${currentExpectedReturn.toLocaleString()})`);
      console.log(`Current departure: ${currentDeparture.toISOString()} (${currentDeparture.toLocaleString()})`);
      
      // Check if expected return is before departure (which indicates incorrect timezone)
      if (currentExpectedReturn < currentDeparture) {
        console.log(`❌ Expected return is before departure - this needs fixing!`);
        
        // Add 5 hours to fix the timezone offset
        const fixedExpectedReturn = new Date(currentExpectedReturn.getTime() + (5 * 60 * 60 * 1000));
        
        console.log(`Fixed expected return: ${fixedExpectedReturn.toISOString()} (${fixedExpectedReturn.toLocaleString()})`);
        
        // Update the database
        await client.query(
          'UPDATE check_ins SET expected_return = $1 WHERE id = $2',
          [fixedExpectedReturn.toISOString(), checkIn.id]
        );
        
        console.log(`✅ Updated check-in ${checkIn.id}`);
      } else {
        console.log(`✅ Expected return is after departure - looks correct`);
      }
    }
    
    console.log('\n✅ Timezone data fix complete!');
    
  } catch (error) {
    console.error('Error fixing timezone data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixExistingTimezoneData();
