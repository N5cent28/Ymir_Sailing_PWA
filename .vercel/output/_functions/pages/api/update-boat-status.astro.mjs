import { updateBoatStatus, createNotification } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
  try {
    const { boatId, status, notes } = await request.json();
    
    // Validate required fields
    if (!boatId || !status) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate status
    const validStatuses = ['operational', 'maintenance', 'out_of_service'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid status' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update boat status
    await updateBoatStatus(boatId, status, notes);
    
    // Create notification
    const statusText = status.replace('_', ' ');
    await createNotification(boatId, 'status_change', 
      `Boat status changed to: ${statusText}${notes ? ` - ${notes}` : ''}`
    );
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Boat status updated to ${statusText}`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Update boat status error:', error);
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
