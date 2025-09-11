// Push Notification System
// Handles sending push notifications to specific users

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
    
    // For now, just log the notification details
    // In production, you would send to each subscription endpoint
    for (const subscription of subscriptions) {
      console.log(`📱 Would send to ${subscription.member_number || 'Anonymous'}:`, {
        endpoint: subscription.endpoint,
        title,
        body,
        data,
        // Mobile wake-up and sound configuration
        mobileConfig: {
          wakeUp: true,
          sound: true,
          vibration: true,
          priority: 'high'
        }
      });
    }
    
    // TODO: Implement actual push notification sending using web-push library
    // This would send real notifications that wake phones and make sounds
    /*
    const webpush = require('web-push');
    
    for (const subscription of subscriptions) {
      const payload = JSON.stringify({
        title: title,
        body: body,
        icon: '/icon-192.svg',
        badge: '/icon-192.svg',
        data: data,
        // Mobile-specific options for wake-up and sound
        requireInteraction: true,  // Keeps notification visible until user interacts
        silent: false,            // Ensures sound plays
        vibrate: [200, 100, 200], // Vibration pattern
        tag: data.type || 'ymir-notification', // Prevents duplicate notifications
        renotify: true,          // Allows re-notification with same tag
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
      
      await webpush.sendNotification(subscription, payload);
    }
    */
    
    return { success: true, messageId: 'logged', sentTo: subscriptions.length };
    
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