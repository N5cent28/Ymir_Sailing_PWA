export async function GET() {
  try {
    console.log('🔍 Simple test endpoint called');
    
    // Test environment variables
    console.log('Environment check:');
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    if (!process.env.DATABASE_URL) {
      return new Response(JSON.stringify({ 
        error: 'DATABASE_URL not set',
        env: Object.keys(process.env).filter(key => key.includes('DATABASE'))
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Test database connection
    const { Pool } = await import('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    try {
      const client = await pool.connect();
      console.log('✅ Database connection successful');
      
      // Test a simple query
      const result = await client.query('SELECT COUNT(*) FROM boats');
      console.log(`✅ Query successful: ${result.rows[0].count} boats found`);
      
      client.release();
      await pool.end();
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Database connection and query successful',
        boatCount: result.rows[0].count
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      await pool.end();
      
      return new Response(JSON.stringify({ 
        error: 'Database error',
        details: dbError.message,
        stack: dbError.stack
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('❌ General error:', error);
    return new Response(JSON.stringify({ 
      error: 'General error',
      details: error.message,
      stack: error.stack
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 