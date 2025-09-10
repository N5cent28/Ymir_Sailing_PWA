import { calculateAndUpdateBoatHours } from './src/lib/database-postgres.js';

async function fixNoahBoatHours() {
  try {
    console.log('🔧 Fixing Noah Nicol\'s Boat Hours...\n');
    
    // Connect to database
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    try {
      const client = await pool.connect();
      
      // Get all completed check-ins for Noah Nicol (1234)
      const noahCheckInsResult = await client.query(
        `SELECT c.*, b.name as boat_name 
         FROM check_ins c 
         JOIN boats b ON c.boat_id = b.id 
         WHERE c.member_number = '1234' AND c.actual_return IS NOT NULL
         ORDER BY c.departure_time DESC`
      );
      
      console.log(`Found ${noahCheckInsResult.rows.length} completed trips for Noah Nicol`);
      
      // Get existing boat hours to see which ones are missing
      const existingBoatHoursResult = await client.query(
        'SELECT check_in_id FROM boat_hours WHERE member_number = $1',
        ['1234']
      );
      
      const existingCheckInIds = existingBoatHoursResult.rows.map(r => r.check_in_id);
      console.log(`Existing boat hours for check-ins: ${existingCheckInIds.join(', ')}`);
      
      // Find trips that need boat hours calculated
      const tripsNeedingHours = noahCheckInsResult.rows.filter(
        checkIn => !existingCheckInIds.includes(checkIn.id)
      );
      
      console.log(`\nTrips needing boat hours calculated: ${tripsNeedingHours.length}`);
      
      if (tripsNeedingHours.length === 0) {
        console.log('✅ All trips already have boat hours!');
        return;
      }
      
      // Calculate and record boat hours for missing trips
      let successCount = 0;
      let errorCount = 0;
      
      for (const trip of tripsNeedingHours) {
        try {
          console.log(`\nProcessing ${trip.boat_name} (Check-in ID: ${trip.id})...`);
          
          // Calculate duration manually first to verify
          const departure = new Date(trip.departure_time);
          const return_time = new Date(trip.actual_return);
          const hours = (return_time - departure) / (1000 * 60 * 60);
          
          console.log(`  Duration: ${hours.toFixed(2)} hours`);
          
          // Call the function to calculate and record hours
          await calculateAndUpdateBoatHours('1234', trip.id);
          
          console.log(`  ✅ Successfully recorded ${hours.toFixed(2)} hours`);
          successCount++;
          
        } catch (error) {
          console.error(`  ❌ Error processing trip ${trip.id}:`, error.message);
          errorCount++;
        }
      }
      
      // Verify the fix
      console.log('\n🔍 Verifying the fix...');
      const finalBoatHoursResult = await client.query(
        'SELECT * FROM boat_hours WHERE member_number = $1 ORDER BY recorded_at DESC',
        ['1234']
      );
      
      console.log(`\nFinal boat hours records: ${finalBoatHoursResult.rows.length}`);
      finalBoatHoursResult.rows.forEach(record => {
        console.log(`  - Boat: ${record.boat_id}, Hours: ${record.hours}, Check-in ID: ${record.check_in_id}`);
      });
      
      // Calculate total hours
      const totalHoursResult = await client.query(
        'SELECT SUM(hours) as total_hours FROM boat_hours WHERE member_number = $1',
        ['1234']
      );
      
      const totalHours = totalHoursResult.rows[0].total_hours || 0;
      console.log(`\n🎯 Total hours for Noah Nicol: ${totalHours.toFixed(2)}`);
      
      console.log(`\n📊 Summary:`);
      console.log(`  - Trips processed: ${tripsNeedingHours.length}`);
      console.log(`  - Successfully recorded: ${successCount}`);
      console.log(`  - Errors: ${errorCount}`);
      
      client.release();
      
    } finally {
      await pool.end();
    }
    
    console.log('\n✅ Fix complete!');
    
  } catch (error) {
    console.error('❌ Error during fix:', error);
  }
}

fixNoahBoatHours(); 