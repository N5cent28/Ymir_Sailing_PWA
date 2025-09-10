// Notification Scheduler for Ymir Sailing Club
// Handles all timing-based notifications for check-ins and overdue boats

import { getAllActiveCheckIns } from './database-postgres.js';
import { 
  sendPushNotification, 
  sendExtensionReminder, 
  sendOverdueAlert, 
  sendAdminOverdueAlert 
} from './notifications.js';

// Track which notifications have been sent to avoid duplicates
const sentNotifications = new Set();

/**
 * Check all active boats and send appropriate notifications
 */
export async function checkAndSendNotifications() {
  try {
    console.log('🔔 Checking for notifications...');
    
    const activeCheckIns = await getAllActiveCheckIns();
    const now = new Date();
    
    for (const checkIn of activeCheckIns) {
      await processCheckInNotifications(checkIn, now);
    }
    
    console.log(`🔔 Notification check complete. Processed ${activeCheckIns.length} active check-ins.`);
    
  } catch (error) {
    console.error('❌ Error in notification scheduler:', error);
  }
}

/**
 * Process notifications for a single check-in
 */
async function processCheckInNotifications(checkIn, now) {
  const expectedReturn = new Date(checkIn.expected_return);
  const timeDiff = expectedReturn - now;
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  
  // Create unique notification keys to prevent duplicates
  const checkInKey = `${checkIn.id}_${checkIn.member_number}`;
  
  // Pre-check-in warnings (60, 30, 10 minutes before)
  if (minutesDiff > 0 && minutesDiff <= 60) {
    let warningKey;
    if (minutesDiff <= 10) {
      warningKey = `${checkInKey}_warning_10`;
    } else if (minutesDiff <= 30) {
      warningKey = `${checkInKey}_warning_30`;
    } else if (minutesDiff <= 60) {
      warningKey = `${checkInKey}_warning_60`;
    }
    
    if (warningKey && !sentNotifications.has(warningKey)) {
      await sendPreCheckInWarning(checkIn, minutesDiff);
      sentNotifications.add(warningKey);
    }
  }
  
  // Overdue notifications (30min, 1hr, 2hr, 3hr+)
  if (minutesDiff < 0) {
    const overdueMinutes = Math.abs(minutesDiff);
    const overdueKey = `${checkInKey}_overdue_${Math.floor(overdueMinutes / 30) * 30}`;
    
    if (!sentNotifications.has(overdueKey)) {
      await sendOverdueNotifications(checkIn, overdueMinutes);
      sentNotifications.add(overdueKey);
    }
  }
}

/**
 * Send pre-check-in warning with extension options
 */
async function sendPreCheckInWarning(checkIn, minutesUntilReturn) {
  const extensionOptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 }
  ];
  
  const title = minutesUntilReturn <= 10 
    ? '⏰ URGENT: Return Time Approaching!' 
    : '⏰ Return Time Reminder';
    
  const body = minutesUntilReturn <= 10
    ? `Hi ${checkIn.sailor_name}, you need to return ${checkIn.boat_name} in ${minutesUntilReturn} minutes!`
    : `Hi ${checkIn.sailor_name}, your return time for ${checkIn.boat_name} is in ${minutesUntilReturn} minutes. Need more time?`;
  
  await sendPushNotification(title, body, {
    type: 'pre_check_in_warning',
    checkInId: checkIn.id,
    memberNumber: checkIn.member_number,
    sailorName: checkIn.sailor_name,
    boatName: checkIn.boat_name,
    minutesUntilReturn,
    extensionOptions,
    action: 'extend_time',
    url: `/en/my-boat?extend=${checkIn.id}`
  });
}

/**
 * Send overdue notifications based on how long overdue
 */
async function sendOverdueNotifications(checkIn, overdueMinutes) {
  const hoursOverdue = Math.floor(overdueMinutes / 60);
  
  // 30 minutes overdue
  if (overdueMinutes >= 30 && overdueMinutes < 60) {
    await sendOverdueAlert(checkIn.sailor_name, checkIn.boat_name, overdueMinutes);
  }
  
  // 1 hour overdue
  if (overdueMinutes >= 60 && overdueMinutes < 120) {
    await sendPushNotification(
      '🚨 1 Hour Overdue',
      `Hi ${checkIn.sailor_name}, you are 1 hour overdue returning ${checkIn.boat_name}. Please return immediately!`,
      {
        type: 'overdue_1hour',
        checkInId: checkIn.id,
        memberNumber: checkIn.member_number,
        sailorName: checkIn.sailor_name,
        boatName: checkIn.boat_name,
        overdueMinutes,
        action: 'check_in_now',
        url: `/en/my-boat`
      }
    );
  }
  
  // 2 hours overdue - Alert admins
  if (overdueMinutes >= 120 && overdueMinutes < 180) {
    await sendPushNotification(
      '🚨🚨 2 Hours Overdue - Admin Alerted',
      `Hi ${checkIn.sailor_name}, you are 2 hours overdue returning ${checkIn.boat_name}. Club administrators have been alerted. Please return immediately or contact the club!`,
      {
        type: 'overdue_2hours',
        checkInId: checkIn.id,
        memberNumber: checkIn.member_number,
        sailorName: checkIn.sailor_name,
        boatName: checkIn.boat_name,
        overdueMinutes,
        action: 'emergency_contact',
        url: `/en/contact`
      }
    );
    
    // Send admin alert
    await sendAdminOverdueAlert(checkIn.sailor_name, checkIn.boat_name, overdueMinutes);
  }
  
  // 3+ hours overdue - Severe alert
  if (overdueMinutes >= 180) {
    await sendPushNotification(
      '🚨🚨🚨 SEVERE: 3+ Hours Overdue',
      `URGENT: ${checkIn.sailor_name}, you are ${hoursOverdue} hours overdue returning ${checkIn.boat_name}. This is a safety concern. Please contact the club immediately!`,
      {
        type: 'overdue_severe',
        checkInId: checkIn.id,
        memberNumber: checkIn.member_number,
        sailorName: checkIn.sailor_name,
        boatName: checkIn.boat_name,
        overdueMinutes,
        hoursOverdue,
        action: 'emergency_contact',
        url: `/en/contact`,
        priority: 'critical'
      }
    );
    
    // Send additional admin alert
    await sendAdminOverdueAlert(checkIn.sailor_name, checkIn.boat_name, overdueMinutes);
  }
}

/**
 * Clear old notifications from memory (run this periodically)
 */
export function clearOldNotifications() {
  // Keep only recent notifications (last 24 hours worth)
  const cutoff = Date.now() - (24 * 60 * 60 * 1000);
  // This is a simple implementation - in production you'd want more sophisticated cleanup
  console.log('🧹 Clearing old notification cache...');
}

/**
 * Get notification status for a specific check-in
 */
export function getNotificationStatus(checkInId, memberNumber) {
  const checkInKey = `${checkInId}_${memberNumber}`;
  const status = {
    hasPreWarning: false,
    hasOverdue: false,
    lastNotification: null
  };
  
  // Check if any notifications have been sent for this check-in
  for (const key of sentNotifications) {
    if (key.startsWith(checkInKey)) {
      status.hasPreWarning = key.includes('warning');
      status.hasOverdue = key.includes('overdue');
      status.lastNotification = key;
    }
  }
  
  return status;
}

/**
 * Manual notification trigger (for testing)
 */
export async function triggerTestNotification(memberNumber, type = 'test') {
  await sendPushNotification(
    '🧪 Test Notification',
    `This is a test notification for member ${memberNumber}`,
    {
      type: 'test',
      memberNumber,
      timestamp: new Date().toISOString()
    }
  );
}
