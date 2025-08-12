import { completeCheckIn, getActiveCheckInsWithBoatNames, createNotification } from '../../lib/database-postgres.js';

export async function POST({ request }) {
  try {
    const { checkInId } = await request.json();
    
    // Validate required fields
    if (!checkInId) {
      return new Response(JSON.stringify({ 
        error: 'Missing check-in ID' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get active check-ins to verify this check-in exists and is active
    const activeCheckIns = await getActiveCheckInsWithBoatNames();
    const checkIn = activeCheckIns.find(c => c.id === parseInt(checkInId));
    
    if (!checkIn) {
      return new Response(JSON.stringify({ 
        error: 'Check-in not found or already completed' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Force complete the check-in
    await completeCheckIn(checkInId);
    
    // Create admin notification
    await createNotification(checkIn.boat_id, 'admin_force_checkin', 
      `ADMIN: Force checked-in ${checkIn.sailor_name} from ${checkIn.boat_name || checkIn.boat_id}`
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully force checked-in ${checkIn.sailor_name}`,
      boatName: checkIn.boat_name || checkIn.boat_id,
      memberNumber: checkIn.member_number,
      sailorName: checkIn.sailor_name,
      checkInId: checkInId
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Force check-in error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 