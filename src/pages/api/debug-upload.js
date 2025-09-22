export async function GET() {
  try {
    console.log('🔍 DEBUG: Environment check');
    
    const debugInfo = {
      NODE_ENV: process.env.NODE_ENV,
      APP_URL: process.env.APP_URL,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      cwd: process.cwd(),
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };
    
    console.log('🔍 DEBUG INFO:', debugInfo);
    
    return new Response(JSON.stringify({
      success: true,
      debug: debugInfo
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('🔍 DEBUG ERROR:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
