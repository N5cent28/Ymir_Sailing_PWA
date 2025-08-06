import { getActiveCheckIns, updateCheckInTime, createNotification } from '../../lib/database.js';

export async function POST({ request }) {
  try {
    const { checkInId, newReturnTime } = await request.json();
    
    // Validate required fields
    if (!checkInId || !newReturnTime) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the check-in time
    await updateCheckInTime(checkInId, newReturnTime);
    
    // Get the check-in details for notification
    const activeCheckIns = await getActiveCheckIns();
    const checkIn = activeCheckIns.find(c => c.id === parseInt(checkInId));
    
    if (checkIn) {
      // Create notification
      await createNotification(checkIn.boat_id, 'time_extension', 
        `${checkIn.sailor_name} extended return time to ${new Date(newReturnTime).toLocaleString()}`
      );
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Return time extended to ${new Date(newReturnTime).toLocaleString()}`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Extend time error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const boatId = url.searchParams.get('boatId');
    
    if (!boatId) {
      return new Response(JSON.stringify({ 
        error: 'Missing boat ID' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get active check-ins for this boat
    const activeCheckIns = await getActiveCheckIns(boatId);
    
    if (activeCheckIns.length === 0) {
      return new Response(JSON.stringify({ 
        hasActiveCheckIn: false 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const checkIn = activeCheckIns[0];
    const expectedReturn = new Date(checkIn.expected_return);
    const now = new Date();
    const timeUntilReturn = expectedReturn - now;
    const minutesUntilReturn = Math.floor(timeUntilReturn / (1000 * 60));
    
    // Check if return time is within 10 minutes
    const isNearReturn = minutesUntilReturn <= 10 && minutesUntilReturn > -30; // Allow 30 min grace period
    
    if (!isNearReturn) {
      return new Response(JSON.stringify({ 
        hasActiveCheckIn: true,
        isNearReturn: false,
        minutesUntilReturn
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Calculate extension options
    const extensionOptions = [
      { label: '15 minutes', minutes: 15 },
      { label: '30 minutes', minutes: 30 },
      { label: '1 hour', minutes: 60 }
    ].map(option => ({
      ...option,
      newTime: new Date(expectedReturn.getTime() + option.minutes * 60 * 1000).toISOString()
    }));
    
    return new Response(JSON.stringify({ 
      hasActiveCheckIn: true,
      isNearReturn: true,
      minutesUntilReturn,
      checkIn: {
        id: checkIn.id,
        sailorName: checkIn.sailor_name,
        expectedReturn: checkIn.expected_return,
        departureTime: checkIn.departure_time
      },
      extensionOptions
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get extension options error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 