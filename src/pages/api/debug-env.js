export async function GET() {
  try {
    // Check what environment variables are available
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      APP_URL: process.env.APP_URL || 'NOT SET',
      ADMIN_PIN: process.env.ADMIN_PIN ? 'SET' : 'NOT SET',
      // Add any other variables you need to check
    };

    // Try to connect to database to see if it works
    let dbStatus = 'NOT TESTED';
    let dbError = null;
    
    if (process.env.DATABASE_URL) {
      try {
        // Import the database module dynamically
        const { Pool } = await import('pg');
        
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });
        
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time');
        dbStatus = 'CONNECTED';
        client.release();
        await pool.end();
      } catch (error) {
        dbStatus = 'FAILED';
        dbError = error.message;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
      environmentVariables: envVars,
      databaseStatus: dbStatus,
      databaseError: dbError,
      // Add some system info
      userAgent: 'Netlify Function',
      platform: 'serverless'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 