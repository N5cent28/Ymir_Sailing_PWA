import { updateBoatStatus, createNotification } from '../../lib/database-postgres.js';

export async function POST({ request }) {
  try {
    const { boatId, status, notes, adminMemberNumber } = await request.json();
    
    // Validate required fields
    if (!boatId || !status) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate status
    const validStatuses = ['operational', 'maintenance', 'out_of_service'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid status' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update boat status (this will check for active check-ins and handle admin member)
    await updateBoatStatus(boatId, status, notes, adminMemberNumber);
    
    // Create notification
    const statusText = status.replace('_', ' ');
    await createNotification(boatId, 'status_change', 
      `Boat status changed to: ${statusText}${notes ? ` - ${notes}` : ''}`
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Boat status updated to ${statusText}`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Update boat status error:', error);
    
    // Check if it's an active check-in error
    if (error.message.includes('currently checked out')) {
      return new Response(JSON.stringify({ 
        error: error.message,
        hasActiveCheckIn: true
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 