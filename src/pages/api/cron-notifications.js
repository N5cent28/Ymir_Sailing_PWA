// Cron Job for Notifications
// This endpoint can be called by Netlify Cron or external services

import { checkAndSendNotifications } from '../../lib/notification-scheduler.js';

export async function GET({ request }) {
  try {
    // Check for authorization (optional - you can add API key validation)
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('apiKey');
    
    // For now, we'll allow any request, but in production you'd want to secure this
    // if (apiKey !== process.env.CRON_API_KEY) {
    //   return new Response(JSON.stringify({ 
    //     success: false, 
    //     error: 'Unauthorized' 
    //   }), { 
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }
    
    console.log('🕐 Running scheduled notification check...');
    
    // Run the notification check
    await checkAndSendNotifications();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notification check completed',
      timestamp: new Date().toISOString()
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Cron notification error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
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
