import { getMemberBoatHours, getTotalBoatHours, getBoatClass } from '../../lib/database-postgres.js';

export async function GET({ url }) {
  const memberNumber = url.searchParams.get('memberNumber');
  
  if (!memberNumber) {
    return new Response(JSON.stringify({ error: 'Member number is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const rawBoatHours = await getMemberBoatHours(memberNumber);
    const totalHours = await getTotalBoatHours(memberNumber);
    
    // Group boat hours by boat class
    const boatHours = {
      SoloDinghy: 0,
      Dinghy: 0,
      Keelboat: 0,
      Paddling: 0
    };
    
    for (const record of rawBoatHours) {
      const boatClass = await getBoatClass(record.boat_name);
      const hours = parseFloat(record.hours) || 0;
      
      // Map boat classes to the expected categories
      if (boatClass === 'Zest' || boatClass === 'Laser') {
        boatHours.SoloDinghy += hours;
      } else if (boatClass === 'Quest' || boatClass === 'Topaz') {
        boatHours.Dinghy += hours;
      } else if (boatClass === 'Kayak' || boatClass === 'Paddle Board') {
        boatHours.Paddling += hours;
      } else {
        // For now, put other boats in Keelboat category
        boatHours.Keelboat += hours;
      }
    }
    
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