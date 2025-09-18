// Push Notification System
// Handles sending push notifications to specific users

import webpush from 'web-push';

// Configure web-push with VAPID keys
// These should be set as environment variables in production
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BNr0dhFU7WG9GAdFO4vYzJBSYi3sPesGDeZVNayZ8KQMs2MjNMo5oNlM-KcxBiA1NrDPCktRmgfzKWdjBVw9MKY',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'U9LUuJzg9La57veQqnuwLTANvszWeM7dRp3cfW_6byI'
};

webpush.setVapidDetails(
  'mailto:ymir-sailing-club@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function sendPushNotification(title, body, data = {}, targetMemberNumber = null) {
  try {
    // Import database functions
    const { getPushSubscriptions } = await import('./database-postgres.js');
    
    // Get push subscriptions for the target member (or all if no target specified)
    const subscriptions = await getPushSubscriptions(targetMemberNumber);
    
    if (subscriptions.length === 0) {
      console.log(`No push subscriptions found for member ${targetMemberNumber || 'all users'}`);
      return { success: false, message: 'No subscriptions found' };
    }
    
    console.log(`Sending push notification to ${subscriptions.length} subscription(s): ${title} - ${body}`);
    console.log('VAPID Keys:', { publicKey: vapidKeys.publicKey.substring(0, 20) + '...', privateKey: vapidKeys.privateKey ? 'Set' : 'Not Set' });
    
    const results = [];
    
    // Send actual push notifications using web-push
    for (const subscription of subscriptions) {
      try {
        console.log(`Processing subscription for member ${subscription.member_number}:`, {
          endpoint: subscription.endpoint.substring(0, 50) + '...',
          hasP256dh: !!subscription.p256dh,
          hasAuth: !!subscription.auth
        });
        
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        };
        
        const payload = JSON.stringify({
          title: title,
          body: body,
          icon: '/icon-192.svg',
          badge: '/icon-192.svg',
          data: data,
          // Mobile-specific options for wake-up and sound
          requireInteraction: true,  // Keeps notification visible until user interacts
          silent: false,            // Ensures sound plays
          vibrate: [200, 100, 200, 100, 200], // Vibration pattern
          tag: data.type || 'ymir-notification', // Prevents duplicate notifications
          renotify: true,          // Allows re-notification with same tag
          timestamp: Date.now(),
          actions: [
            {
              action: 'view',
              title: 'View Details',
              icon: '/icon-192.svg'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        });
        
        console.log('Sending payload:', { title, body, data });
        await webpush.sendNotification(pushSubscription, payload);
        
        console.log(`✅ Push notification sent to ${subscription.member_number || 'Anonymous'}`);
        results.push({ success: true, member: subscription.member_number });
        
      } catch (pushError) {
        console.error(`❌ Failed to send push notification to ${subscription.member_number}:`, pushError);
        console.error('Push error details:', {
          name: pushError.name,
          message: pushError.message,
          statusCode: pushError.statusCode,
          headers: pushError.headers
        });
        results.push({ success: false, member: subscription.member_number, error: pushError.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    return { 
      success: successCount > 0, 
      messageId: `sent_${Date.now()}`, 
      sentTo: successCount,
      failed: failureCount,
      results: results
    };
    
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
}

export async function sendExtensionReminder(sailorName, boatName, minutesUntilReturn, extensionOptions, memberNumber = null) {
  const title = 'Time Extension Reminder';
  const body = `Hi ${sailorName}, your return time for ${boatName} is in ${minutesUntilReturn} minutes. Would you like to extend?`;
  
  return await sendPushNotification(title, body, {
    type: 'extension_reminder',
    sailorName,
    boatName,
    minutesUntilReturn,
    extensionOptions
  }, memberNumber);
}

export async function sendOverdueAlert(sailorName, boatName, overdueMinutes, memberNumber = null) {
  const hoursOverdue = Math.floor(overdueMinutes / 60);
  const title = 'Boat Return Overdue';
  const body = `Hi ${sailorName}, you are ${hoursOverdue} hour${hoursOverdue > 1 ? 's' : ''} overdue returning ${boatName}. Please return the boat as soon as possible.`;
  
  return await sendPushNotification(title, body, {
    type: 'overdue_alert',
    sailorName,
    boatName,
    overdueMinutes,
    hoursOverdue
  }, memberNumber);
}

export async function sendAdminOverdueAlert(sailorName, boatName, overdueMinutes) {
  const hoursOverdue = Math.floor(overdueMinutes / 60);
  const title = 'ADMIN ALERT: Boat Severely Overdue';
  const body = `${boatName} is ${hoursOverdue} hours overdue. Sailor: ${sailorName}. Immediate action required.`;
  
  return await sendPushNotification(title, body, {
    type: 'admin_overdue_alert',
    sailorName,
    boatName,
    overdueMinutes,
    hoursOverdue,
    priority: 'high'
  });
}

export async function sendCheckInConfirmation(sailorName, boatName) {
  const title = 'Boat Return Confirmed';
  const body = `Thank you ${sailorName}! ${boatName} has been successfully returned.`;
  
  return await sendPushNotification(title, body, {
    type: 'check_in_confirmation',
    sailorName,
    boatName
  });
}

export async function sendCheckOutConfirmation(sailorName, boatName, expectedReturn, type = 'check_out') {
  let title, body;
  
  if (type === 'take_over') {
    title = 'Boat Take-Over Confirmed';
    body = `You have successfully taken over ${boatName}. The previous sailor has been notified. Expected return: ${new Date(expectedReturn).toLocaleString()}`;
  } else {
    title = 'Boat Check-Out Confirmed';
    body = `Enjoy your sail ${sailorName}! ${boatName} is checked out. Expected return: ${new Date(expectedReturn).toLocaleString()}`;
  }
  
  return await sendPushNotification(title, body, {
    type: type === 'take_over' ? 'take_over_confirmation' : 'check_out_confirmation',
    sailorName,
    boatName,
    expectedReturn
  });
}

export async function sendTakeOverNotification(previousSailorName, boatName, newSailorName) {
  const title = 'Boat Responsibility Transferred';
  const body = `Hi ${previousSailorName}, ${newSailorName} has taken over ${boatName}. You are no longer responsible for this boat.`;
  
  return await sendPushNotification(title, body, {
    type: 'take_over_notification',
    previousSailorName,
    boatName,
    newSailorName
  });
} 