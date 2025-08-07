import { getActiveCheckInsWithBoatNames } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const memberNumber = url.searchParams.get('memberNumber');
    
    if (!memberNumber) {
      return new Response(JSON.stringify({ 
        error: 'Missing member number' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get all active check-ins with boat names
    const activeCheckIns = await getActiveCheckInsWithBoatNames();
    
    // Find the active check-in for this member
    const activeBoat = activeCheckIns.find(checkIn => 
      checkIn.member_number === memberNumber
    );
    
    if (!activeBoat) {
      return new Response(JSON.stringify({ 
        success: true,
        activeBoat: null,
        message: 'No active boat found for this member'
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      activeBoat: {
        id: activeBoat.id,
        boat_id: activeBoat.boat_id,
        boat_name: activeBoat.boat_name,
        sailor_name: activeBoat.sailor_name,
        member_number: activeBoat.member_number,
        departure_time: activeBoat.departure_time,
        expected_return: activeBoat.expected_return
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('My active boat error:', error);
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
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
