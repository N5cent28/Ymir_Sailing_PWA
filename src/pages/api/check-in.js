import { createCheckIn, getBoatStatus, createNotification, getMemberByNumber, getActiveCheckIns, updateCheckoutChecklist, completeCheckIn } from '../../lib/database-postgres.js';
import { sendCheckOutConfirmation, sendTakeOverNotification } from '../../lib/notifications.js';

// Helper function to get timezone offset in minutes
function getTimezoneOffset(timezone) {
  const now = new Date();
  const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  const target = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
  return (target.getTime() - utc.getTime()) / 60000;
}

export async function POST({ request }) {
  try {
    console.log('🔍 Check-in API called');
    
    const body = await request.json();
    const { boatId, sailorName, memberNumber, phone, expectedReturn, takeOver, previousCheckInId, safetyChecklist, userTimezone } = body;
    
    console.log('Request body:', { boatId, sailorName, memberNumber, phone, expectedReturn, takeOver, previousCheckInId, safetyChecklist, userTimezone });
    
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
    
    // Convert expectedReturn from user's local time to UTC
    // The datetime-local input gives us "YYYY-MM-DDTHH:MM" in the user's local timezone
    // But the server runs in UTC, so we need to handle timezone conversion properly
    
    console.log('🔍 DETAILED TIMEZONE DEBUG:');
    console.log('Expected return (local input):', expectedReturn);
    console.log('Server timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log('Server timezone offset (minutes):', new Date().getTimezoneOffset());
    
    // The datetime-local input is in user's local timezone, but server interprets it as UTC
    // We need to get the user's timezone from the request or assume a default
    const detectedUserTimezone = userTimezone || 'America/Chicago'; // Use provided timezone or default
    
    // Parse the datetime-local input and treat it as if it's in the user's timezone
    const [datePart, timePart] = expectedReturn.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    
    // Create a date object in the user's timezone
    // We'll use a simpler approach: create the date as if it's in the user's timezone
    
    // Create a date in the user's timezone by using the Intl API
    const userDate = new Date(year, month - 1, day, hour, minute);
    
    // Get the timezone offset for the user's timezone
    const userTimezoneOffset = getTimezoneOffset(detectedUserTimezone);
    
    // Convert to UTC by subtracting the user's timezone offset
    const expectedReturnUTC = new Date(userDate.getTime() - (userTimezoneOffset * 60000));
    
    console.log('Parsed date components:', { year, month, day, hour, minute });
    console.log('User timezone:', detectedUserTimezone);
    console.log('User timezone offset (minutes):', userTimezoneOffset);
    console.log('Expected return (Date object):', expectedReturnUTC);
    console.log('Expected return (Date object toString):', expectedReturnUTC.toString());
    console.log('Expected return (Date object toISOString):', expectedReturnUTC.toISOString());
    
    // Verify the conversion is working correctly
    const verificationDate = new Date(expectedReturnUTC.toISOString());
    console.log('Verification - UTC back to local:', verificationDate.toLocaleString());
    console.log('Verification - UTC back to local (with timezone):', verificationDate.toLocaleString('en-US', { timeZoneName: 'short' }));
    
    const expectedReturnUTCString = expectedReturnUTC.toISOString();
    
    // Create check-in with member info
    const checkInId = await createCheckIn(boatId, sailorName, departureTime, expectedReturnUTCString, memberNumber, phone);
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
          `Previous sailor automatically checked in when ${sailorName} took over ${boat.name} (${boatId})`
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
    
    // Create notification (only for take-over, regular check-out is handled in createCheckIn)
    if (takeOver) {
      await createNotification(boatId, 'take_over', 
        `${sailorName} took over ${boat.name} (${boatId}) from previous sailor at ${new Date(departureTime).toLocaleString()}`
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
    }
    
    // Handle push subscription for notifications
    if (memberNumber) {
      try {
        console.log('🔗 Checking push subscription for member:', memberNumber);
        const { getPushSubscriptions, updatePushSubscriptionMember, storePushSubscription } = await import('../../lib/database-postgres.js');
        
        // Check if there's already a subscription for this member
        const memberSubscriptions = await getPushSubscriptions(memberNumber);
        
        if (memberSubscriptions.length > 0) {
          // Member already has a subscription - check if it has proper keys
          const existingSub = memberSubscriptions[0];
          if (existingSub.p256dh && existingSub.auth) {
            console.log('✅ Member already has valid push subscription with keys');
          } else {
            console.log('⚠️ Member subscription exists but missing keys - will need to be updated');
          }
        } else {
          // No subscription for this member - check if there's an anonymous one we can link
          const allSubscriptions = await getPushSubscriptions();
          const anonymousSubscriptions = allSubscriptions.filter(sub => !sub.member_number);
          
          if (anonymousSubscriptions.length > 0) {
            // Find the most recent anonymous subscription with proper keys
            const validAnonymousSubs = anonymousSubscriptions.filter(sub => sub.p256dh && sub.auth);
            
            if (validAnonymousSubs.length > 0) {
              // Link the most recent valid anonymous subscription to this member
              const latestValidAnonymous = validAnonymousSubs[0];
              console.log('🔗 Linking valid anonymous subscription to member:', memberNumber);
              
              await updatePushSubscriptionMember({
                endpoint: latestValidAnonymous.endpoint,
                p256dh: latestValidAnonymous.p256dh,
                auth: latestValidAnonymous.auth,
                userAgent: latestValidAnonymous.user_agent,
                memberNumber: memberNumber,
                timestamp: new Date().toISOString()
              });
              
              console.log('✅ Valid anonymous subscription linked to member:', memberNumber);
            } else {
              console.log('⚠️ No valid anonymous subscriptions found - notifications will not be sent');
              console.log('💡 User should grant notification permission to receive alerts');
            }
          } else {
            console.log('⚠️ No push subscription found for member - notifications will not be sent');
            console.log('💡 User should grant notification permission to receive alerts');
          }
        }
      } catch (error) {
        console.error('❌ Error handling push subscription:', error);
      }
    }
    
    // Send push notification
    if (takeOver) {
      await sendCheckOutConfirmation(sailorName, boat.name, expectedReturnUTCString, 'take_over');
    } else {
      await sendCheckOutConfirmation(sailorName, boat.name, expectedReturnUTCString);
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