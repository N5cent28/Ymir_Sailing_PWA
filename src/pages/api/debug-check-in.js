export async function POST({ request }) {
  try {
    console.log('🔍 Debug check-in process...');
    
    const body = await request.json();
    const { boatId, sailorName, memberNumber, phone, expectedReturn } = body;
    
    console.log('Request body:', { boatId, sailorName, memberNumber, phone, expectedReturn });
    
    // Test environment variables
    console.log('Environment check:');
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    if (!process.env.DATABASE_URL) {
      return new Response(JSON.stringify({ 
        error: 'DATABASE_URL not set'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Test database connection
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    try {
      const client = await pool.connect();
      console.log('✅ Database connection successful');
      
      // Step 1: Test getBoatStatus
      console.log('\n🔍 Step 1: Testing getBoatStatus...');
      try {
        const boatResult = await client.query('SELECT * FROM boats WHERE id = $1', [boatId]);
        const boat = boatResult.rows[0] || { id: boatId, status: 'unknown', name: 'Unknown Boat' };
        console.log('✅ getBoatStatus successful:', boat);
        
        if (!boat || boat.status === 'unknown') {
          return new Response(JSON.stringify({ 
            error: 'Boat not found',
            boatId,
            boat
          }), { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Step 2: Test boat status validation
        console.log('\n🔍 Step 2: Testing boat status validation...');
        if (boat.status === 'maintenance') {
          return new Response(JSON.stringify({ 
            error: 'Boat is currently under maintenance',
            boatName: boat.name,
            notes: boat.notes
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (boat.status === 'out_of_service') {
          return new Response(JSON.stringify({ 
            error: 'Boat is out of service',
            boatName: boat.name,
            notes: boat.notes
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        console.log('✅ Boat status validation passed');
        
        // Step 3: Test getActiveCheckIns for individual boats
        console.log('\n🔍 Step 3: Testing getActiveCheckIns...');
        if (boat.boat_type === 'individual') {
          try {
            const activeCheckInsResult = await client.query(
              `SELECT c.*, b.status as boat_status, b.name as boat_name
               FROM check_ins c 
               JOIN boats b ON c.boat_id = b.id 
               WHERE c.boat_id = $1 AND c.actual_return IS NULL 
               ORDER BY c.departure_time DESC`,
              [boatId]
            );
            
            const activeCheckIns = activeCheckInsResult.rows.filter(checkIn => checkIn.boat_status === 'operational');
            console.log('✅ getActiveCheckIns successful:', activeCheckIns);
            
            if (activeCheckIns.length > 0) {
              return new Response(JSON.stringify({ 
                error: `${boat.name} is currently in use by ${activeCheckIns[0].sailor_name}`,
                boatName: boat.name,
                activeCheckIn: activeCheckIns[0]
              }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } catch (error) {
            console.error('❌ getActiveCheckIns failed:', error);
            return new Response(JSON.stringify({ 
              error: 'getActiveCheckIns failed',
              details: error.message
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        
        // Step 4: Test INSERT into check_ins
        console.log('\n🔍 Step 4: Testing INSERT into check_ins...');
        try {
          const departureTime = new Date().toISOString();
          const insertResult = await client.query(
            `INSERT INTO check_ins (boat_id, sailor_name, member_number, phone, departure_time, expected_return)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [boatId, sailorName, memberNumber, phone, departureTime, expectedReturn]
          );
          
          const checkInId = insertResult.rows[0].id;
          console.log('✅ INSERT successful, checkInId:', checkInId);
          
          // Step 5: Test updateBoatStatus
          console.log('\n🔍 Step 5: Testing updateBoatStatus...');
          try {
            await client.query(
              'UPDATE boats SET status = $1, notes = $2 WHERE id = $3',
              ['checked_out', null, boatId]
            );
            console.log('✅ updateBoatStatus successful');
          } catch (error) {
            console.error('❌ updateBoatStatus failed:', error);
            return new Response(JSON.stringify({ 
              error: 'updateBoatStatus failed',
              details: error.message
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Step 6: Test createNotification
          console.log('\n🔍 Step 6: Testing createNotification...');
          try {
            await client.query(
              'INSERT INTO notifications (boat_id, type, message) VALUES ($1, $2, $3)',
              [boatId, 'check_out', `${sailorName} checked out ${boatId}`]
            );
            console.log('✅ createNotification successful');
          } catch (error) {
            console.error('❌ createNotification failed:', error);
            return new Response(JSON.stringify({ 
              error: 'createNotification failed',
              details: error.message
            }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Clean up the test check-in
          console.log('\n🧹 Cleaning up test check-in...');
          await client.query('DELETE FROM check_ins WHERE id = $1', [checkInId]);
          await client.query('UPDATE boats SET status = $1 WHERE id = $2', ['operational', boatId]);
          
          console.log('✅ All steps completed successfully!');
          
          return new Response(JSON.stringify({ 
            success: true, 
            message: 'All check-in steps completed successfully',
            boatName: boat.name,
            boatStatus: boat.status,
            boatType: boat.boat_type
          }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
          
        } catch (error) {
          console.error('❌ INSERT failed:', error);
          return new Response(JSON.stringify({ 
            error: 'INSERT failed',
            details: error.message
          }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
      } catch (error) {
        console.error('❌ getBoatStatus failed:', error);
        return new Response(JSON.stringify({ 
          error: 'getBoatStatus failed',
          details: error.message
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      client.release();
      
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      await pool.end();
      
      return new Response(JSON.stringify({ 
        error: 'Database connection failed',
        details: dbError.message
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    } finally {
      await pool.end();
    }
    
  } catch (error) {
    console.error('❌ General error:', error);
    return new Response(JSON.stringify({ 
      error: 'General error',
      details: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 