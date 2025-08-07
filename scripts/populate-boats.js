import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function populateBoats() {
  console.log('🚤 Populating boats table...');
  
  const client = await pool.connect();
  try {
    // Define the boats
    const boats = [
      { id: 'boat-1', name: 'Quest 1', type: 'individual' },
      { id: 'boat-2', name: 'Quest 2', type: 'individual' },
      { id: 'boat-3', name: 'Zest 1', type: 'individual' },
      { id: 'boat-4', name: 'Zest 2', type: 'individual' },
      { id: 'boat-5', name: 'Zest 3', type: 'individual' },
      { id: 'boat-6', name: 'Zest 4', type: 'individual' },
      { id: 'boat-7', name: 'Zest 5', type: 'individual' },
      { id: 'boat-8', name: 'Zest 6', type: 'individual' },
      { id: 'boat-9', name: 'Topaz 1', type: 'individual' },
      { id: 'boat-10', name: 'Topaz 2', type: 'individual' },
      { id: 'boat-11', name: 'Laser 1', type: 'individual' },
      { id: 'boat-12', name: 'Laser 2', type: 'individual' },
      { id: 'boat-13', name: 'Laser 3', type: 'individual' },
      { id: 'boat-14', name: 'Laser 4', type: 'individual' },
      { id: 'kayak', name: 'Kayak', type: 'shared' },
      { id: 'paddle-board', name: 'Paddle Board', type: 'shared' }
    ];
    
    // Insert boats with ON CONFLICT DO NOTHING (PostgreSQL equivalent of INSERT OR IGNORE)
    for (const boat of boats) {
      await client.query(
        `INSERT INTO boats (id, name, boat_type, status) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (id) DO NOTHING`,
        [boat.id, boat.name, boat.type, 'operational']
      );
      console.log(`✅ Added boat: ${boat.name} (${boat.id})`);
    }
    
    console.log('🎉 All boats populated successfully!');
    
    // Verify the boats were added
    const result = await client.query('SELECT id, name, boat_type, status FROM boats ORDER BY id');
    console.log('\n📋 Current boats in database:');
    result.rows.forEach(boat => {
      console.log(`  - ${boat.name} (${boat.id}): ${boat.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error populating boats:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  populateBoats().catch(console.error);
}

export { populateBoats }; 