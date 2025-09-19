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
    const { deleteAllPushSubscriptions } = await import('../../lib/database-postgres.js');
    
    // Delete all push subscriptions
    const deletedCount = await deleteAllPushSubscriptions();
    
    console.log(`🗑️ Deleted all push subscriptions: ${deletedCount} subscriptions removed`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully deleted ${deletedCount} push subscriptions`,
      deletedCount: deletedCount
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Delete all subscriptions error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

