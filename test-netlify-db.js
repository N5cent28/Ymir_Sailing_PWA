import { Pool } from 'pg';

// Test the exact connection string format from Netlify
const DATABASE_URL = 'postgresql://neondb_owner:npg_XGd87KwNSAHM@ep-mute-boat-ad1q7b1p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function testNetlifyDatabase() {
  console.log('🔍 Testing Netlify Database Connection...\n');
  console.log('Using connection string from Netlify environment variables');
  
  try {
    // Create a test connection
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('🔄 Attempting to connect to database...');
    
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
    try {
      const boatsResult = await client.query('SELECT COUNT(*) as boat_count FROM boats');
      console.log(`\n🚤 Boats in database: ${boatsResult.rows[0].boat_count}`);
    } catch (error) {
      console.log('\n❌ Boats table query failed:', error.message);
    }
    
    // Test members table
    try {
      const membersResult = await client.query('SELECT COUNT(*) as member_count FROM members');
      console.log(`👥 Members in database: ${membersResult.rows[0].member_count}`);
    } catch (error) {
      console.log('\n❌ Members table query failed:', error.message);
    }
    
    // Test check_ins table
    try {
      const checkInsResult = await client.query('SELECT COUNT(*) as checkin_count FROM check_ins');
      console.log(`📝 Check-ins in database: ${checkInsResult.rows[0].checkin_count}`);
    } catch (error) {
      console.log('\n❌ Check-ins table query failed:', error.message);
    }
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 All database tests passed! Your Neon database is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 This usually means the database host is unreachable.');
      console.log('   Check if your Neon database is still active.');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication failed. Check your database username and password.');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Database does not exist. Check your database name.');
    } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n💡 Table does not exist. The database might be empty or tables not created.');
    }
    
    console.log('\n🔧 To debug this:');
    console.log('1. Check Netlify deployment logs for specific errors');
    console.log('2. Verify the database tables exist in Neon');
    console.log('3. Check if there are any permission issues');
  }
}

// Run the test
testNetlifyDatabase(); 