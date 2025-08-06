import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateDatabase() {
  try {
    console.log('🔄 Starting database migration...');
    
    const db = await open({
      filename: path.join(process.cwd(), 'boats.db'),
      driver: sqlite3.Database
    });
    
    // Add boat_type column to boats table if it doesn't exist
    console.log('📝 Adding boat_type column to boats table...');
    try {
      await db.run('ALTER TABLE boats ADD COLUMN boat_type TEXT DEFAULT "individual"');
      console.log('✅ Added boat_type column');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('ℹ️  boat_type column already exists');
      } else {
        throw error;
      }
    }
    
    // Update existing boats with boat_type
    console.log('🔄 Updating existing boats with boat_type...');
    await db.run('UPDATE boats SET boat_type = "individual" WHERE boat_type IS NULL');
    
    // Add new boats
    console.log('🚤 Adding new boats...');
    const newBoats = [
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
    
    for (const boat of newBoats) {
      try {
        await db.run(
          'INSERT INTO boats (id, name, boat_type) VALUES (?, ?, ?)',
          [boat.id, boat.name, boat.type]
        );
        console.log(`✅ Added ${boat.name}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`ℹ️  ${boat.name} already exists`);
        } else {
          console.log(`❌ Error adding ${boat.name}:`, error.message);
        }
      }
    }
    
    // Add new columns to check_ins table if they don't exist
    console.log('📝 Adding new columns to check_ins table...');
    const newColumns = [
      'checkout_checklist_completed BOOLEAN DEFAULT FALSE',
      'checkin_checklist_completed BOOLEAN DEFAULT FALSE',
      'trip_notes TEXT',
      'weather_conditions TEXT'
    ];
    
    for (const column of newColumns) {
      try {
        const columnName = column.split(' ')[0];
        await db.run(`ALTER TABLE check_ins ADD COLUMN ${column}`);
        console.log(`✅ Added ${columnName} column`);
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`ℹ️  ${column.split(' ')[0]} column already exists`);
        } else {
          console.log(`❌ Error adding column:`, error.message);
        }
      }
    }
    
    // Add new columns to members table if they don't exist
    console.log('📝 Adding new columns to members table...');
    const memberColumns = [
      'profile_picture TEXT',
      'bio TEXT',
      'sailing_experience TEXT',
      'is_admin BOOLEAN DEFAULT FALSE',
      'pin TEXT'
    ];
    
    for (const column of memberColumns) {
      try {
        const columnName = column.split(' ')[0];
        await db.run(`ALTER TABLE members ADD COLUMN ${column}`);
        console.log(`✅ Added ${columnName} column`);
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`ℹ️  ${column.split(' ')[0]} column already exists`);
        } else {
          console.log(`❌ Error adding column:`, error.message);
        }
      }
    }
    
    // Create new tables for social features
    console.log('📝 Creating social feature tables...');
    const socialTables = [
      `CREATE TABLE IF NOT EXISTS trip_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        check_in_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        photo_url TEXT NOT NULL,
        caption TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (check_in_id) REFERENCES check_ins (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      )`,
      `CREATE TABLE IF NOT EXISTS trip_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_photo_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_photo_id) REFERENCES trip_photos (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(trip_photo_id, member_number)
      )`,
      `CREATE TABLE IF NOT EXISTS trip_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_photo_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_photo_id) REFERENCES trip_photos (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      )`,
      `CREATE TABLE IF NOT EXISTS user_friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_number_1 TEXT NOT NULL,
        member_number_2 TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_number_1) REFERENCES members (member_number),
        FOREIGN KEY (member_number_2) REFERENCES members (member_number),
        UNIQUE(member_number_1, member_number_2)
      )`,
      `CREATE TABLE IF NOT EXISTS planned_outings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        organizer_member_number TEXT NOT NULL,
        boat_id TEXT,
        planned_date DATETIME NOT NULL,
        max_participants INTEGER,
        status TEXT DEFAULT 'planning',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_member_number) REFERENCES members (member_number),
        FOREIGN KEY (boat_id) REFERENCES boats (id)
      )`,
      `CREATE TABLE IF NOT EXISTS outing_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        outing_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        status TEXT DEFAULT 'interested',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (outing_id) REFERENCES planned_outings (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(outing_id, member_number)
      )`,
      `CREATE TABLE IF NOT EXISTS user_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_member_number TEXT NOT NULL,
        receiver_member_number TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_member_number) REFERENCES members (member_number),
        FOREIGN KEY (receiver_member_number) REFERENCES members (member_number)
      )`
    ];
    
    for (const tableSQL of socialTables) {
      try {
        await db.exec(tableSQL);
        console.log('✅ Created social table');
      } catch (error) {
        console.log('ℹ️  Social table already exists or error:', error.message);
      }
    }
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
migrateDatabase(); 