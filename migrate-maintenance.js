import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateMaintenance() {
  console.log('Starting maintenance issues migration...');
  
  const db = await open({
    filename: path.join(process.cwd(), 'boats.db'),
    driver: sqlite3.Database
  });

  try {
    // Create maintenance_issues table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS maintenance_issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        boat_id TEXT NOT NULL,
        reported_by_member_number TEXT NOT NULL,
        issue_type TEXT NOT NULL, -- 'mechanical', 'safety', 'cosmetic', 'other'
        description TEXT NOT NULL,
        severity TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
        status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
        reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        resolved_by_member_number TEXT,
        admin_notes TEXT,
        FOREIGN KEY (boat_id) REFERENCES boats (id),
        FOREIGN KEY (reported_by_member_number) REFERENCES members (member_number),
        FOREIGN KEY (resolved_by_member_number) REFERENCES members (member_number)
      );
    `);
    
    console.log('✅ Maintenance issues table created successfully');
    
    // Check if there are any existing maintenance issues
    const existingIssues = await db.all('SELECT COUNT(*) as count FROM maintenance_issues');
    console.log(`ℹ️  Found ${existingIssues[0].count} existing maintenance issues`);
    
    // Show table structure
    const tableInfo = await db.all("PRAGMA table_info(maintenance_issues)");
    console.log('\n📋 Maintenance Issues Table Structure:');
    tableInfo.forEach(column => {
      console.log(`  ${column.name}: ${column.type}${column.notnull ? ' NOT NULL' : ''}${column.dflt_value ? ` DEFAULT ${column.dflt_value}` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await db.close();
  }
}

// Run migration
migrateMaintenance().then(() => {
  console.log('Migration completed!');
  process.exit(0);
}).catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 