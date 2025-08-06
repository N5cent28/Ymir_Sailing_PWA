import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'boats.db'),
      driver: sqlite3.Database
    });
    
    // Initialize database tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS members (
        member_number TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        profile_picture TEXT,
        bio TEXT,
        sailing_experience TEXT,
        pin TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS boats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'operational',
        boat_type TEXT DEFAULT 'individual', -- 'individual' or 'shared'
        last_maintenance DATE,
        notes TEXT
      );
      
      CREATE TABLE IF NOT EXISTS check_ins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        boat_id TEXT NOT NULL,
        sailor_name TEXT NOT NULL,
        member_number TEXT,
        phone TEXT,
        departure_time DATETIME NOT NULL,
        expected_return DATETIME NOT NULL,
        actual_return DATETIME,
        checkout_checklist_completed BOOLEAN DEFAULT FALSE,
        checkin_checklist_completed BOOLEAN DEFAULT FALSE,
        trip_notes TEXT,
        weather_conditions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (boat_id) REFERENCES boats (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        boat_id TEXT NOT NULL,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (boat_id) REFERENCES boats (id)
      );
      
      CREATE TABLE IF NOT EXISTS trip_photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        check_in_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        photo_url TEXT NOT NULL,
        caption TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (check_in_id) REFERENCES check_ins (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS trip_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_photo_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_photo_id) REFERENCES trip_photos (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(trip_photo_id, member_number)
      );
      
      CREATE TABLE IF NOT EXISTS trip_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_photo_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_photo_id) REFERENCES trip_photos (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS user_friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_number_1 TEXT NOT NULL,
        member_number_2 TEXT NOT NULL,
        status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_number_1) REFERENCES members (member_number),
        FOREIGN KEY (member_number_2) REFERENCES members (member_number),
        UNIQUE(member_number_1, member_number_2)
      );
      
      CREATE TABLE IF NOT EXISTS planned_outings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME,
        location TEXT,
        organizer_member_number TEXT NOT NULL,
        max_participants INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS outing_participants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        outing_id INTEGER NOT NULL,
        member_number TEXT NOT NULL,
        status TEXT DEFAULT 'confirmed', -- 'confirmed', 'maybe', 'declined'
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (outing_id) REFERENCES planned_outings (id),
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(outing_id, member_number)
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_member_number TEXT NOT NULL,
        receiver_member_number TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_member_number) REFERENCES members (member_number),
        FOREIGN KEY (receiver_member_number) REFERENCES members (member_number)
      );
      
      CREATE TABLE IF NOT EXISTS boat_hours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_number TEXT NOT NULL,
        boat_class TEXT NOT NULL, -- 'Zest', 'Quest', 'Paddling'
        total_hours REAL DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_number) REFERENCES members (member_number),
        UNIQUE(member_number, boat_class)
      );
      
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
      
      CREATE TABLE IF NOT EXISTS qr_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        boat_id TEXT NOT NULL UNIQUE,
        boat_name TEXT NOT NULL,
        filename TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (boat_id) REFERENCES boats (id)
      );
    `);
    
    // Insert default boats if they don't exist
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
      await db.run(
        'INSERT OR IGNORE INTO boats (id, name, boat_type, status) VALUES (?, ?, ?, ?)',
        [boat.id, boat.name, boat.type, 'operational']
      );
    }
    
    // Migration: Update any existing boats with 'available' status to 'operational'
    await db.run(
      'UPDATE boats SET status = ? WHERE status = ?',
      ['operational', 'available']
    );
  }
  return db;
}

export async function getBoatStatus(boatId) {
  const db = await getDb();
  const boat = await db.get('SELECT * FROM boats WHERE id = ?', [boatId]);
  return boat;
}

export async function updateBoatStatus(boatId, status, notes = null) {
  const db = await getDb();
  await db.run(
    'UPDATE boats SET status = ?, notes = ? WHERE id = ?',
    [status, notes, boatId]
  );
}

export async function createCheckIn(boatId, sailorName, departureTime, expectedReturn, memberNumber = null, phone = null) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO check_ins (boat_id, sailor_name, member_number, phone, departure_time, expected_return) VALUES (?, ?, ?, ?, ?, ?)',
    [boatId, sailorName, memberNumber, phone, departureTime, expectedReturn]
  );
  return result.lastID;
}

export async function completeCheckIn(checkInId) {
  console.log('🔍 COMPLETE CHECK-IN: Starting completion for checkInId:', checkInId);
  
  const db = await getDb();
  
  // Get the check-in details to find the member number
  const checkIn = await db.get('SELECT member_number FROM check_ins WHERE id = ?', [checkInId]);
  console.log('🔍 COMPLETE CHECK-IN: Found check-in:', checkIn);
  
  // Update the check-in with actual return time
  await db.run(
    'UPDATE check_ins SET actual_return = CURRENT_TIMESTAMP WHERE id = ?',
    [checkInId]
  );
  console.log('✅ COMPLETE CHECK-IN: Updated actual_return timestamp');
  
  // If there's a member number, calculate and update boat hours
  if (checkIn && checkIn.member_number) {
    console.log('🔍 COMPLETE CHECK-IN: Calculating boat hours for member:', checkIn.member_number);
    await calculateAndUpdateBoatHours(checkIn.member_number, checkInId);
    console.log('✅ COMPLETE CHECK-IN: Boat hours calculated and updated');
  } else {
    console.log('🔍 COMPLETE CHECK-IN: No member number found, skipping boat hours calculation');
  }
  
  console.log('✅ COMPLETE CHECK-IN: Successfully completed check-in');
}

export async function updateCheckInTime(checkInId, newReturnTime) {
  const db = await getDb();
  await db.run(
    'UPDATE check_ins SET expected_return = ? WHERE id = ?',
    [newReturnTime, checkInId]
  );
}

export async function getActiveCheckIns(boatId) {
  const db = await getDb();
  if (boatId) {
    return await db.all(
      'SELECT * FROM check_ins WHERE boat_id = ? AND actual_return IS NULL ORDER BY departure_time DESC',
      [boatId]
    );
  } else {
    return await db.all(
      'SELECT * FROM check_ins WHERE actual_return IS NULL ORDER BY departure_time DESC'
    );
  }
}

export async function getActiveCheckInsWithBoatNames(boatId) {
  const db = await getDb();
  if (boatId) {
    return await db.all(`
      SELECT c.*, b.name as boat_name 
      FROM check_ins c 
      JOIN boats b ON c.boat_id = b.id 
      WHERE c.boat_id = ? AND c.actual_return IS NULL 
      ORDER BY c.departure_time DESC
    `, [boatId]);
  } else {
    return await db.all(`
      SELECT c.*, b.name as boat_name 
      FROM check_ins c 
      JOIN boats b ON c.boat_id = b.id 
      WHERE c.actual_return IS NULL 
      ORDER BY c.departure_time DESC
    `);
  }
}

export async function getOverdueBoats() {
  const db = await getDb();
  return await db.all(`
    SELECT c.*, b.name as boat_name 
    FROM check_ins c 
    JOIN boats b ON c.boat_id = b.id 
    WHERE c.actual_return IS NULL 
    AND c.expected_return < datetime('now')
  `);
}

export async function createNotification(boatId, type, message) {
  const db = await getDb();
  await db.run(
    'INSERT INTO notifications (boat_id, type, message) VALUES (?, ?, ?)',
    [boatId, type, message]
  );
}

export async function getRecentNotifications(limit = 10) {
  const db = await getDb();
  return await db.all(
    'SELECT * FROM notifications ORDER BY sent_at DESC LIMIT ?',
    [limit]
  );
}

export async function cleanupOldNotifications(retentionDays = 30) {
  const db = await getDb();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  const result = await db.run(
    'DELETE FROM notifications WHERE sent_at < ?',
    [cutoffDate.toISOString()]
  );
  
  return result.changes; // Number of deleted notifications
}

export async function getNotificationStats() {
  const db = await getDb();
  const stats = await db.get('SELECT COUNT(*) as total, MIN(sent_at) as oldest, MAX(sent_at) as newest FROM notifications');
  return stats;
}

export async function getMemberByNumber(memberNumber) {
  const db = await getDb();
  return await db.get('SELECT * FROM members WHERE member_number = ?', [memberNumber]);
}

export async function createMember(memberNumber, name, phone = null, email = null, isAdmin = false, pin = null) {
  const db = await getDb();
  await db.run(
    'INSERT OR REPLACE INTO members (member_number, name, phone, email, is_admin, pin) VALUES (?, ?, ?, ?, ?, ?)',
    [memberNumber, name, phone, email, isAdmin, pin]
  );
}

export async function getAllMembers() {
  const db = await getDb();
  return await db.all('SELECT * FROM members ORDER BY name');
}

export async function getAdminMembers() {
  const db = await getDb();
  return await db.all('SELECT * FROM members WHERE is_admin = TRUE ORDER BY name');
}

export async function isAdmin(memberNumber) {
  const db = await getDb();
  const member = await db.get('SELECT is_admin FROM members WHERE member_number = ?', [memberNumber]);
  return member ? member.is_admin : false;
}

// Enhanced check-in/out functions
export async function updateCheckoutChecklist(checkInId, completed) {
  const db = await getDb();
  await db.run(
    'UPDATE check_ins SET checkout_checklist_completed = ? WHERE id = ?',
    [completed, checkInId]
  );
}

export async function updateCheckinChecklist(checkInId, completed) {
  const db = await getDb();
  await db.run(
    'UPDATE check_ins SET checkin_checklist_completed = ? WHERE id = ?',
    [completed, checkInId]
  );
}

export async function updateTripNotes(checkInId, notes, weatherConditions) {
  const db = await getDb();
  await db.run(
    'UPDATE check_ins SET trip_notes = ?, weather_conditions = ? WHERE id = ?',
    [notes, weatherConditions, checkInId]
  );
}

// Trip photos and social features
export async function addTripPhoto(checkInId, memberNumber, photoUrl, caption = null) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO trip_photos (check_in_id, member_number, photo_url, caption) VALUES (?, ?, ?, ?)',
    [checkInId, memberNumber, photoUrl, caption]
  );
  return result.lastID;
}

export async function getTripPhotos(checkInId) {
  const db = await getDb();
  return await db.all(`
    SELECT tp.*, m.name as sailor_name 
    FROM trip_photos tp 
    JOIN members m ON tp.member_number = m.member_number 
    WHERE tp.check_in_id = ? 
    ORDER BY tp.created_at DESC
  `, [checkInId]);
}

export async function likeTripPhoto(tripPhotoId, memberNumber) {
  const db = await getDb();
  try {
    await db.run(
      'INSERT INTO trip_likes (trip_photo_id, member_number) VALUES (?, ?)',
      [tripPhotoId, memberNumber]
    );
    return true;
  } catch (error) {
    // Already liked
    return false;
  }
}

export async function unlikeTripPhoto(tripPhotoId, memberNumber) {
  const db = await getDb();
  await db.run(
    'DELETE FROM trip_likes WHERE trip_photo_id = ? AND member_number = ?',
    [tripPhotoId, memberNumber]
  );
}

export async function getTripPhotoLikes(tripPhotoId) {
  const db = await getDb();
  return await db.all(
    'SELECT * FROM trip_likes WHERE trip_photo_id = ?',
    [tripPhotoId]
  );
}

export async function addTripComment(tripPhotoId, memberNumber, comment) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO trip_comments (trip_photo_id, member_number, comment) VALUES (?, ?, ?)',
    [tripPhotoId, memberNumber, comment]
  );
  return result.lastID;
}

export async function getTripComments(tripPhotoId) {
  const db = await getDb();
  const comments = await db.all(`
    SELECT tc.*, m.name as member_name 
    FROM trip_comments tc 
    JOIN members m ON tc.member_number = m.member_number 
    WHERE tc.trip_photo_id = ? 
    ORDER BY tc.created_at ASC
  `, [tripPhotoId]);
  
  return comments;
}

export async function deleteTripPhoto(tripPhotoId) {
  const db = await getDb();
  
  // Delete associated likes and comments first
  await db.run('DELETE FROM trip_likes WHERE trip_photo_id = ?', [tripPhotoId]);
  await db.run('DELETE FROM trip_comments WHERE trip_photo_id = ?', [tripPhotoId]);
  
  // Delete the photo
  await db.run('DELETE FROM trip_photos WHERE id = ?', [tripPhotoId]);
}

// User profiles and friends
export async function updateMemberProfile(memberNumber, profileData) {
  const db = await getDb();
  
  // Build dynamic update query based on provided fields
  const updates = [];
  const params = [];
  
  if (profileData.profile_picture !== undefined) {
    updates.push('profile_picture = ?');
    params.push(profileData.profile_picture);
  }
  
  if (profileData.bio !== undefined) {
    updates.push('bio = ?');
    params.push(profileData.bio);
  }
  
  if (profileData.sailing_experience !== undefined) {
    updates.push('sailing_experience = ?');
    params.push(profileData.sailing_experience);
  }
  
  if (updates.length === 0) {
    return; // No fields to update
  }
  
  params.push(memberNumber);
  
  const query = `UPDATE members SET ${updates.join(', ')} WHERE member_number = ?`;
  await db.run(query, params);
}

export async function getMemberTrips(memberNumber, limit = 10) {
  const db = await getDb();
  return await db.all(`
    SELECT c.*, b.name as boat_name 
    FROM check_ins c 
    JOIN boats b ON c.boat_id = b.id 
    WHERE c.member_number = ? 
    ORDER BY c.departure_time DESC 
    LIMIT ?
  `, [memberNumber, limit]);
}

export async function sendFriendRequest(memberNumber1, memberNumber2) {
  const db = await getDb();
  try {
    await db.run(
      'INSERT INTO user_friends (member_number_1, member_number_2) VALUES (?, ?)',
      [memberNumber1, memberNumber2]
    );
    return true;
  } catch (error) {
    // Request already exists
    return false;
  }
}

export async function acceptFriendRequest(memberNumber1, memberNumber2) {
  const db = await getDb();
  await db.run(
    'UPDATE user_friends SET status = "accepted" WHERE member_number_1 = ? AND member_number_2 = ?',
    [memberNumber1, memberNumber2]
  );
}

export async function getFriends(memberNumber) {
  const db = await getDb();
  return await db.all(`
    SELECT m.*, uf.status 
    FROM user_friends uf 
    JOIN members m ON (uf.member_number_1 = m.member_number OR uf.member_number_2 = m.member_number) 
    WHERE (uf.member_number_1 = ? OR uf.member_number_2 = ?) 
    AND m.member_number != ? 
    AND uf.status = "accepted"
  `, [memberNumber, memberNumber, memberNumber]);
}

export async function getPendingFriendRequests(memberNumber) {
  const db = await getDb();
  return await db.all(`
    SELECT m.*, uf.member_number_1 as requester 
    FROM user_friends uf 
    JOIN members m ON uf.member_number_1 = m.member_number 
    WHERE uf.member_number_2 = ? AND uf.status = "pending"
  `, [memberNumber]);
}

// Planned outings
export async function createPlannedOuting(outingData) {
  const db = await getDb();
  const { title, description, organizer_member_number, boat_id, planned_date, max_participants } = outingData;
  const result = await db.run(
    'INSERT INTO planned_outings (title, description, organizer_member_number, boat_id, planned_date, max_participants) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, organizer_member_number, boat_id, planned_date, max_participants]
  );
  return result.lastID;
}

export async function getPlannedOutings() {
  const db = await getDb();
  return await db.all(`
    SELECT po.*, m.name as organizer_name, b.name as boat_name 
    FROM planned_outings po 
    JOIN members m ON po.organizer_member_number = m.member_number 
    LEFT JOIN boats b ON po.boat_id = b.id 
    WHERE po.planned_date > datetime('now') 
    ORDER BY po.planned_date ASC
  `);
}

export async function joinOuting(outingId, memberNumber) {
  const db = await getDb();
  try {
    await db.run(
      'INSERT INTO outing_participants (outing_id, member_number) VALUES (?, ?)',
      [outingId, memberNumber]
    );
    return true;
  } catch (error) {
    // Already joined
    return false;
  }
}

export async function getOutingParticipants(outingId) {
  const db = await getDb();
  return await db.all(`
    SELECT op.*, m.name as sailor_name 
    FROM outing_participants op 
    JOIN members m ON op.member_number = m.member_number 
    WHERE op.outing_id = ?
  `, [outingId]);
}

// Messaging
export async function sendMessage(senderMemberNumber, receiverMemberNumber, message) {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO messages (sender_member_number, receiver_member_number, message) VALUES (?, ?, ?)',
    [senderMemberNumber, receiverMemberNumber, message]
  );
  return result.lastID;
}

export async function getMessages(memberNumber1, memberNumber2) {
  const db = await getDb();
  return await db.all(`
    SELECT m.*, mem.name as sender_name 
    FROM messages m 
    JOIN members mem ON m.sender_member_number = mem.member_number 
    WHERE (m.sender_member_number = ? AND m.receiver_member_number = ?) 
    OR (m.sender_member_number = ? AND m.receiver_member_number = ?) 
    ORDER BY m.created_at ASC
  `, [memberNumber1, memberNumber2, memberNumber2, memberNumber1]);
}

export async function markMessageAsRead(messageId) {
  const db = await getDb();
  await db.run(
    'UPDATE messages SET is_read = TRUE WHERE id = ?',
    [messageId]
  );
}

export async function getUnreadMessageCount(memberNumber) {
  const db = await getDb();
  const result = await db.get(
    'SELECT COUNT(*) as count FROM messages WHERE receiver_member_number = ? AND is_read = FALSE',
    [memberNumber]
  );
  return result.count;
}

export async function cleanupOldMessages(daysOld = 30) {
  const db = await getDb();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const result = await db.run(
    'DELETE FROM messages WHERE created_at < ?',
    [cutoffDate.toISOString()]
  );
  
  console.log(`🧹 Cleaned up ${result.changes} messages older than ${daysOld} days`);
  return result.changes;
}

export async function verifyMemberCredentials(memberNumber, pin) {
  const db = await getDb();
  const member = await db.get('SELECT * FROM members WHERE member_number = ? AND pin = ?', [memberNumber, pin]);
  return member || null;
}

export async function updateMemberPin(memberNumber, newPin) {
  const db = await getDb();
  await db.run(
    'UPDATE members SET pin = ? WHERE member_number = ?',
    [newPin, memberNumber]
  );
}

// Boat hours tracking functions
export async function getBoatClass(boatName) {
  const name = boatName.toLowerCase();
  
  // Solo dinghy: Zests, Lasers
  if (name.includes('zest') || name.includes('laser')) {
    return 'SoloDinghy';
  }
  
  // Dinghy: Quests, Topaz
  if (name.includes('quest') || name.includes('topaz')) {
    return 'Dinghy';
  }
  
  // Keelboat: Future boats
  if (name.includes('keel') || name.includes('yacht') || name.includes('sailboat')) {
    return 'Keelboat';
  }
  
  // Paddling: Kayaks, paddle boards
  if (name.includes('kayak') || name.includes('paddle')) {
    return 'Paddling';
  }
  
  // Default to Dinghy for unknown boats
  return 'Dinghy';
}

export async function calculateAndUpdateBoatHours(memberNumber, checkInId) {
  const db = await getDb();
  
  // Get the check-in details
  const checkIn = await db.get(
    'SELECT ci.*, b.name as boat_name FROM check_ins ci JOIN boats b ON ci.boat_id = b.id WHERE ci.id = ?',
    [checkInId]
  );
  
  if (!checkIn || !checkIn.actual_return) {
    return; // Can't calculate hours without actual return time
  }
  
  const boatClass = await getBoatClass(checkIn.boat_name);
  const departureTime = new Date(checkIn.departure_time);
  const returnTime = new Date(checkIn.actual_return);
  const hours = (returnTime - departureTime) / (1000 * 60 * 60); // Convert to hours
  
  // Update or insert boat hours
  await db.run(`
    INSERT INTO boat_hours (member_number, boat_class, total_hours, last_updated)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(member_number, boat_class) 
    DO UPDATE SET 
      total_hours = total_hours + ?,
      last_updated = CURRENT_TIMESTAMP
  `, [memberNumber, boatClass, hours, hours]);
}

export async function getMemberBoatHours(memberNumber) {
  const db = await getDb();
  const hours = await db.all(
    'SELECT boat_class, total_hours, last_updated FROM boat_hours WHERE member_number = ? ORDER BY boat_class',
    [memberNumber]
  );
  
  // Initialize with zero hours for all boat classes if no records exist
  const boatClasses = ['SoloDinghy', 'Dinghy', 'Keelboat', 'Paddling'];
  const hoursMap = {};
  
  boatClasses.forEach(boatClass => {
    hoursMap[boatClass] = 0;
  });
  
  hours.forEach(record => {
    hoursMap[record.boat_class] = record.total_hours;
  });
  
  return hoursMap;
}

export async function getTotalBoatHours(memberNumber) {
  const db = await getDb();
  const result = await db.get(
    'SELECT SUM(total_hours) as total FROM boat_hours WHERE member_number = ?',
    [memberNumber]
  );
  return result.total || 0;
}

// Maintenance issue functions
export async function reportMaintenanceIssue(issueData) {
  const db = await getDb();
  const { boat_id, reported_by_member_number, issue_type, description, severity = 'medium' } = issueData;
  
  const result = await db.run(
    'INSERT INTO maintenance_issues (boat_id, reported_by_member_number, issue_type, description, severity) VALUES (?, ?, ?, ?, ?)',
    [boat_id, reported_by_member_number, issue_type, description, severity]
  );
  
  // Update boat status to maintenance if it's a high/critical issue
  if (severity === 'high' || severity === 'critical') {
    await updateBoatStatus(boat_id, 'maintenance', `Maintenance issue reported: ${description}`);
  }
  
  return result.lastID;
}

export async function getMaintenanceIssues(status = null) {
  const db = await getDb();
  let query = `
    SELECT mi.*, b.name as boat_name, 
           m1.name as reported_by_name,
           m2.name as resolved_by_name
    FROM maintenance_issues mi
    JOIN boats b ON mi.boat_id = b.id
    JOIN members m1 ON mi.reported_by_member_number = m1.member_number
    LEFT JOIN members m2 ON mi.resolved_by_member_number = m2.member_number
  `;
  
  const params = [];
  if (status) {
    query += ' WHERE mi.status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY mi.reported_at DESC';
  
  return await db.all(query, params);
}

export async function getActiveMaintenanceIssues() {
  return await getMaintenanceIssues('open');
}

export async function updateMaintenanceIssue(issueId, updateData) {
  const db = await getDb();
  const { status, resolved_by_member_number, admin_notes } = updateData;
  
  // First, get the issue details to know which boat it affects
  const issue = await db.get('SELECT boat_id FROM maintenance_issues WHERE id = ?', [issueId]);
  if (!issue) {
    throw new Error('Maintenance issue not found');
  }
  
  let query = 'UPDATE maintenance_issues SET ';
  const params = [];
  const updates = [];
  
  if (status) {
    updates.push('status = ?');
    params.push(status);
    
    if (status === 'resolved' || status === 'closed') {
      updates.push('resolved_at = CURRENT_TIMESTAMP');
      
      // Update boat status back to operational when issue is resolved
      await updateBoatStatus(issue.boat_id, 'operational', null);
    }
  }
  
  if (resolved_by_member_number) {
    updates.push('resolved_by_member_number = ?');
    params.push(resolved_by_member_number);
  }
  
  if (admin_notes !== undefined) {
    updates.push('admin_notes = ?');
    params.push(admin_notes);
  }
  
  query += updates.join(', ') + ' WHERE id = ?';
  params.push(issueId);
  
  await db.run(query, params);
}

export async function getMaintenanceIssue(issueId) {
  const db = await getDb();
  return await db.get(`
    SELECT mi.*, b.name as boat_name, 
           m1.name as reported_by_name,
           m2.name as resolved_by_name
    FROM maintenance_issues mi
    JOIN boats b ON mi.boat_id = b.id
    JOIN members m1 ON mi.reported_by_member_number = m1.member_number
    LEFT JOIN members m2 ON mi.resolved_by_member_number = m2.member_number
    WHERE mi.id = ?
  `, [issueId]);
}

// Enhanced admin functions
export async function checkInBoatForMember(boatId, memberNumber, adminMemberNumber) {
  const db = await getDb();
  
  // Get the active check-in for this boat
  const activeCheckIn = await db.get(
    'SELECT * FROM check_ins WHERE boat_id = ? AND actual_return IS NULL',
    [boatId]
  );
  
  if (!activeCheckIn) {
    throw new Error('No active check-in found for this boat');
  }
  
  // Complete the check-in
  await completeCheckIn(activeCheckIn.id);
  
  // Create notification
  await createNotification(boatId, 'admin_check_in', 
    `Boat checked in by admin ${adminMemberNumber} for member ${memberNumber}`);
  
  return activeCheckIn.id;
}

export async function deleteMember(memberNumber) {
  const db = await getDb();
  
  // Check if member has any active check-ins
  const activeCheckIns = await db.get(
    'SELECT COUNT(*) as count FROM check_ins WHERE member_number = ? AND actual_return IS NULL',
    [memberNumber]
  );
  
  if (activeCheckIns.count > 0) {
    throw new Error('Cannot delete member with active check-ins');
  }
  
  // Delete related data (in order of dependencies)
  await db.run('DELETE FROM boat_hours WHERE member_number = ?', [memberNumber]);
  await db.run('DELETE FROM maintenance_issues WHERE reported_by_member_number = ?', [memberNumber]);
  await db.run('DELETE FROM maintenance_issues WHERE resolved_by_member_number = ?', [memberNumber]);
  await db.run('DELETE FROM trip_photos WHERE member_number = ?', [memberNumber]);
  await db.run('DELETE FROM trip_likes WHERE member_number = ?', [memberNumber]);
  await db.run('DELETE FROM trip_comments WHERE member_number = ?', [memberNumber]);
  await db.run('DELETE FROM user_friends WHERE member_number_1 = ? OR member_number_2 = ?', [memberNumber, memberNumber]);
  await db.run('DELETE FROM outing_participants WHERE member_number = ?', [memberNumber]);
  await db.run('DELETE FROM planned_outings WHERE organizer_member_number = ?', [memberNumber]);
  await db.run('DELETE FROM messages WHERE sender_member_number = ? OR receiver_member_number = ?', [memberNumber, memberNumber]);
  
  // Finally delete the member
  await db.run('DELETE FROM members WHERE member_number = ?', [memberNumber]);
}

export async function updateMember(memberNumber, updateData) {
  const db = await getDb();
  const { name, phone, email, is_admin, pin } = updateData;
  
  let query = 'UPDATE members SET ';
  const params = [];
  const updates = [];
  
  if (name) {
    updates.push('name = ?');
    params.push(name);
  }
  
  if (phone !== undefined) {
    updates.push('phone = ?');
    params.push(phone);
  }
  
  if (email !== undefined) {
    updates.push('email = ?');
    params.push(email);
  }
  
  if (is_admin !== undefined) {
    updates.push('is_admin = ?');
    params.push(is_admin);
  }
  
  if (pin !== undefined) {
    updates.push('pin = ?');
    params.push(pin);
  }
  
  query += updates.join(', ') + ' WHERE member_number = ?';
  params.push(memberNumber);
  
  await db.run(query, params);
}

export async function getBoatMaintenanceHistory(boatId) {
  const db = await getDb();
  return await db.all(`
    SELECT mi.*, m.name as reported_by_name
    FROM maintenance_issues mi
    JOIN members m ON mi.reported_by_member_number = m.member_number
    WHERE mi.boat_id = ?
    ORDER BY mi.reported_at DESC
  `, [boatId]);
}

export async function getMemberActivity(memberNumber) {
  const db = await getDb();
  
  // Get recent check-ins
  const checkIns = await db.all(`
    SELECT c.*, b.name as boat_name 
    FROM check_ins c 
    JOIN boats b ON c.boat_id = b.id 
    WHERE c.member_number = ? 
    ORDER BY c.departure_time DESC 
    LIMIT 10
  `, [memberNumber]);
  
  // Get recent photos
  const photos = await db.all(`
    SELECT tp.*, c.boat_id, b.name as boat_name 
    FROM trip_photos tp 
    JOIN check_ins c ON tp.check_in_id = c.id 
    JOIN boats b ON c.boat_id = b.id 
    WHERE tp.member_number = ? 
    ORDER BY tp.created_at DESC 
    LIMIT 10
  `, [memberNumber]);
  
  return {
    checkIns,
    photos
  };
}

export async function getQRCodes() {
  const db = await getDb();
  return await db.all('SELECT * FROM qr_codes ORDER BY boat_name');
}

export async function getQRCodeByBoatId(boatId) {
  const db = await getDb();
  return await db.get('SELECT * FROM qr_codes WHERE boat_id = ?', [boatId]);
} 