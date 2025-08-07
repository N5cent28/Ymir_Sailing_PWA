import { getMemberByNumber, getMemberTrips, updateMemberProfile } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const memberNumber = url.searchParams.get('memberNumber');
    
    if (!memberNumber) {
      return new Response(JSON.stringify({ 
        error: 'Member number is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const member = await getMemberByNumber(memberNumber);
    if (!member) {
      return new Response(JSON.stringify({ 
        error: 'Member not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get member's trip history
    const trips = await getMemberTrips(memberNumber, 20);
    
    return new Response(JSON.stringify({ 
      success: true,
      member,
      trips
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function PUT({ request }) {
  try {
    const { memberNumber, profileData } = await request.json();
    
    if (!memberNumber || !profileData) {
      return new Response(JSON.stringify({ 
        error: 'Member number and profile data are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await updateMemberProfile(memberNumber, profileData);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Profile updated successfully'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
