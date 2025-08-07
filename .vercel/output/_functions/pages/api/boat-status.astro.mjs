import { getBoatStatus } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function GET({ url }) {
  try {
    const boatId = url.searchParams.get('boatId');
    
    if (!boatId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Boat ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const boat = await getBoatStatus(boatId);
    
    if (!boat) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Boat not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      boat: boat 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching boat status:', error);
    return new Response(JSON.stringify({ 
      success: false, 
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
