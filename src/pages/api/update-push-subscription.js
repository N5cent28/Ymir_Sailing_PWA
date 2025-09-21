// Update Push Subscription API
// Updates an existing push subscription with proper encryption keys

export async function POST({ request }) {
  try {
    const { subscription, memberNumber } = await request.json();
    
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
    const { updatePushSubscriptionMember } = await import('../../lib/database-postgres.js');
    
    // Keys are now pre-extracted on the frontend
    const p256dh = subscription.p256dh || null;
    const auth = subscription.auth || null;
    
    // Update existing subscription with proper keys
    const subscriptionData = {
      endpoint: subscription.endpoint,
      p256dh: p256dh,
      auth: auth,
      userAgent: subscription.userAgent || 'Unknown',
      memberNumber: memberNumber || null,
      timestamp: new Date().toISOString()
    };
    
    await updatePushSubscriptionMember(subscriptionData);
    
    console.log('📱 Push subscription updated with keys:', {
      endpoint: subscription.endpoint,
      memberNumber: memberNumber || 'Anonymous',
      keys: {
        p256dh: p256dh ? 'present' : 'missing',
        auth: auth ? 'present' : 'missing'
      }
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Push subscription updated with proper encryption keys' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Update push subscription error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
