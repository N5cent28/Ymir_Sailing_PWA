import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite connection
const sqliteDb = await open({
  filename: path.join(process.cwd(), 'boats.db'),
  driver: sqlite3.Database
});

// PostgreSQL connection
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrateData() {
  console.log('🚀 Starting migration from SQLite to PostgreSQL...');
  
  try {
    // Migrate members
    console.log('📋 Migrating members...');
    const members = await sqliteDb.all('SELECT * FROM members');
    for (const member of members) {
      await pgPool.query(
        `INSERT INTO members (member_number, name, phone, email, profile_picture, bio, sailing_experience, pin, is_admin, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (member_number) DO NOTHING`,
        [member.member_number, member.name, member.phone, member.email, member.profile_picture, member.bio, member.sailing_experience, member.pin, member.is_admin, member.created_at]
      );
    }
    console.log(`✅ Migrated ${members.length} members`);

    // Migrate boats
    console.log('🚤 Migrating boats...');
    const boats = await sqliteDb.all('SELECT * FROM boats');
    for (const boat of boats) {
      await pgPool.query(
        `INSERT INTO boats (id, name, status, boat_type, last_maintenance, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [boat.id, boat.name, boat.status, boat.boat_type, boat.last_maintenance, boat.notes]
      );
    }
    console.log(`✅ Migrated ${boats.length} boats`);

    // Migrate check_ins
    console.log('📝 Migrating check-ins...');
    const checkIns = await sqliteDb.all('SELECT * FROM check_ins');
    for (const checkIn of checkIns) {
      await pgPool.query(
        `INSERT INTO check_ins (id, boat_id, sailor_name, member_number, phone, departure_time, expected_return, actual_return, checkout_checklist_completed, checkin_checklist_completed, trip_notes, weather_conditions, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO NOTHING`,
        [checkIn.id, checkIn.boat_id, checkIn.sailor_name, checkIn.member_number, checkIn.phone, checkIn.departure_time, checkIn.expected_return, checkIn.actual_return, checkIn.checkout_checklist_completed, checkIn.checkin_checklist_completed, checkIn.trip_notes, checkIn.weather_conditions, checkIn.created_at]
      );
    }
    console.log(`✅ Migrated ${checkIns.length} check-ins`);

    // Migrate notifications
    console.log('🔔 Migrating notifications...');
    const notifications = await sqliteDb.all('SELECT * FROM notifications');
    for (const notification of notifications) {
      await pgPool.query(
        `INSERT INTO notifications (id, boat_id, type, message, sent_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [notification.id, notification.boat_id, notification.type, notification.message, notification.sent_at]
      );
    }
    console.log(`✅ Migrated ${notifications.length} notifications`);

    // Migrate trip_photos
    console.log('📸 Migrating trip photos...');
    const tripPhotos = await sqliteDb.all('SELECT * FROM trip_photos');
    for (const photo of tripPhotos) {
      await pgPool.query(
        `INSERT INTO trip_photos (id, check_in_id, member_number, photo_url, caption, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [photo.id, photo.check_in_id, photo.member_number, photo.photo_url, photo.caption, photo.created_at]
      );
    }
    console.log(`✅ Migrated ${tripPhotos.length} trip photos`);

    // Migrate trip_likes
    console.log('👍 Migrating trip likes...');
    const tripLikes = await sqliteDb.all('SELECT * FROM trip_likes');
    for (const like of tripLikes) {
      await pgPool.query(
        `INSERT INTO trip_likes (id, trip_photo_id, member_number, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [like.id, like.trip_photo_id, like.member_number, like.created_at]
      );
    }
    console.log(`✅ Migrated ${tripLikes.length} trip likes`);

    // Migrate trip_comments
    console.log('💬 Migrating trip comments...');
    const tripComments = await sqliteDb.all('SELECT * FROM trip_comments');
    for (const comment of tripComments) {
      await pgPool.query(
        `INSERT INTO trip_comments (id, trip_photo_id, member_number, comment, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [comment.id, comment.trip_photo_id, comment.member_number, comment.comment, comment.created_at]
      );
    }
    console.log(`✅ Migrated ${tripComments.length} trip comments`);

    // Migrate user_friends
    console.log('👥 Migrating user friends...');
    const userFriends = await sqliteDb.all('SELECT * FROM user_friends');
    for (const friend of userFriends) {
      await pgPool.query(
        `INSERT INTO user_friends (id, member_number1, member_number2, status, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [friend.id, friend.member_number1, friend.member_number2, friend.status, friend.created_at]
      );
    }
    console.log(`✅ Migrated ${userFriends.length} user friends`);

    // Migrate planned_outings
    console.log('📅 Migrating planned outings...');
    const plannedOutings = await sqliteDb.all('SELECT * FROM planned_outings');
    for (const outing of plannedOutings) {
      await pgPool.query(
        `INSERT INTO planned_outings (id, title, description, date, time, location, max_participants, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [outing.id, outing.title, outing.description, outing.date, outing.time, outing.location, outing.max_participants, outing.created_by, outing.created_at]
      );
    }
    console.log(`✅ Migrated ${plannedOutings.length} planned outings`);

    // Migrate outing_participants
    console.log('👤 Migrating outing participants...');
    const outingParticipants = await sqliteDb.all('SELECT * FROM outing_participants');
    for (const participant of outingParticipants) {
      await pgPool.query(
        `INSERT INTO outing_participants (id, outing_id, member_number, status, joined_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [participant.id, participant.outing_id, participant.member_number, participant.status, participant.joined_at]
      );
    }
    console.log(`✅ Migrated ${outingParticipants.length} outing participants`);

    // Migrate messages
    console.log('💌 Migrating messages...');
    const messages = await sqliteDb.all('SELECT * FROM messages');
    for (const message of messages) {
      await pgPool.query(
        `INSERT INTO messages (id, sender_member_number, receiver_member_number, message, is_read, sent_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [message.id, message.sender_member_number, message.receiver_member_number, message.message, message.is_read, message.sent_at]
      );
    }
    console.log(`✅ Migrated ${messages.length} messages`);

    // Migrate boat_hours
    console.log('⏱️ Migrating boat hours...');
    const boatHours = await sqliteDb.all('SELECT * FROM boat_hours');
    let migratedBoatHours = 0;
    for (const hour of boatHours) {
      // Skip records with null check_in_id or boat_id
      if (!hour.check_in_id || !hour.boat_id) {
        console.log(`⚠️ Skipping boat hour record with null values: ${JSON.stringify(hour)}`);
        continue;
      }
      
      await pgPool.query(
        `INSERT INTO boat_hours (id, member_number, check_in_id, boat_id, hours, recorded_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [hour.id, hour.member_number, hour.check_in_id, hour.boat_id, hour.hours, hour.recorded_at]
      );
      migratedBoatHours++;
    }
    console.log(`✅ Migrated ${migratedBoatHours} boat hours (skipped ${boatHours.length - migratedBoatHours} with null values)`);

    // Migrate maintenance_issues
    console.log('🔧 Migrating maintenance issues...');
    const maintenanceIssues = await sqliteDb.all('SELECT * FROM maintenance_issues');
    let migratedMaintenanceIssues = 0;
    for (const issue of maintenanceIssues) {
      // Skip records with null reported_by
      if (!issue.reported_by) {
        console.log(`⚠️ Skipping maintenance issue with null reported_by: ${JSON.stringify(issue)}`);
        continue;
      }
      
      await pgPool.query(
        `INSERT INTO maintenance_issues (id, boat_id, reported_by, issue_type, description, severity, status, reported_at, resolved_at, resolved_by, resolution_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [issue.id, issue.boat_id, issue.reported_by, issue.issue_type, issue.description, issue.severity, issue.status, issue.reported_at, issue.resolved_at, issue.resolved_by, issue.resolution_notes]
      );
      migratedMaintenanceIssues++;
    }
    console.log(`✅ Migrated ${migratedMaintenanceIssues} maintenance issues (skipped ${maintenanceIssues.length - migratedMaintenanceIssues} with null values)`);

    // Migrate qr_codes
    console.log('📱 Migrating QR codes...');
    const qrCodes = await sqliteDb.all('SELECT * FROM qr_codes');
    for (const qrCode of qrCodes) {
      await pgPool.query(
        `INSERT INTO qr_codes (id, boat_id, qr_code_url, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [qrCode.id, qrCode.boat_id, qrCode.qr_code_url, qrCode.created_at]
      );
    }
    console.log(`✅ Migrated ${qrCodes.length} QR codes`);

    console.log('🎉 Migration completed successfully!');
    
    // Print summary
    console.log('\n📊 Migration Summary:');
    console.log(`- Members: ${members.length}`);
    console.log(`- Boats: ${boats.length}`);
    console.log(`- Check-ins: ${checkIns.length}`);
    console.log(`- Notifications: ${notifications.length}`);
    console.log(`- Trip photos: ${tripPhotos.length}`);
    console.log(`- Trip likes: ${tripLikes.length}`);
    console.log(`- Trip comments: ${tripComments.length}`);
    console.log(`- User friends: ${userFriends.length}`);
    console.log(`- Planned outings: ${plannedOutings.length}`);
    console.log(`- Outing participants: ${outingParticipants.length}`);
    console.log(`- Messages: ${messages.length}`);
    console.log(`- Boat hours: ${migratedBoatHours}`);
    console.log(`- Maintenance issues: ${migratedMaintenanceIssues}`);
    console.log(`- QR codes: ${qrCodes.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sqliteDb.close();
    await pgPool.end();
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData().catch(console.error);
}

export { migrateData }; 