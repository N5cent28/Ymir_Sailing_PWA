import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool only if DATABASE_URL is available
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

// Initialize database tables
async function initializeDatabase() {
  if (!pool) {
    console.log('Database not available during build time');
    return;
  }
  
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS members (
        member_number VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        profile_picture TEXT,
        bio TEXT,
        sailing_experience TEXT,
        pin VARCHAR(50),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS boats (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'operational',
        boat_type VARCHAR(50) DEFAULT 'individual',
        last_maintenance DATE,
        notes TEXT
      );
      
      CREATE TABLE IF NOT EXISTS check_ins (
        id SERIAL PRIMARY KEY,
        boat_id VARCHAR(50) NOT NULL,
        sailor_name VARCHAR(255) NOT NULL,
        member_number VARCHAR(50),
        phone VARCHAR(50),
        departure_time TIMESTAMP NOT NULL,
        expected_return TIMESTAMP NOT NULL,
        actual_return TIMESTAMP,
        checkout_checklist_completed BOOLEAN DEFAULT FALSE,
        checkin_checklist_completed BOOLEAN DEFAULT FALSE,
        trip_notes TEXT,
        weather_conditions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (boat_id) REFERENCES boats (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        boat_id VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (boat_id) REFERENCES boats (id)
      );
      
      CREATE TABLE IF NOT EXISTS trip_photos (
        id SERIAL PRIMARY KEY,
        check_in_id INTEGER NOT NULL,
        member_number VARCHAR(50) NOT NULL,
        photo_url TEXT NOT NULL,
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (check_in_id) REFERENCES check_ins (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS trip_likes (
        id SERIAL PRIMARY KEY,
        trip_photo_id INTEGER NOT NULL,
        member_number VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_photo_id) REFERENCES trip_photos (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(trip_photo_id, member_number)
      );
      
      CREATE TABLE IF NOT EXISTS trip_comments (
        id SERIAL PRIMARY KEY,
        trip_photo_id INTEGER NOT NULL,
        member_number VARCHAR(50) NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_photo_id) REFERENCES trip_photos (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS user_friends (
        id SERIAL PRIMARY KEY,
        member_number1 VARCHAR(50) NOT NULL,
        member_number2 VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_number1) REFERENCES members (member_number),
        FOREIGN KEY (member_number2) REFERENCES members (member_number),
        UNIQUE(member_number1, member_number2)
      );
      
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        endpoint TEXT NOT NULL UNIQUE,
        p256dh TEXT,
        auth TEXT,
        user_agent TEXT,
        member_number VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS planned_outings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME,
        location VARCHAR(255),
        max_participants INTEGER,
        created_by VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS outing_participants (
        id SERIAL PRIMARY KEY,
        outing_id INTEGER NOT NULL,
        member_number VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (outing_id) REFERENCES planned_outings (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(outing_id, member_number)
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_member_number VARCHAR(50) NOT NULL,
        receiver_member_number VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_member_number) REFERENCES members (member_number),
        FOREIGN KEY (receiver_member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS boat_hours (
        id SERIAL PRIMARY KEY,
        member_number VARCHAR(50) NOT NULL,
        check_in_id INTEGER NOT NULL,
        boat_id VARCHAR(50) NOT NULL,
        hours DECIMAL(5,2) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        FOREIGN KEY (check_in_id) REFERENCES check_ins (id),
        FOREIGN KEY (boat_id) REFERENCES boats (id)
      );
      
      CREATE TABLE IF NOT EXISTS maintenance_issues (
        id SERIAL PRIMARY KEY,
        boat_id VARCHAR(50) NOT NULL,
        reported_by VARCHAR(50) NOT NULL,
        issue_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        severity VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'open',
        reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        resolved_by VARCHAR(50),
        resolution_notes TEXT,
        FOREIGN KEY (boat_id) REFERENCES boats (id),
        FOREIGN KEY (reported_by) REFERENCES members (member_number),
        FOREIGN KEY (resolved_by) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS qr_codes (
        id SERIAL PRIMARY KEY,
        boat_id VARCHAR(50) NOT NULL,
        qr_code_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (boat_id) REFERENCES boats (id)
      );
    `);
    
    // Populate boats table with default boats
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
    
    for (const boat of boats) {
      await client.query(
        `INSERT INTO boats (id, name, boat_type, status) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (id) DO NOTHING`,
        [boat.id, boat.name, boat.type, 'operational']
      );
    }
    
  } finally {
    client.release();
  }
}

// Initialize database on import
initializeDatabase().catch(console.error);

// Helper function to get a client from the pool
async function getClient() {
  if (!pool) {
    throw new Error('Database not available - DATABASE_URL not set');
  }
  return await pool.connect();
}

// Export all the same functions but adapted for PostgreSQL
export async function getBoatStatus(boatId) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT * FROM boats WHERE id = $1',
      [boatId]
    );
    return result.rows[0] || { id: boatId, status: 'unknown', name: 'Unknown Boat' };
  } finally {
    client.release();
  }
}

export async function updateBoatStatus(boatId, status, notes = null, adminMemberNumber = null) {
  const client = await getClient();
  try {
    // Check for active check-ins before changing status
    if (status === 'maintenance' || status === 'out_of_service') {
      const activeCheckIns = await client.query(
        'SELECT id, sailor_name, member_number FROM check_ins WHERE boat_id = $1 AND actual_return IS NULL',
        [boatId]
      );
      
      if (activeCheckIns.rows.length > 0) {
        const activeCheckIn = activeCheckIns.rows[0];
        throw new Error(`Cannot change boat status to ${status}. Boat is currently checked out by ${activeCheckIn.sailor_name}. Please force check-in from the Active Boats page first.`);
      }
    }
    
    // Update boat status
    await client.query(
      'UPDATE boats SET status = $1, notes = $2 WHERE id = $3',
      [status, notes, boatId]
    );
    
    // ✅ FIXED: Automatically create maintenance issue records
    if (status === 'maintenance' || status === 'out_of_service') {
      // Check if there's already an open maintenance issue for this boat
      const existingIssue = await client.query(
        'SELECT id FROM maintenance_issues WHERE boat_id = $1 AND status = \'open\'',
        [boatId]
      );
      
      if (existingIssue.rows.length === 0) {
        // Get an admin member for the reported_by field, or use the provided admin member
        let reportedBy = adminMemberNumber;
        
        if (!reportedBy) {
          // Try to get the first admin member
          const adminMembers = await client.query(
            'SELECT member_number FROM members WHERE is_admin = TRUE LIMIT 1'
          );
          
          if (adminMembers.rows.length > 0) {
            reportedBy = adminMembers.rows[0].member_number;
          } else {
            // If no admin members exist, create a system admin
            reportedBy = '000';
            await client.query(
              'INSERT INTO members (member_number, name, is_admin) VALUES ($1, $2, $3) ON CONFLICT (member_number) DO NOTHING',
              ['000', 'System Admin', true]
            );
          }
        }
        
        // Create a new maintenance issue
        await client.query(
          `INSERT INTO maintenance_issues (boat_id, reported_by, issue_type, description, severity, status)
           VALUES ($1, $2, $3, $4, $5, 'open')`,
          [boatId, reportedBy, 'status_change', `Boat status changed to ${status}${notes ? `: ${notes}` : ''}`, 'medium']
        );
      }
    } else if (status === 'operational') {
      // Mark existing maintenance issues as resolved
      await client.query(
        'UPDATE maintenance_issues SET status = \'resolved\', resolved_at = CURRENT_TIMESTAMP WHERE boat_id = $1 AND status = \'open\'',
        [boatId]
      );
    }
    
    return true;
  } finally {
    client.release();
  }
}

export async function createCheckIn(boatId, sailorName, departureTime, expectedReturn, memberNumber = null, phone = null) {
  const client = await getClient();
  try {
    const result = await client.query(
      `INSERT INTO check_ins (boat_id, sailor_name, member_number, phone, departure_time, expected_return)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [boatId, sailorName, memberNumber, phone, departureTime, expectedReturn]
    );
    
    // Update boat status to 'checked_out'
    await updateBoatStatus(boatId, 'checked_out', null, null);
    
    // Get boat name for better notification
    const boatResult = await client.query('SELECT name FROM boats WHERE id = $1', [boatId]);
    const boatName = boatResult.rows[0]?.name || 'Unknown Boat';
    
    // Create notification with boat name and ID
    await createNotification(boatId, 'check_out', `${sailorName} checked out ${boatName} (${boatId})`);
    
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function completeCheckIn(checkInId, skipHoursCalculation = false) {
  const client = await getClient();
  try {
    // Get check-in details first
    const checkInResult = await client.query(
      'SELECT boat_id, sailor_name, member_number FROM check_ins WHERE id = $1',
      [checkInId]
    );
    
    if (checkInResult.rows.length === 0) {
      throw new Error('Check-in not found');
    }
    
    const { boat_id, sailor_name, member_number } = checkInResult.rows[0];
    
    // Update check-in
    await client.query(
      'UPDATE check_ins SET actual_return = CURRENT_TIMESTAMP, checkin_checklist_completed = TRUE WHERE id = $1',
      [checkInId]
    );
    
    // Update boat status
    await updateBoatStatus(boat_id, 'operational', null, null);
    
    // ✅ FIXED: Calculate and record boat hours only if not skipping
    if (!skipHoursCalculation && member_number) {
      await calculateAndUpdateBoatHours(member_number, checkInId);
    }
    
    // Get boat name for better notification
    const boatResult = await client.query('SELECT name FROM boats WHERE id = $1', [boat_id]);
    const boatName = boatResult.rows[0]?.name || 'Unknown Boat';
    
    // Create notification with boat name and ID
    await createNotification(boat_id, 'check_in', `${sailor_name} returned ${boatName} (${boat_id})`);
    
    return true;
  } finally {
    client.release();
  }
}

export async function updateCheckInTime(checkInId, newReturnTime) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE check_ins SET expected_return = $1 WHERE id = $2',
      [newReturnTime, checkInId]
    );
  } finally {
    client.release();
  }
}

export async function getActiveCheckIns(boatId) {
  const client = await getClient();
  try {
    // Get active check-ins with boat status information
    const result = await client.query(
      `SELECT c.*, b.status as boat_status, b.name as boat_name
       FROM check_ins c 
       JOIN boats b ON c.boat_id = b.id 
       WHERE c.boat_id = $1 AND c.actual_return IS NULL 
       ORDER BY c.departure_time DESC`,
      [boatId]
    );
    
    // Filter out check-ins for boats that are not operational
    return result.rows.filter(checkIn => checkIn.boat_status === 'operational');
  } finally {
    client.release();
  }
}

export async function getActiveCheckInsWithBoatNames(boatId) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT c.*, b.name as boat_name 
       FROM check_ins c 
       JOIN boats b ON c.boat_id = b.id 
       WHERE c.boat_id = $1 AND c.actual_return IS NULL 
       ORDER BY c.departure_time DESC`,
      [boatId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAllActiveCheckIns() {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT c.*, b.name as boat_name, b.status as boat_status
       FROM check_ins c 
       JOIN boats b ON c.boat_id = b.id 
       WHERE c.actual_return IS NULL 
       ORDER BY c.departure_time DESC`
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getOverdueBoats() {
  const client = await getClient();
  try {
    // Get all active check-ins first
    const result = await client.query(
      `SELECT c.*, b.name as boat_name 
       FROM check_ins c 
       JOIN boats b ON c.boat_id = b.id 
       WHERE c.actual_return IS NULL`
    );
    
    // Import timezone manager dynamically to avoid circular dependencies
    const { timezoneManager } = await import('./timezone.js');
    
    // Filter overdue boats using timezone-aware comparison
    const overdueBoats = result.rows.filter(boat => 
      timezoneManager.isOverdue(boat.expected_return)
    );
    
    return overdueBoats;
  } finally {
    client.release();
  }
}

export async function createNotification(boatId, type, message) {
  const client = await getClient();
  try {
    await client.query(
      'INSERT INTO notifications (boat_id, type, message) VALUES ($1, $2, $3)',
      [boatId, type, message]
    );
  } finally {
    client.release();
  }
}

export async function getRecentNotifications(limit = 10) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT * FROM notifications ORDER BY sent_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function cleanupOldNotifications(retentionDays = 30) {
  const client = await getClient();
  try {
    console.log(`Cleaning up notifications older than ${retentionDays} days...`);
    const result = await client.query(
      'DELETE FROM notifications WHERE sent_at < CURRENT_TIMESTAMP - INTERVAL \'$1 days\'',
      [retentionDays]
    );
    console.log(`Cleaned up ${result.rowCount || 0} old notifications`);
    return result.rowCount || 0;
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getNotificationStats() {
  const client = await getClient();
  try {
    console.log('Fetching notification stats...');
    const result = await client.query(`
      SELECT 
        COUNT(*) as total,
        MIN(sent_at) as oldest,
        MAX(sent_at) as newest
      FROM notifications
    `);
    console.log('Notification stats:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getMemberByNumber(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT * FROM members WHERE member_number = $1',
      [memberNumber]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function createMember(memberNumber, name, phone = null, email = null, isAdmin = false, pin = null) {
  const client = await getClient();
  try {
    await client.query(
      'INSERT INTO members (member_number, name, phone, email, is_admin, pin) VALUES ($1, $2, $3, $4, $5, $6)',
      [memberNumber, name, phone, email, isAdmin, pin]
    );
  } finally {
    client.release();
  }
}

export async function getAllMembers() {
  const client = await getClient();
  try {
    const result = await client.query('SELECT * FROM members ORDER BY name');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getAdminMembers() {
  const client = await getClient();
  try {
    const result = await client.query('SELECT * FROM members WHERE is_admin = TRUE ORDER BY name');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function isAdmin(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT is_admin FROM members WHERE member_number = $1',
      [memberNumber]
    );
    return result.rows[0]?.is_admin || false;
  } finally {
    client.release();
  }
}

export async function updateCheckoutChecklist(checkInId, completed) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE check_ins SET checkout_checklist_completed = $1 WHERE id = $2',
      [completed, checkInId]
    );
  } finally {
    client.release();
  }
}

export async function updateCheckinChecklist(checkInId, completed) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE check_ins SET checkin_checklist_completed = $1 WHERE id = $2',
      [completed, checkInId]
    );
  } finally {
    client.release();
  }
}

export async function updateTripNotes(checkInId, notes, weatherConditions) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE check_ins SET trip_notes = $1, weather_conditions = $2 WHERE id = $3',
      [notes, weatherConditions, checkInId]
    );
  } finally {
    client.release();
  }
}

export async function addTripPhoto(checkInId, memberNumber, photoUrl, caption = null) {
  const client = await getClient();
  try {
    const result = await client.query(
      'INSERT INTO trip_photos (check_in_id, member_number, photo_url, caption) VALUES ($1, $2, $3, $4) RETURNING id',
      [checkInId, memberNumber, photoUrl, caption]
    );
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function getTripPhotos(checkInId) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT tp.*, m.name as member_name 
       FROM trip_photos tp 
       JOIN members m ON tp.member_number = m.member_number 
       WHERE tp.check_in_id = $1 
       ORDER BY tp.created_at DESC`,
      [checkInId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function likeTripPhoto(tripPhotoId, memberNumber) {
  const client = await getClient();
  try {
    await client.query(
      'INSERT INTO trip_likes (trip_photo_id, member_number) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [tripPhotoId, memberNumber]
    );
  } finally {
    client.release();
  }
}

export async function unlikeTripPhoto(tripPhotoId, memberNumber) {
  const client = await getClient();
  try {
    await client.query(
      'DELETE FROM trip_likes WHERE trip_photo_id = $1 AND member_number = $2',
      [tripPhotoId, memberNumber]
    );
  } finally {
    client.release();
  }
}

export async function getTripPhotoLikes(tripPhotoId) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT COUNT(*) as count FROM trip_likes WHERE trip_photo_id = $1',
      [tripPhotoId]
    );
    return result.rows[0].count;
  } finally {
    client.release();
  }
}

export async function addTripComment(tripPhotoId, memberNumber, comment) {
  const client = await getClient();
  try {
    await client.query(
      'INSERT INTO trip_comments (trip_photo_id, member_number, comment) VALUES ($1, $2, $3)',
      [tripPhotoId, memberNumber, comment]
    );
  } finally {
    client.release();
  }
}

export async function getTripComments(tripPhotoId) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT tc.*, m.name as member_name 
       FROM trip_comments tc 
       JOIN members m ON tc.member_number = m.member_number 
       WHERE tc.trip_photo_id = $1 
       ORDER BY tc.created_at ASC`,
      [tripPhotoId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function deleteTripPhoto(tripPhotoId) {
  const client = await getClient();
  try {
    // Delete related data first
    await client.query('DELETE FROM trip_likes WHERE trip_photo_id = $1', [tripPhotoId]);
    await client.query('DELETE FROM trip_comments WHERE trip_photo_id = $1', [tripPhotoId]);
    await client.query('DELETE FROM trip_photos WHERE id = $1', [tripPhotoId]);
  } finally {
    client.release();
  }
}

export async function updateMemberProfile(memberNumber, profileData) {
  const client = await getClient();
  try {
    const { name, phone, email, bio, sailing_experience, profile_picture } = profileData;
    await client.query(
      `UPDATE members 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email),
           bio = COALESCE($4, bio),
           sailing_experience = COALESCE($5, sailing_experience),
           profile_picture = COALESCE($6, profile_picture)
       WHERE member_number = $7`,
      [name, phone, email, bio, sailing_experience, profile_picture, memberNumber]
    );
  } finally {
    client.release();
  }
}

export async function getMemberTrips(memberNumber, limit = 10) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT c.*, b.name as boat_name 
       FROM check_ins c 
       JOIN boats b ON c.boat_id = b.id 
       WHERE c.member_number = $1 
       ORDER BY c.departure_time DESC 
       LIMIT $2`,
      [memberNumber, limit]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function sendFriendRequest(memberNumber1, memberNumber2) {
  const client = await getClient();
  try {
    await client.query(
      'INSERT INTO user_friends (member_number1, member_number2, status) VALUES ($1, $2, \'pending\') ON CONFLICT DO NOTHING',
      [memberNumber1, memberNumber2]
    );
  } finally {
    client.release();
  }
}

export async function acceptFriendRequest(memberNumber1, memberNumber2) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE user_friends SET status = \'accepted\' WHERE member_number1 = $1 AND member_number2 = $2',
      [memberNumber1, memberNumber2]
    );
  } finally {
    client.release();
  }
}

export async function getFriends(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT m.* FROM members m 
       JOIN user_friends uf ON (m.member_number = uf.member_number1 OR m.member_number = uf.member_number2)
       WHERE (uf.member_number1 = $1 OR uf.member_number2 = $1) 
       AND uf.status = 'accepted' 
       AND m.member_number != $1`,
      [memberNumber]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getPendingFriendRequests(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT m.* FROM members m 
       JOIN user_friends uf ON m.member_number = uf.member_number1
       WHERE uf.member_number2 = $1 AND uf.status = 'pending'`,
      [memberNumber]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createPlannedOuting(outingData) {
  const client = await getClient();
  try {
    const { title, description, date, time, location, max_participants, created_by } = outingData;
    const result = await client.query(
      `INSERT INTO planned_outings (title, description, date, time, location, max_participants, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [title, description, date, time, location, max_participants, created_by]
    );
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function getPlannedOutings() {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT o.*, m.name as creator_name, 
              COUNT(op.member_number) as participant_count
       FROM planned_outings o 
       JOIN members m ON o.created_by = m.member_number
       LEFT JOIN outing_participants op ON o.id = op.outing_id
       WHERE o.date >= CURRENT_DATE
       GROUP BY o.id, m.name
       ORDER BY o.date ASC, o.time ASC`
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function joinOuting(outingId, memberNumber) {
  const client = await getClient();
  try {
    await client.query(
      'INSERT INTO outing_participants (outing_id, member_number) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [outingId, memberNumber]
    );
  } finally {
    client.release();
  }
}

export async function getOutingParticipants(outingId) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT m.* FROM members m 
       JOIN outing_participants op ON m.member_number = op.member_number
       WHERE op.outing_id = $1`,
      [outingId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function sendMessage(senderMemberNumber, receiverMemberNumber, message) {
  const client = await getClient();
  try {
    await client.query(
      'INSERT INTO messages (sender_member_number, receiver_member_number, message) VALUES ($1, $2, $3)',
      [senderMemberNumber, receiverMemberNumber, message]
    );
  } finally {
    client.release();
  }
}

export async function getMessages(memberNumber1, memberNumber2) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT * FROM messages 
       WHERE (sender_member_number = $1 AND receiver_member_number = $2)
          OR (sender_member_number = $2 AND receiver_member_number = $1)
       ORDER BY sent_at ASC`,
      [memberNumber1, memberNumber2]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function markMessageAsRead(messageId) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE messages SET is_read = TRUE WHERE id = $1',
      [messageId]
    );
  } finally {
    client.release();
  }
}

export async function getUnreadMessageCount(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_member_number = $1 AND is_read = FALSE',
      [memberNumber]
    );
    return result.rows[0].count;
  } finally {
    client.release();
  }
}

export async function cleanupOldMessages(daysOld = 30) {
  const client = await getClient();
  try {
    console.log(`Cleaning up messages older than ${daysOld} days...`);
    const result = await client.query(
      'DELETE FROM messages WHERE sent_at < CURRENT_TIMESTAMP - INTERVAL \'$1 days\'',
      [daysOld]
    );
    console.log(`Cleaned up ${result.rowCount || 0} old messages`);
    return result.rowCount || 0;
  } catch (error) {
    console.error('Error cleaning up messages:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getMessageStats() {
  const client = await getClient();
  try {
    console.log('Fetching message stats...');
    const result = await client.query(`
      SELECT 
        COUNT(*) as total,
        MIN(sent_at) as oldest,
        MAX(sent_at) as newest
      FROM messages
    `);
    console.log('Message stats:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching message stats:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function verifyMemberCredentials(memberNumber, pin) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT * FROM members WHERE member_number = $1 AND pin = $2',
      [memberNumber, pin]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function updateMemberPin(memberNumber, newPin) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE members SET pin = $1 WHERE member_number = $2',
      [newPin, memberNumber]
    );
  } finally {
    client.release();
  }
}

export async function getBoatClass(boatName) {
  if (boatName.includes('Quest')) return 'Quest';
  if (boatName.includes('Zest')) return 'Zest';
  if (boatName.includes('Topaz')) return 'Topaz';
  if (boatName.includes('Laser')) return 'Laser';
  if (boatName.includes('Kayak')) return 'Kayak';
  if (boatName.includes('Paddle Board')) return 'Paddle Board';
  return 'Other';
}

export async function calculateAndUpdateBoatHours(memberNumber, checkInId) {
  const client = await getClient();
  try {
    // Get check-in details
    const checkInResult = await client.query(
      'SELECT boat_id, departure_time, actual_return FROM check_ins WHERE id = $1',
      [checkInId]
    );
    
    if (checkInResult.rows.length === 0) return;
    
    const { boat_id, departure_time, actual_return } = checkInResult.rows[0];
    
    if (!actual_return) return; // Trip not completed yet
    
    // Calculate hours
    const departure = new Date(departure_time);
    const return_time = new Date(actual_return);
    const hours = (return_time - departure) / (1000 * 60 * 60);
    
    // Record boat hours
    await client.query(
      'INSERT INTO boat_hours (member_number, check_in_id, boat_id, hours) VALUES ($1, $2, $3, $4)',
      [memberNumber, checkInId, boat_id, hours]
    );
  } finally {
    client.release();
  }
}

export async function getMemberBoatHours(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT bh.*, b.name as boat_name, c.departure_time, c.actual_return
       FROM boat_hours bh 
       JOIN boats b ON bh.boat_id = b.id
       JOIN check_ins c ON bh.check_in_id = c.id
       WHERE bh.member_number = $1 
       ORDER BY bh.recorded_at DESC`,
      [memberNumber]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getTotalBoatHours(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT SUM(hours) as total_hours FROM boat_hours WHERE member_number = $1',
      [memberNumber]
    );
    return result.rows[0].total_hours || 0;
  } finally {
    client.release();
  }
}

export async function reportMaintenanceIssue(issueData) {
  const client = await getClient();
  try {
    const { boat_id, reported_by, issue_type, description, severity } = issueData;
    const result = await client.query(
      `INSERT INTO maintenance_issues (boat_id, reported_by, issue_type, description, severity)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [boat_id, reported_by, issue_type, description, severity]
    );
    
    // Update boat status if needed
    if (severity === 'high') {
      await updateBoatStatus(boat_id, 'maintenance', null, null);
    }
    
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function getMaintenanceIssues(status = null) {
  const client = await getClient();
  try {
    let query = `
      SELECT mi.*, b.name as boat_name, m.name as reporter_name, 
             resolver.name as resolver_name
      FROM maintenance_issues mi 
      JOIN boats b ON mi.boat_id = b.id
      JOIN members m ON mi.reported_by = m.member_number
      LEFT JOIN members resolver ON mi.resolved_by = resolver.member_number
    `;
    
    const params = [];
    if (status) {
      query += ' WHERE mi.status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY mi.reported_at DESC';
    
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getActiveMaintenanceIssues() {
  return await getMaintenanceIssues('open');
}

export async function updateMaintenanceIssue(issueId, updateData) {
  const client = await getClient();
  try {
    const { status, resolved_by, resolution_notes } = updateData;
    
    let query = 'UPDATE maintenance_issues SET ';
    const params = [];
    let paramCount = 1;
    
    if (status) {
      query += `status = $${paramCount++}, `;
      params.push(status);
    }
    
    if (resolved_by) {
      query += `resolved_by = $${paramCount++}, `;
      params.push(resolved_by);
    }
    
    if (resolution_notes) {
      query += `resolution_notes = $${paramCount++}, `;
      params.push(resolution_notes);
    }
    
    if (status === 'resolved') {
      query += `resolved_at = CURRENT_TIMESTAMP, `;
    }
    
    query = query.slice(0, -2); // Remove trailing comma and space
    query += ` WHERE id = $${paramCount}`;
    params.push(issueId);
    
    await client.query(query, params);
    
    // If resolved, check if boat should be operational
    if (status === 'resolved') {
      const issueResult = await client.query(
        'SELECT boat_id FROM maintenance_issues WHERE id = $1',
        [issueId]
      );
      
      if (issueResult.rows.length > 0) {
        const boatId = issueResult.rows[0].boat_id;
        
        // Check if there are other open issues for this boat
        const openIssuesResult = await client.query(
          'SELECT COUNT(*) as count FROM maintenance_issues WHERE boat_id = $1 AND status = \'open\'',
          [boatId]
        );
        
        if (openIssuesResult.rows[0].count == 0) {
          await updateBoatStatus(boatId, 'operational', null, null);
        }
      }
    }
  } finally {
    client.release();
  }
}

export async function getMaintenanceIssue(issueId) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT mi.*, b.name as boat_name, m.name as reporter_name, 
              resolver.name as resolver_name
       FROM maintenance_issues mi 
       JOIN boats b ON mi.boat_id = b.id
       JOIN members m ON mi.reported_by = m.member_number
       LEFT JOIN members resolver ON mi.resolved_by = resolver.member_number
       WHERE mi.id = $1`,
      [issueId]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function checkInBoatForMember(boatId, memberNumber, adminMemberNumber) {
  const client = await getClient();
  try {
    // Get member details
    const memberResult = await client.query(
      'SELECT name, phone FROM members WHERE member_number = $1',
      [memberNumber]
    );
    
    if (memberResult.rows.length === 0) {
      throw new Error('Member not found');
    }
    
    const { name, phone } = memberResult.rows[0];
    
    // Create check-in
    const departureTime = new Date();
    const expectedReturn = new Date();
    expectedReturn.setHours(expectedReturn.getHours() + 4); // Default 4 hours
    
    const checkInId = await createCheckIn(boatId, name, departureTime, expectedReturn, memberNumber, phone);
    
    // Create admin notification
    await createNotification(boatId, 'admin_checkin', `Admin ${adminMemberNumber} checked in ${memberNumber} for ${boatId}`);
    
    return checkInId;
  } finally {
    client.release();
  }
}

export async function deleteMember(memberNumber) {
  const client = await getClient();
  try {
    // Delete related data first
    await client.query('DELETE FROM trip_likes WHERE trip_photo_id IN (SELECT id FROM trip_photos WHERE member_number = $1)', [memberNumber]);
    await client.query('DELETE FROM trip_comments WHERE trip_photo_id IN (SELECT id FROM trip_photos WHERE member_number = $1)', [memberNumber]);
    await client.query('DELETE FROM trip_photos WHERE member_number = $1', [memberNumber]);
    await client.query('DELETE FROM boat_hours WHERE member_number = $1', [memberNumber]);
    await client.query('DELETE FROM user_friends WHERE member_number1 = $1 OR member_number2 = $1', [memberNumber]);
    await client.query('DELETE FROM outing_participants WHERE member_number = $1', [memberNumber]);
    await client.query('DELETE FROM messages WHERE sender_member_number = $1 OR receiver_member_number = $1', [memberNumber]);
    await client.query('DELETE FROM check_ins WHERE member_number = $1', [memberNumber]);
    await client.query('DELETE FROM members WHERE member_number = $1', [memberNumber]);
  } finally {
    client.release();
  }
}

export async function updateMember(memberNumber, updateData) {
  const client = await getClient();
  try {
    const { name, phone, email, is_admin, pin } = updateData;
    
    let query = 'UPDATE members SET ';
    const params = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      query += `name = $${paramCount++}, `;
      params.push(name);
    }
    
    if (phone !== undefined) {
      query += `phone = $${paramCount++}, `;
      params.push(phone);
    }
    
    if (email !== undefined) {
      query += `email = $${paramCount++}, `;
      params.push(email);
    }
    
    if (is_admin !== undefined) {
      query += `is_admin = $${paramCount++}, `;
      params.push(is_admin);
    }
    
    if (pin !== undefined) {
      query += `pin = $${paramCount++}, `;
      params.push(pin);
    }
    
    query = query.slice(0, -2); // Remove trailing comma and space
    query += ` WHERE member_number = $${paramCount}`;
    params.push(memberNumber);
    
    await client.query(query, params);
  } finally {
    client.release();
  }
}

export async function getBoatMaintenanceHistory(boatId) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT mi.*, m.name as reporter_name, resolver.name as resolver_name
       FROM maintenance_issues mi 
       JOIN members m ON mi.reported_by = m.member_number
       LEFT JOIN members resolver ON mi.resolved_by = resolver.member_number
       WHERE mi.boat_id = $1 
       ORDER BY mi.reported_at DESC`,
      [boatId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Push Subscription Management
export async function storePushSubscription(subscriptionData) {
  const client = await getClient();
  try {
    const { endpoint, p256dh, auth, userAgent, memberNumber, timestamp } = subscriptionData;
    
    // First, try to update existing subscription for this endpoint
    const updateResult = await client.query(
      `UPDATE push_subscriptions 
       SET p256dh = $1, auth = $2, user_agent = $3, member_number = $4, updated_at = $5
       WHERE endpoint = $6`,
      [p256dh, auth, userAgent, memberNumber, timestamp, endpoint]
    );
    
    // If no rows were updated, insert a new subscription
    if (updateResult.rowCount === 0) {
      await client.query(
        `INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_agent, member_number, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [endpoint, p256dh, auth, userAgent, memberNumber, timestamp, timestamp]
      );
    }
  } finally {
    client.release();
  }
}

export async function getPushSubscriptions(memberNumber = null) {
  const client = await getClient();
  try {
    let query = `SELECT * FROM push_subscriptions`;
    let params = [];
    
    if (memberNumber) {
      query += ` WHERE member_number = $1`;
      params.push(memberNumber);
    }
    
    query += ` ORDER BY updated_at DESC`;
    
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function deletePushSubscription(endpoint) {
  const client = await getClient();
  try {
    await client.query(
      `DELETE FROM push_subscriptions WHERE endpoint = $1`,
      [endpoint]
    );
  } finally {
    client.release();
  }
}

export async function getAdmins() {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT member_number, name, email, phone FROM members WHERE is_admin = TRUE ORDER BY name`
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function updatePushSubscriptionMember(endpoint, memberNumber) {
  const client = await getClient();
  try {
    await client.query(
      `UPDATE push_subscriptions 
       SET member_number = $1, updated_at = CURRENT_TIMESTAMP
       WHERE endpoint = $2`,
      [memberNumber, endpoint]
    );
    console.log(`📱 Updated push subscription for endpoint ${endpoint.substring(0, 50)}... to member ${memberNumber}`);
  } finally {
    client.release();
  }
}

export async function getMemberActivity(memberNumber) {
  const client = await getClient();
  try {
    const result = await client.query(
      `SELECT 'check_in' as type, c.departure_time as date, b.name as boat_name, c.trip_notes
       FROM check_ins c 
       JOIN boats b ON c.boat_id = b.id 
       WHERE c.member_number = $1 AND c.actual_return IS NOT NULL
       UNION ALL
       SELECT 'maintenance' as type, mi.reported_at as date, b.name as boat_name, mi.description
       FROM maintenance_issues mi 
       JOIN boats b ON mi.boat_id = b.id 
       WHERE mi.reported_by = $1
       ORDER BY date DESC
       LIMIT 20`,
      [memberNumber]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getQRCodes() {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT * FROM qr_codes ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getQRCodeByBoatId(boatId) {
  const client = await getClient();
  try {
    const result = await client.query(
      'SELECT * FROM qr_codes WHERE boat_id = $1 ORDER BY created_at DESC LIMIT 1',
      [boatId]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function createQRCode(boatId, qrCodeUrl) {
  const client = await getClient();
  try {
    const result = await client.query(
      'INSERT INTO qr_codes (boat_id, qr_code_url) VALUES ($1, $2) RETURNING id',
      [boatId, qrCodeUrl]
    );
    return result.rows[0].id;
  } finally {
    client.release();
  }
}

export async function updateQRCode(boatId, qrCodeUrl) {
  const client = await getClient();
  try {
    await client.query(
      'UPDATE qr_codes SET qr_code_url = $1, created_at = CURRENT_TIMESTAMP WHERE boat_id = $2',
      [qrCodeUrl, boatId]
    );
  } finally {
    client.release();
  }
} 

// ✅ NEW: Function to sync existing boat statuses with maintenance issues
export async function syncBoatStatusesWithMaintenance() {
  const client = await getClient();
  try {
    // Get all boats with maintenance or out_of_service status
    const maintenanceBoats = await client.query(
      'SELECT id, name, status, notes FROM boats WHERE status IN (\'maintenance\', \'out_of_service\')'
    );
    
    for (const boat of maintenanceBoats.rows) {
      // Check if there's already a maintenance issue for this boat
      const existingIssue = await client.query(
        'SELECT id FROM maintenance_issues WHERE boat_id = $1 AND status = \'open\'',
        [boat.id]
      );
      
      if (existingIssue.rows.length === 0) {
        // Get or create system admin for the reported_by field
        let reportedBy = '000';
        await client.query(
          'INSERT INTO members (member_number, name, is_admin) VALUES ($1, $2, $3) ON CONFLICT (member_number) DO NOTHING',
          ['000', 'System Admin', true]
        );
        
        // Create a maintenance issue for this boat
        await client.query(
          `INSERT INTO maintenance_issues (boat_id, reported_by, issue_type, description, severity, status)
           VALUES ($1, $2, $3, $4, $5, 'open')`,
          [boat.id, reportedBy, 'status_sync', `Boat status: ${boat.status}${boat.notes ? ` - ${boat.notes}` : ''}`, 'medium']
        );
      }
    }
    
    console.log(`Synced ${maintenanceBoats.rows.length} boats with maintenance issues`);
    return maintenanceBoats.rows.length;
  } finally {
    client.release();
  }
} 