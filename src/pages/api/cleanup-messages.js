import { cleanupOldMessages, isAdmin } from '../../lib/database-postgres.js';

export async function POST({ request }) {
  try {
    const { daysOld = 30, adminMemberNumber } = await request.json();
    console.log(`🔧 CLEANUP-MESSAGES API DEBUG: Received request with daysOld=${daysOld}, adminMemberNumber=${adminMemberNumber}`);
    
    // Check if user is admin
    if (!adminMemberNumber || !(await isAdmin(adminMemberNumber))) {
      console.log(`🔧 CLEANUP-MESSAGES API DEBUG: Admin check failed - adminMemberNumber=${adminMemberNumber}`);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Admin access required' 
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`🔧 CLEANUP-MESSAGES API DEBUG: Admin check passed, calling cleanupOldMessages(${daysOld})`);
    
    // Clean up old messages
    const deletedCount = await cleanupOldMessages(daysOld);
    
    console.log(`🔧 CLEANUP-MESSAGES API DEBUG: cleanupOldMessages completed, deletedCount=${deletedCount}`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      deletedCount: deletedCount,
      message: `Cleaned up ${deletedCount} messages older than ${daysOld} days`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ CLEANUP-MESSAGES API ERROR:', error);
    console.error('❌ CLEANUP-MESSAGES API ERROR message:', error.message);
    console.error('❌ CLEANUP-MESSAGES API ERROR code:', error.code);
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