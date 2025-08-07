import { getQRCodes } from '../../lib/database-postgres.js';

export async function GET() {
  try {
    const qrCodes = await getQRCodes();

    return new Response(JSON.stringify({
      success: true,
      qrCodes: qrCodes
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 