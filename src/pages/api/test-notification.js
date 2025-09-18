// Test Notification API
// Allows manual testing of push notifications

import { sendPushNotification } from '../../lib/notifications.js';

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const memberNumber = url.searchParams.get('memberNumber');
    const type = url.searchParams.get('type') || 'test';
    const debug = url.searchParams.get('debug') === 'true';
    
    // Debug: Show subscription count
    if (debug) {
      const { getPushSubscriptions } = await import('../../lib/database-postgres.js');
      const allSubscriptions = await getPushSubscriptions();
      const memberSubscriptions = memberNumber ? await getPushSubscriptions(memberNumber) : [];
      
      return new Response(JSON.stringify({
        success: true,
        debug: true,
        totalSubscriptions: allSubscriptions.length,
        memberSubscriptions: memberSubscriptions.length,
        memberNumber: memberNumber,
        allSubscriptions: allSubscriptions.map(sub => ({
          id: sub.id,
          member_number: sub.member_number,
          endpoint: sub.endpoint.substring(0, 50) + '...',
          user_agent: sub.user_agent,
          created_at: sub.created_at
        }))
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let title, body, data;
    
    switch (type) {
      case 'overdue':
        title = 'Boat Return Overdue';
        body = 'Test: Your boat is overdue. Please return immediately!';
        data = {
          type: 'overdue_alert',
          sailorName: 'Test User',
          boatName: 'Test Boat',
          overdueMinutes: 60
        };
        break;
        
      case 'reminder':
        title = 'Time Extension Reminder';
        body = 'Test: Your return time is in 10 minutes. Would you like to extend?';
        data = {
          type: 'extension_reminder',
          sailorName: 'Test User',
          boatName: 'Test Boat',
          minutesUntilReturn: 10
        };
        break;
        
      case 'checkout':
        title = 'Boat Check-Out Confirmed';
        body = 'Test: Enjoy your sail! Test Boat is checked out.';
        data = {
          type: 'check_out_confirmation',
          sailorName: 'Test User',
          boatName: 'Test Boat'
        };
        break;
        
      default:
        title = 'Test Notification';
        body = 'This is a test notification from Ymir Sailing Club PWA';
        data = {
          type: 'test',
          testData: 'Test notification sent successfully'
        };
    }
    
    console.log(`🧪 Sending test notification to member ${memberNumber || 'all users'}`);
    
    const result = await sendPushNotification(title, body, data, memberNumber);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Test notification sent',
      result: result,
      sentTo: result.sentTo || 0,
      failed: result.failed || 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Test notification error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST({ request }) {
  // Also support POST requests
  return GET({ request });
}
