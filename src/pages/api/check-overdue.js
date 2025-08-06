import { getOverdueBoats, getActiveCheckIns } from '../../lib/database.js';
import { sendOverdueAlert, sendExtensionReminder, sendAdminOverdueAlert } from '../../lib/notifications.js';

export async function GET() {
  try {
    const overdueBoats = await getOverdueBoats();
    const activeCheckIns = await getActiveCheckIns();
    
    const notifications = [];
    
    // Check for overdue boats
    for (const boat of overdueBoats) {
      const overdueMinutes = Math.floor((new Date() - new Date(boat.expected_return)) / (1000 * 60));
      const hoursOverdue = Math.floor(overdueMinutes / 60);
      
      // Send hourly overdue alerts to sailor
      if (hoursOverdue >= 1 && overdueMinutes % 60 < 5) { // Within 5 minutes of each hour
        await sendOverdueAlert(boat.sailor_name, boat.boat_name, overdueMinutes);
        
        notifications.push({
          type: 'overdue_hourly',
          sailor: boat.sailor_name,
          boat: boat.boat_name,
          hoursOverdue
        });
      }
      
      // Send admin alert after 2 hours overdue
      if (hoursOverdue >= 2 && overdueMinutes % 60 < 5) { // Within 5 minutes of each hour after 2 hours
        await sendAdminOverdueAlert(boat.sailor_name, boat.boat_name, overdueMinutes);
        
        notifications.push({
          type: 'admin_overdue_alert',
          sailor: boat.sailor_name,
          boat: boat.boat_name,
          hoursOverdue
        });
      }
    }
    
    // Check for boats approaching return time (within 10 minutes)
    for (const checkIn of activeCheckIns) {
      const expectedReturn = new Date(checkIn.expected_return);
      const now = new Date();
      const minutesUntilReturn = Math.floor((expectedReturn - now) / (1000 * 60));
      
      if (minutesUntilReturn <= 10 && minutesUntilReturn > 0) {
        // Send extension reminder
        await sendExtensionReminder(
          checkIn.sailor_name, 
          checkIn.boat_name || 'boat', 
          minutesUntilReturn,
          ['15 minutes', '30 minutes', '1 hour']
        );
        
        notifications.push({
          type: 'extension_reminder',
          sailor: checkIn.sailor_name,
          boat: checkIn.boat_name || 'boat',
          minutesUntilReturn
        });
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      notifications,
      overdueCount: overdueBoats.length,
      reminderCount: notifications.filter(n => n.type === 'extension_reminder').length,
      hourlyAlerts: notifications.filter(n => n.type === 'overdue_hourly').length,
      adminAlerts: notifications.filter(n => n.type === 'admin_overdue_alert').length
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Check overdue error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 