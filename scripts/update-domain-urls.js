import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const OLD_DOMAIN = 'https://ymir-sailing-club.vercel.app'; // or whatever the old domain was
const NEW_DOMAIN = 'https://siglingafelagidymir.com';

async function updateDomainUrls() {
  console.log('🔄 Updating domain URLs in database...');
  console.log(`- Old domain: ${OLD_DOMAIN}`);
  console.log(`- New domain: ${NEW_DOMAIN}`);
  
  const client = await pool.connect();
  try {
    // Update QR code URLs in the database
    console.log('\n1️⃣ Updating QR code URLs...');
    const qrResult = await client.query(
      `UPDATE qr_codes 
       SET qr_code_url = REPLACE(qr_code_url, $1, $2)
       WHERE qr_code_url LIKE $3`,
      [OLD_DOMAIN, NEW_DOMAIN, `%${OLD_DOMAIN}%`]
    );
    console.log(`✅ Updated ${qrResult.rowCount} QR code URLs`);
    
    // Update trip photo URLs
    console.log('\n2️⃣ Updating trip photo URLs...');
    const photoResult = await client.query(
      `UPDATE trip_photos 
       SET photo_url = REPLACE(photo_url, $1, $2)
       WHERE photo_url LIKE $3`,
      [OLD_DOMAIN, NEW_DOMAIN, `%${OLD_DOMAIN}%`]
    );
    console.log(`✅ Updated ${photoResult.rowCount} trip photo URLs`);
    
    // Check if there are any other tables with URL fields
    console.log('\n3️⃣ Checking for other URL references...');
    const tablesResult = await client.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND data_type IN ('text', 'varchar', 'character varying')
      AND column_name LIKE '%url%'
    `);
    
    console.log(`Found ${tablesResult.rows.length} potential URL columns:`);
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}.${row.column_name}`);
    });
    
    console.log('\n🎉 Domain URL update completed!');
    
  } catch (error) {
    console.error('❌ Error updating domain URLs:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  updateDomainUrls().catch(console.error);
}

export { updateDomainUrls }; 