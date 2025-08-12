import { syncBoatStatusesWithMaintenance, calculateAndUpdateBoatHours } from './src/lib/database-postgres.js';

async function fixDataConsistency() {
  console.log('🔧 Fixing Data Consistency Issues...\n');
  
  try {
    // Step 1: Sync boat statuses with maintenance issues
    console.log('1. Syncing boat statuses with maintenance issues...');
    const syncedCount = await syncBoatStatusesWithMaintenance();
    console.log(`✅ Synced ${syncedCount} boats with maintenance issues\n`);
    
    // Step 2: Recalculate boat hours for existing completed check-ins
    console.log('2. Recalculating boat hours for existing check-ins...');
    
    // Import the database client
    const { getClient } = await import('./src/lib/database-postgres.js');
    const client = await getClient();
    
    try {
      // Get all completed check-ins that don't have boat hours recorded
      const completedCheckIns = await client.query(`
        SELECT c.id, c.member_number, c.boat_id, c.departure_time, c.actual_return
        FROM check_ins c
        LEFT JOIN boat_hours bh ON c.id = bh.check_in_id
        WHERE c.actual_return IS NOT NULL 
        AND bh.check_in_id IS NULL
        AND c.member_number IS NOT NULL
        ORDER BY c.actual_return DESC
      `);
      
      console.log(`Found ${completedCheckIns.rows.length} completed check-ins without boat hours`);
      
      let processedCount = 0;
      for (const checkIn of completedCheckIns.rows) {
        try {
          await calculateAndUpdateBoatHours(checkIn.member_number, checkIn.id);
          processedCount++;
          console.log(`✅ Processed check-in ${checkIn.id} for ${checkIn.member_number}`);
        } catch (error) {
          console.log(`❌ Failed to process check-in ${checkIn.id}: ${error.message}`);
        }
      }
      
      console.log(`\n✅ Successfully processed ${processedCount} check-ins\n`);
      
    } finally {
      client.release();
    }
    
    console.log('🎉 Data consistency fixes completed!');
    console.log('\n📊 Summary:');
    console.log(`- Synced ${syncedCount} boats with maintenance issues`);
    console.log(`- Recalculated boat hours for ${completedCheckIns.rows.length} check-ins`);
    
  } catch (error) {
    console.error('❌ Error fixing data consistency:', error);
  }
}

// Run the fix
fixDataConsistency(); 