import { Pool } from 'pg';

// Test Neon database connection
async function testNeonConnection() {
  console.log('🔍 Testing Neon Database Connection...\n');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL environment variable is not set!');
    console.log('\nTo fix this in Netlify:');
    console.log('1. Go to your Netlify dashboard');
    console.log('2. Navigate to Site settings → Environment variables');
    console.log('3. Add: DATABASE_URL=your_neon_connection_string');
    console.log('4. Redeploy your site');
    return;
  }
  
  console.log('✅ DATABASE_URL is set');
  console.log('Connection string format:', process.env.DATABASE_URL.substring(0, 20) + '...');
  
  try {
    // Create a test connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('\n🔄 Attempting to connect to database...');
    
    const client = await pool.connect();
    console.log('✅ Successfully connected to Neon database!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database query successful:', result.rows[0]);
    
    // Test if our tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Test boats table specifically
    const boatsResult = await client.query('SELECT COUNT(*) as boat_count FROM boats');
    console.log(`\n🚤 Boats in database: ${boatsResult.rows[0].boat_count}`);
    
    // Test members table
    const membersResult = await client.query('SELECT COUNT(*) as member_count FROM members');
    console.log(`👥 Members in database: ${membersResult.rows[0].member_count}`);
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 All database tests passed! Your Neon database is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 This usually means the database host is unreachable.');
      console.log('   Check if your Neon database is still active and the connection string is correct.');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication failed. Check your database username and password.');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Database does not exist. Check your database name in the connection string.');
    }
    
    console.log('\n🔧 To fix this:');
    console.log('1. Go to your Neon dashboard: https://console.neon.tech/');
    console.log('2. Check if your database is still active');
    console.log('3. Copy the connection string from the "Connection Details" section');
    console.log('4. Update the DATABASE_URL in your Netlify environment variables');
  }
}

// Run the test
testNeonConnection(); 