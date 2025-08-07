import { getBoatStatus } from '../../lib/database-postgres.js';

export async function GET({ url }) {
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