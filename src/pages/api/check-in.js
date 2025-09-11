import { createCheckIn, getBoatStatus, createNotification, getMemberByNumber, getActiveCheckIns, updateCheckoutChecklist, completeCheckIn } from '../../lib/database-postgres.js';
import { sendCheckOutConfirmation, sendTakeOverNotification } from '../../lib/notifications.js';

export async function POST({ request }) {
  try {
    console.log('🔍 Check-in API called');
    
    const body = await request.json();
    const { boatId, sailorName, memberNumber, phone, expectedReturn, takeOver, previousCheckInId, safetyChecklist } = body;
    
    console.log('Request body:', { boatId, sailorName, memberNumber, phone, expectedReturn, takeOver, previousCheckInId, safetyChecklist });
    
    // Validate required fields
    if (!boatId || !sailorName || !expectedReturn) {
      console.log('❌ Missing required fields');
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('✅ Required fields validation passed');
    
    // Record current timestamp for departure
    const departureTime = new Date().toISOString();
    console.log('Departure time:', departureTime);
    
    // Check boat status
    console.log('🔍 Getting boat status for:', boatId);
    const boat = await getBoatStatus(boatId);
    console.log('Boat status result:', boat);
    
    if (!boat) {
      console.log('❌ Boat not found');
      return new Response(JSON.stringify({ 
        error: 'Boat not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('✅ Boat found:', boat.name, 'Status:', boat.status);
    
    // For take over, we allow check-out even if boat is not operational
    if (!takeOver) {
      if (boat.status === 'maintenance') {
        console.log('❌ Boat is under maintenance');
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
        console.log('❌ Boat is out of service');
        return new Response(JSON.stringify({ 
          error: 'Boat is out of service',
          boatName: boat.name,
          notes: boat.notes
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // For individual boats, check if already in use (unless it's a shared boat like Kayak or Paddle Board)
      if (boat.boat_type === 'individual') {
        console.log('🔍 Checking active check-ins for individual boat:', boat.name);
        const activeCheckIns = await getActiveCheckIns(boatId);
        console.log('Active check-ins result:', activeCheckIns);
        
        if (activeCheckIns.length > 0) {
          console.log('❌ Boat is already in use');
          return new Response(JSON.stringify({ 
            error: `${boat.name} is currently in use by ${activeCheckIns[0].sailor_name}`,
            boatName: boat.name,
            activeCheckIn: activeCheckIns[0]
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        console.log('✅ No active check-ins found');
      }
    }
    
    console.log('🔍 Creating check-in...');
    
    // Convert expectedReturn from local time to UTC
    // The datetime-local input gives us "YYYY-MM-DDTHH:MM" in local time
    // We need to create a Date object and convert to UTC
    // IMPORTANT: datetime-local input is already in local time, so we don't need to adjust for timezone
    const expectedReturnDate = new Date(expectedReturn);
    const expectedReturnUTC = expectedReturnDate.toISOString();
    
    console.log('Expected return (local):', expectedReturn);
    console.log('Expected return (UTC):', expectedReturnUTC);
    console.log('Current timezone offset:', new Date().getTimezoneOffset());
    console.log('Browser timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log('Date object created:', expectedReturnDate);
    console.log('Date object local string:', expectedReturnDate.toLocaleString());
    console.log('Date object UTC string:', expectedReturnDate.toISOString());
    
    // Create check-in with member info
    const checkInId = await createCheckIn(boatId, sailorName, departureTime, expectedReturnUTC, memberNumber, phone);
    console.log('✅ Check-in created with ID:', checkInId);
    
    // Update safety checklist status if provided
    if (safetyChecklist !== undefined) {
      console.log('🔍 Updating checkout checklist...');
      await updateCheckoutChecklist(checkInId, safetyChecklist);
      console.log('✅ Checkout checklist updated');
    }
    
    // For take over, also check in the previous sailor
    if (takeOver && previousCheckInId) {
      console.log('🔍 TAKEOVER: Processing take-over for previous sailor');
      console.log('- previousCheckInId:', previousCheckInId);
      console.log('- takeOver:', takeOver);
      
      try {
        // Complete the previous sailor's check-in (this will log their trip and calculate hours)
        await completeCheckIn(previousCheckInId);
        console.log('✅ TAKEOVER: Successfully completed previous sailor check-in');
        
        // Create notification for the previous sailor's check-in
        await createNotification(boatId, 'check_in', 
          `Previous sailor automatically checked in when ${sailorName} took over ${boat.name}`
        );
        console.log('✅ TAKEOVER: Created check-in notification');
      } catch (error) {
        console.error('❌ TAKEOVER: Error completing previous sailor check-in:', error);
      }
    } else {
      console.log('🔍 TAKEOVER: Skipping previous sailor check-in');
      console.log('- takeOver:', takeOver);
      console.log('- previousCheckInId:', previousCheckInId);
    }
    
    // Create notification
    if (takeOver) {
      await createNotification(boatId, 'take_over', 
        `${sailorName} took over ${boat.name} from previous sailor at ${new Date(departureTime).toLocaleString()}`
      );
      
      // Send notification to previous sailor if we have their info
      if (previousCheckInId) {
        try {
          const activeCheckIns = await getActiveCheckIns(boatId);
          const previousCheckIn = activeCheckIns.find(checkIn => checkIn.id !== checkInId);
          if (previousCheckIn) {
            await sendTakeOverNotification(previousCheckIn.sailor_name, boat.name, sailorName);
          }
        } catch (error) {
          console.error('Error sending take over notification to previous sailor:', error);
        }
      }
    } else {
      await createNotification(boatId, 'check_out', 
        `${sailorName} checked out ${boat.name} at ${new Date(departureTime).toLocaleString()}`
      );
    }
    
    // Send push notification
    if (takeOver) {
      await sendCheckOutConfirmation(sailorName, boat.name, expectedReturnUTC, 'take_over');
    } else {
      await sendCheckOutConfirmation(sailorName, boat.name, expectedReturnUTC);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      checkInId,
      boatName: boat.name,
      departureTime: departureTime,
      memberNumber: memberNumber,
      sailorName: sailorName,
      message: takeOver ? 
        `Successfully took over ${boat.name}. The previous sailor has been notified.` :
        `${boat.name} checked out successfully! Don't forget to check back in when you return :) Have fun!`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Check-in error:', error);
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
    const memberNumber = url.searchParams.get('memberNumber');
    const boatId = url.searchParams.get('boatId');
    
    // Handle member number lookup
    if (memberNumber) {
      const member = await getMemberByNumber(memberNumber);
      
      if (!member) {
        return new Response(JSON.stringify({ 
          found: false 
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        found: true,
        member: {
          name: member.name,
          phone: member.phone,
          email: member.email
        }
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle boat ID query for active check-ins
    if (boatId) {
      const activeCheckIns = await getActiveCheckIns(boatId);
      
      return new Response(JSON.stringify({ 
        activeCheckIns: activeCheckIns
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Missing member number or boat ID' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Get member error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 