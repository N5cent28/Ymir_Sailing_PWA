import { completeCheckIn, getAllActiveCheckIns, createNotification } from '../../lib/database-postgres.js';

export async function POST({ request }) {
  try {
    console.log('Force check-in API called');
    
    const { checkInId } = await request.json();
    console.log('Received checkInId:', checkInId);
    
    // Validate required fields
    if (!checkInId) {
      console.log('Missing check-in ID');
      return new Response(JSON.stringify({ 
        error: 'Missing check-in ID' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get active check-ins to verify this check-in exists and is active
    console.log('Fetching active check-ins...');
    const activeCheckIns = await getAllActiveCheckIns();
    console.log('Active check-ins found:', activeCheckIns.length);
    
    const checkIn = activeCheckIns.find(c => c.id === parseInt(checkInId));
    console.log('Found check-in:', checkIn);
    
    if (!checkIn) {
      console.log('Check-in not found or already completed');
      return new Response(JSON.stringify({ 
        error: 'Check-in not found or already completed' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Force complete the check-in
    console.log('Completing check-in...');
    await completeCheckIn(checkInId);
    console.log('Check-in completed successfully');
    
    // Create admin notification
    console.log('Creating admin notification...');
    await createNotification(checkIn.boat_id, 'admin_force_checkin', 
      `ADMIN: Force checked-in ${checkIn.sailor_name} from ${checkIn.boat_name || checkIn.boat_id}`
    );
    console.log('Admin notification created');
    
    const response = {
      success: true, 
      message: `Successfully force checked-in ${checkIn.sailor_name}`,
      boatName: checkIn.boat_name || checkIn.boat_id,
      memberNumber: checkIn.member_number,
      sailorName: checkIn.sailor_name,
      checkInId: checkInId
    };
    
    console.log('Returning success response:', response);
    
    return new Response(JSON.stringify(response), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Force check-in error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 