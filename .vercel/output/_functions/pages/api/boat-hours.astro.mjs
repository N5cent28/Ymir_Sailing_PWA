import { getMemberBoatHours, getTotalBoatHours } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function GET({ url }) {
  const memberNumber = url.searchParams.get('memberNumber');
  
  if (!memberNumber) {
    return new Response(JSON.stringify({ error: 'Member number is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const boatHours = await getMemberBoatHours(memberNumber);
    const totalHours = await getTotalBoatHours(memberNumber);
    
    return new Response(JSON.stringify({
      boatHours,
      totalHours
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching boat hours:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch boat hours' }), {
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
