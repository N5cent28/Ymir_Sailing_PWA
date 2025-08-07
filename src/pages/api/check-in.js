import { createCheckIn, getBoatStatus, createNotification, getMemberByNumber, getActiveCheckIns, updateCheckoutChecklist, completeCheckIn } from '../../lib/database-postgres.js';
import { sendCheckOutConfirmation, sendTakeOverNotification } from '../../lib/notifications.js';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { boatId, sailorName, memberNumber, phone, expectedReturn, takeOver, previousCheckInId, safetyChecklist } = body;
    
    // Validate required fields
    if (!boatId || !sailorName || !expectedReturn) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Record current timestamp for departure
    const departureTime = new Date().toISOString();
    
    // Check boat status
    const boat = await getBoatStatus(boatId);
    
    if (!boat) {
      return new Response(JSON.stringify({ 
        error: 'Boat not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For take over, we allow check-out even if boat is not operational
    if (!takeOver) {
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
      
      // For individual boats, check if already in use (unless it's a shared boat like Kayak or Paddle Board)
      if (boat.boat_type === 'individual') {
        const activeCheckIns = await getActiveCheckIns(boatId);
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
      }
    }
    
    // Create check-in with member info
    const checkInId = await createCheckIn(boatId, sailorName, departureTime, expectedReturn, memberNumber, phone);
    
    // Update safety checklist status if provided
    if (safetyChecklist !== undefined) {
      await updateCheckoutChecklist(checkInId, safetyChecklist);
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
      await sendCheckOutConfirmation(sailorName, boat.name, expectedReturn, 'take_over');
    } else {
      await sendCheckOutConfirmation(sailorName, boat.name, expectedReturn);
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