// Push Subscription API
// Handles storing and managing push notification subscriptions

export async function POST({ request }) {
  try {
    const { subscription, userAgent, timestamp, memberNumber } = await request.json();
    
    if (!subscription) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing subscription data' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Import database functions
    const { storePushSubscription } = await import('../../lib/database-postgres.js');
    
    // Store subscription in database with member number
    const subscriptionData = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh || null,
      auth: subscription.keys?.auth || null,
      userAgent: userAgent || 'Unknown',
      memberNumber: memberNumber || null,
      timestamp: timestamp || new Date().toISOString()
    };
    
    await storePushSubscription(subscriptionData);
    
    console.log('📱 Push subscription stored:', {
      endpoint: subscription.endpoint,
      memberNumber: memberNumber || 'Anonymous',
      userAgent: userAgent,
      timestamp: timestamp,
      keys: subscription.keys ? {
        p256dh: subscription.keys.p256dh ? 'present' : 'missing',
        auth: subscription.keys.auth ? 'present' : 'missing'
      } : 'missing'
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Push subscription stored successfully' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Push subscription error:', error);
    return new Response(JSON.stringify({ 
      success: false,
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
    const action = url.searchParams.get('action');
    
    if (action === 'test') {
      // Send a test notification to all subscribers
      // This is a simplified version - in production you'd use a proper push service
      console.log('🧪 Test notification requested');
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Test notification sent (logged to console)' 
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
    console.error('Push subscription GET error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
