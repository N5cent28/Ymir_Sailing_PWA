// Time Extension API
// Handles extending boat return times

import { updateCheckInTime, getAllActiveCheckIns, createNotification } from '../../lib/database-postgres.js';
import { sendPushNotification } from '../../lib/notifications.js';

export async function POST({ request }) {
  try {
    const { checkInId, additionalMinutes, reason } = await request.json();
    
    if (!checkInId || !additionalMinutes) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: checkInId and additionalMinutes' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate additional minutes
    const minutes = parseInt(additionalMinutes);
    if (isNaN(minutes) || minutes <= 0 || minutes > 60) { // Max 1 hour
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid extension time. Must be between 1 and 60 minutes (1 hour)' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get current check-in info
    const activeCheckIns = await getAllActiveCheckIns();
    const checkIn = activeCheckIns.find(c => c.id === parseInt(checkInId));
    
    if (!checkIn) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Check-in not found or already completed' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Calculate new return time
    const currentReturnTime = new Date(checkIn.expected_return);
    const newReturnTime = new Date(currentReturnTime.getTime() + (minutes * 60 * 1000));
    
    // Update the check-in time
    await updateCheckInTime(checkInId, newReturnTime.toISOString());
    
    // Send confirmation notification
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    let timeString = '';
    if (hours > 0) {
      timeString = `${hours} hour${hours > 1 ? 's' : ''}`;
      if (remainingMinutes > 0) {
        timeString += ` and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
    } else {
      timeString = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    await sendPushNotification(
      '⏰ Return Time Extended',
      `Your return time for ${checkIn.boat_name} has been extended by ${timeString}. New return time: ${newReturnTime.toLocaleString()}`,
      {
        type: 'time_extension',
        checkInId: checkInId,
        memberNumber: checkIn.member_number,
        boatName: checkIn.boat_name,
        additionalMinutes: minutes,
        newReturnTime: newReturnTime.toISOString(),
        reason: reason || null
      }
    );
    
    // Create admin notification for the extension
    if (reason) {
      await createNotification(checkIn.boat_id, 'time_extension', 
        `Member ${checkIn.member_number} extended ${checkIn.boat_name} by ${timeString}. Reason: ${reason}`
      );
    } else {
      await createNotification(checkIn.boat_id, 'time_extension', 
        `Member ${checkIn.member_number} extended ${checkIn.boat_name} by ${timeString}`
      );
    }
    
    // Log the extension for admin tracking
    console.log(`Time extension: Member ${checkIn.member_number} extended ${checkIn.boat_name} by ${timeString}${reason ? ` (Reason: ${reason})` : ''}`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Return time extended by ${timeString}`,
      newReturnTime: newReturnTime.toISOString(),
      additionalMinutes: minutes
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Time extension error:', error);
    return new Response(JSON.stringify({ 
      success: false,
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
    const checkInId = url.searchParams.get('checkInId');
    
    if (!checkInId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing checkInId parameter' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get check-in info
    const activeCheckIns = await getAllActiveCheckIns();
    const checkIn = activeCheckIns.find(c => c.id === parseInt(checkInId));
    
    if (!checkIn) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Check-in not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      checkIn: {
        id: checkIn.id,
        boatName: checkIn.boat_name,
        expectedReturn: checkIn.expected_return,
        memberNumber: checkIn.member_number,
        sailorName: checkIn.sailor_name
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get check-in error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}