// Webhook endpoint for external cron services
// This can be called by cron-job.org, EasyCron, UptimeRobot, etc.

import { checkAndSendNotifications } from '../../lib/notification-scheduler.js';

export async function GET({ request }) {
  try {
    // Optional: Add basic authentication
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('key');
    
    // Simple API key check (you can set this in Netlify environment variables)
    const expectedKey = process.env.CRON_WEBHOOK_KEY || 'ymir-sailing-club-2024';
    
    if (apiKey !== expectedKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid API key' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('🕐 Webhook triggered - running notification check...');
    
    // Run the notification check
    await checkAndSendNotifications();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Notification check completed via webhook',
      timestamp: new Date().toISOString()
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Webhook notification error:', error);
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
