import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateBoatHours() {
  console.log('Starting boat hours migration...');
  
  const db = await open({
    filename: path.join(process.cwd(), 'boats.db'),
    driver: sqlite3.Database
  });

  try {
    // Create boat_hours table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS boat_hours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_number TEXT NOT NULL,
        boat_class TEXT NOT NULL, -- 'Zest', 'Quest', 'Paddling'
        total_hours REAL DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(member_number, boat_class)
      );
    `);
    
    console.log('✅ Boat hours table created successfully');
    
    // Add member_number column to check_ins table if it doesn't exist
    try {
      await db.run('ALTER TABLE check_ins ADD COLUMN member_number TEXT');
      console.log('✅ Added member_number column to check_ins table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('ℹ️  member_number column already exists in check_ins table');
      } else {
        throw error;
      }
    }
    
    // Calculate initial boat hours from existing check-ins
    console.log('Calculating initial boat hours from existing check-ins...');
    
    const checkIns = await db.all(`
      SELECT ci.*, b.name as boat_name 
      FROM check_ins ci 
      JOIN boats b ON ci.boat_id = b.id 
      WHERE ci.actual_return IS NOT NULL 
      AND ci.member_number IS NOT NULL
    `);
    
    let processedCount = 0;
    
    for (const checkIn of checkIns) {
      // Determine boat class
      let boatClass = 'Other';
      if (checkIn.boat_name.toLowerCase().includes('zest')) {
        boatClass = 'Zest';
      } else if (checkIn.boat_name.toLowerCase().includes('quest')) {
        boatClass = 'Quest';
      } else if (checkIn.boat_name.toLowerCase().includes('kayak') || checkIn.boat_name.toLowerCase().includes('paddle')) {
        boatClass = 'Paddling';
      }
      
      // Calculate hours
      const departureTime = new Date(checkIn.departure_time);
      const returnTime = new Date(checkIn.actual_return);
      const hours = (returnTime - departureTime) / (1000 * 60 * 60);
      
      // Insert or update boat hours
      await db.run(`
        INSERT INTO boat_hours (member_number, boat_class, total_hours, last_updated)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(member_number, boat_class) 
        DO UPDATE SET 
          total_hours = total_hours + ?,
          last_updated = CURRENT_TIMESTAMP
      `, [checkIn.member_number, boatClass, hours, hours]);
      
      processedCount++;
    }
    
    console.log(`✅ Processed ${processedCount} check-ins and calculated boat hours`);
    
    // Show summary
    const summary = await db.all(`
      SELECT boat_class, COUNT(*) as member_count, SUM(total_hours) as total_hours
      FROM boat_hours 
      GROUP BY boat_class
    `);
    
    console.log('\n📊 Boat Hours Summary:');
    summary.forEach(row => {
      console.log(`  ${row.boat_class}: ${row.member_count} members, ${row.total_hours.toFixed(1)} total hours`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await db.close();
  }
}

// Run migration
migrateBoatHours().then(() => {
  console.log('Migration completed!');
  process.exit(0);
}).catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 