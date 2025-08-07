import { getMemberBoatHours, getTotalBoatHours } from '../../lib/database-postgres.js';

export async function GET({ url }) {
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