import { getMemberByNumber, getAllMembers, createMember, updateMemberProfile, updateMember, deleteMember } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const memberNumber = url.searchParams.get('memberNumber');
    
    if (memberNumber) {
      // Get specific member
      const member = await getMemberByNumber(memberNumber);
      
      if (!member) {
        return new Response(JSON.stringify({ 
          error: 'Member not found' 
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        member
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Get all members
      const members = await getAllMembers();
      
      return new Response(JSON.stringify({ 
        success: true,
        members
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Get members error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function POST({ request }) {
  try {
    const { memberNumber, name, phone, email } = await request.json();
    
    // Validate required fields
    if (!memberNumber || !name) {
      return new Response(JSON.stringify({ 
        error: 'Member number and name are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if member already exists
    const existingMember = await getMemberByNumber(memberNumber);
    if (existingMember) {
      return new Response(JSON.stringify({ 
        error: 'Member number already exists' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create member
    await createMember(memberNumber, name, phone, email);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Member created successfully'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Create member error:', error);
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
    const body = await request.json();
    const memberNumber = body.memberNumber;
    
    console.log('PUT request body:', body);
    console.log('Member number from body:', memberNumber);
    
    if (!memberNumber) {
      return new Response(JSON.stringify({ 
        error: 'Member number is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if member exists
    const existingMember = await getMemberByNumber(memberNumber);
    if (!existingMember) {
      return new Response(JSON.stringify({ 
        error: 'Member not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Determine if this is a profile update or admin member update
    if (body.profileData) {
      // Profile update (existing functionality)
      await updateMemberProfile(memberNumber, body.profileData);
    } else {
      // Admin member update (new functionality)
      const updateData = {
        name: body.name,
        phone: body.phone,
        email: body.email,
        is_admin: body.is_admin
      };
      await updateMember(memberNumber, updateData);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Member updated successfully'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Update member error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function DELETE({ request }) {
  try {
    const body = await request.json();
    const memberNumber = body.memberNumber;
    
    console.log('DELETE request body:', body);
    console.log('Member number from body:', memberNumber);
    
    if (!memberNumber) {
      return new Response(JSON.stringify({ 
        error: 'Member number is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if member exists
    const existingMember = await getMemberByNumber(memberNumber);
    if (!existingMember) {
      return new Response(JSON.stringify({ 
        error: 'Member not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete member
    await deleteMember(memberNumber);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Member deleted successfully'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Delete member error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
