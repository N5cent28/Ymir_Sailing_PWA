// Cleanup Invalid Push Subscriptions API
// Removes push subscriptions that are missing required encryption keys

export async function POST({ request }) {
  try {
    // Get admin member from request body
    const { adminMember } = await request.json();
    
    if (!adminMember || !adminMember.is_admin) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Admin access required' 
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Import database functions
    const { deleteInvalidPushSubscriptions } = await import('../../lib/database-postgres.js');
    
    // Delete invalid push subscriptions
    const deletedCount = await deleteInvalidPushSubscriptions();
    
    console.log(`🧹 Cleaned up invalid push subscriptions: ${deletedCount} subscriptions removed`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully cleaned up ${deletedCount} invalid push subscriptions`,
      deletedCount: deletedCount
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Cleanup invalid subscriptions error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
