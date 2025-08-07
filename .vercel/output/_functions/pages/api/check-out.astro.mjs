import { getActiveCheckIns, updateCheckinChecklist, updateTripNotes, completeCheckIn, createNotification } from '../../chunks/database-postgres_A4NcQA_p.mjs';
import { b as sendCheckInConfirmation } from '../../chunks/notifications_DtnEfCvu.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
  try {
    const { checkInId, checkinChecklist, tripNotes, weatherConditions } = await request.json();
    
    // Validate required fields
    if (!checkInId) {
      return new Response(JSON.stringify({ 
        error: 'Missing check-in ID' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get active check-in
    const activeCheckIns = await getActiveCheckIns();
    const checkIn = activeCheckIns.find(c => c.id === parseInt(checkInId));
    
    if (!checkIn) {
      return new Response(JSON.stringify({ 
        error: 'Check-in not found or already completed' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update check-in checklist if provided
    if (checkinChecklist !== undefined) {
      await updateCheckinChecklist(checkInId, checkinChecklist);
    }
    
    // Update trip notes if provided
    if (tripNotes || weatherConditions) {
      await updateTripNotes(checkInId, tripNotes, weatherConditions);
    }
    
    // Complete check-in
    await completeCheckIn(checkInId);
    
    // Create notification
    await createNotification(checkIn.boat_id, 'check_in', 
      `${checkIn.sailor_name} returned ${checkIn.boat_name || 'boat'} at ${new Date().toLocaleString()}`
    );
    
    // Send push notification
    await sendCheckInConfirmation(checkIn.sailor_name, checkIn.boat_name || 'boat');
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully checked in ${checkIn.sailor_name}`,
      boatName: checkIn.boat_name,
      memberNumber: checkIn.member_number,
      sailorName: checkIn.sailor_name
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Check-out error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
