import { cleanupOldMessages, isAdmin } from '../../lib/database.js';

export async function POST({ request }) {
  try {
    const { daysOld = 30, adminMemberNumber } = await request.json();
    
    // Check if user is admin
    if (!adminMemberNumber || !(await isAdmin(adminMemberNumber))) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Admin access required' 
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Clean up old messages
    const deletedCount = await cleanupOldMessages(daysOld);
    
    return new Response(JSON.stringify({ 
      success: true, 
      deletedCount: deletedCount,
      message: `Cleaned up ${deletedCount} messages older than ${daysOld} days`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Message cleanup error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET({ url }) {
  try {
    const daysOld = parseInt(url.searchParams.get('daysOld')) || 30;
    const adminMemberNumber = url.searchParams.get('adminMemberNumber');
    
    // Check if user is admin
    if (!adminMemberNumber || !(await isAdmin(adminMemberNumber))) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Admin access required' 
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Clean up old messages
    const deletedCount = await cleanupOldMessages(daysOld);
    
    return new Response(JSON.stringify({ 
      success: true, 
      deletedCount: deletedCount,
      message: `Cleaned up ${deletedCount} messages older than ${daysOld} days`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Message cleanup error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 