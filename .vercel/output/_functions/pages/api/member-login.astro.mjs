import { verifyMemberCredentials } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
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
    
    // Check member credentials
    const member = await verifyMemberCredentials(memberNumber, pin);
    
    if (member) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Login successful',
        member: {
          member_number: member.member_number,
          name: member.name,
          phone: member.phone,
          email: member.email,
          is_admin: member.is_admin,
          bio: member.bio,
          profile_picture: member.profile_picture,
          sailing_experience: member.sailing_experience
        }
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        error: 'Invalid member number or PIN' 
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Member login error:', error);
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
