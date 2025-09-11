// Notification Check API
// Handles checking and sending notifications for active boats

import { checkAndSendNotifications, triggerTestNotification } from '../../lib/notification-scheduler.js';

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const memberNumber = url.searchParams.get('memberNumber');
    
    if (action === 'test' && memberNumber) {
      // Test notification for a specific member
      await triggerTestNotification(memberNumber);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Test notification sent to member ${memberNumber}` 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'admin-test') {
      // Send test notification to all admins only
      const { sendPushNotification } = await import('../../lib/notifications.js');
      const { getAdmins } = await import('../../lib/database-postgres.js');
      
      const admins = await getAdmins();
      console.log(`🔔 Sending admin test notification to ${admins.length} admin(s)`);
      
      for (const admin of admins) {
        await sendPushNotification(
          '🧪 Admin Test Notification',
          'This is a test notification for administrators only. The notification system is working correctly!',
          {
            type: 'admin_test',
            memberNumber: admin.member_number,
            timestamp: new Date().toISOString()
          },
          admin.member_number
        );
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Admin test notification sent to ${admins.length} admin(s)` 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'check') {
      // Run the full notification check
      await checkAndSendNotifications();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Notification check completed' 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action. Use ?action=check or ?action=test&memberNumber=1234' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Notification check error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }) {
  try {
    const { action, memberNumber, checkInId } = await request.json();
    
    if (action === 'test') {
      await triggerTestNotification(memberNumber);
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Test notification sent to member ${memberNumber}` 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'check') {
      await checkAndSendNotifications();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Notification check completed' 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Notification check error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
