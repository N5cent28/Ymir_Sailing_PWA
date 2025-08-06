import { checkAdminCredentials } from '../../lib/auth.js';

export async function POST({ request }) {
  try {
    const { memberNumber, pin } = await request.json();
    
    // Validate required fields
    if (!memberNumber || !pin) {
      return new Response(JSON.stringify({ 
        error: 'Member number and PIN are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check admin credentials
    const result = await checkAdminCredentials(memberNumber, pin);
    
    if (result.authorized) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Admin login successful',
        member: result.member
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        error: result.error 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 