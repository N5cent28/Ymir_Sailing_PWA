# Ymir Sailing Club - Admin Guide

## Overview

The Ymir Sailing Club PWA includes a comprehensive admin system for managing the club's operations. This guide covers all admin features and how to use them effectively.

## Admin Access

### Navigation
- **Admin Dashboard**: `/en/admin-dashboard` - Main admin overview
- **Member Management**: `/en/members` - Add and manage club members
- **Boat Management**: `/en/admin` - Manage boat status and settings
- **Data Export**: `/en/data-export` - Export club data

## Admin Dashboard (`/en/admin-dashboard`)

### Quick Stats
- **Total Boats**: Shows the total number of boats in the system
- **Available**: Number of boats currently available for use
- **Active Check-ins**: Number of boats currently checked out
- **Members**: Total number of registered club members

### Quick Actions
- **Add Member**: Navigate to member management page
- **Manage Boats**: Navigate to boat management page
- **QR Codes**: Access QR code generation (future feature)

### Alerts
- **Overdue Boats**: Automatically displays boats that are overdue for return
- **Maintenance Summary**: Shows boats under maintenance or out of service

### Real-time Monitoring
- **Boat Status Overview**: Live view of all boats and their current status
- **Recent Activity**: Latest notifications and system events

## Member Management (`/en/members`)

### Adding New Members
1. Navigate to `/en/members`
2. Fill out the "Add New Member" form:
   - **Member Number** (required): Unique identifier (e.g., 1234)
   - **Full Name** (required): Member's full name
   - **Phone Number** (optional): Contact number
   - **Email Address** (optional): Email for notifications
3. Click "Add Member"

### Member List Features
- **Search**: Filter members by name, number, or email
- **View Profile**: Click to see member's sailing history and profile
- **Edit**: Modify member information (future feature)

### Member Information Stored
- Member number (unique identifier)
- Full name
- Phone number
- Email address
- Profile picture (future)
- Bio (future)
- Sailing experience level (future)
- Registration date

## Boat Management (`/en/admin`)

### Boat Status Management
Each boat can be set to one of three statuses:

1. **Available** (Green): Ready for use
2. **Maintenance** (Yellow): Under repair/maintenance
3. **Out of Service** (Red): Temporarily unavailable

### Boat Types
- **Individual Boats**: One user at a time (Quest, Zest, Topaz, Laser)
- **Shared Boats**: Multiple users can use simultaneously (Kayak, Paddle Board)

### Managing Boat Status
1. Navigate to `/en/admin`
2. Find the boat in the "Boat Status" section
3. Click the appropriate status button:
   - **Available**: Set boat as ready for use
   - **Maintenance**: Mark as under maintenance
   - **Out of Service**: Mark as temporarily unavailable
4. Add optional notes when prompted

### Boat Information Displayed
- Boat name and ID
- Current status
- Boat type (individual/shared)
- Active check-ins (if any)
- Maintenance notes

## Data Export (`/en/data-export`)

### Export Options

#### Individual Data Exports
- **Members List**: Export all member information as JSON
- **Boat Status**: Export current boat status and check-ins as JSON
- **Activity Log**: Export recent notifications and activity as JSON

#### Complete Data Export
- **JSON Export**: All data in a single JSON file
- **CSV Export**: All data formatted for spreadsheet applications

### Export Contents
- All member information
- Boat status and check-ins
- Activity notifications
- Trip history and notes
- Social interactions (future)

### Download Process
1. Navigate to `/en/data-export`
2. Choose the type of export needed
3. Click the export button
4. File will automatically download to your device

## Database Management

### Database Location
- **File**: `boats.db` (SQLite database)
- **Location**: Root directory of the project

### Database Tables
- `members`: Club member information
- `boats`: Boat inventory and status
- `check_ins`: Boat check-out/check-in records
- `notifications`: System activity log
- `trip_photos`: Member trip photos (future)
- `trip_likes`: Photo likes (future)
- `trip_comments`: Photo comments (future)
- `user_friends`: Member friendships (future)
- `planned_outings`: Group sailing events (future)
- `outing_participants`: Outing participants (future)
- `user_messages`: Member messaging (future)

### Database Migration
If you need to update the database schema:
```bash
node migrate-database.js
```

## Adding Demo Members

### Using the Add Member Script
```bash
node add-member.js
```

This script adds Noah Nicol as member #1234 for testing purposes.

### Manual Member Addition
You can also add members through the web interface at `/en/members`.

## QR Code Management

### QR Code URLs
Each boat has a unique QR code URL:
- Individual boats: `https://yourdomain.com/qr/boat-1` (Quest 1)
- Shared boats: `https://yourdomain.com/qr/kayak` (Kayak)

### Generating QR Codes
1. Use the URLs from the `generate-qr-codes.md` file
2. Generate QR codes using online tools or command line
3. Print and attach to boats

## Monitoring and Alerts

### Automatic Alerts
- **Overdue Boats**: Automatically detected and displayed
- **Maintenance Status**: Boats under maintenance are highlighted
- **Active Check-ins**: Real-time display of boat usage

### Notification Types
- `check_out`: Boat checked out
- `check_in`: Boat checked in
- `status_change`: Boat status updated
- `time_extension`: Return time extended
- `take_over`: Boat taken over by another sailor

## Best Practices

### Daily Operations
1. Check the admin dashboard for overdue boats
2. Monitor boat status and update as needed
3. Review recent activity for any issues
4. Add new members as they join

### Weekly Tasks
1. Export data for backup
2. Review member activity
3. Update boat maintenance status
4. Check for any system issues

### Monthly Tasks
1. Complete data export and backup
2. Review member engagement
3. Plan maintenance schedules
4. Update boat inventory if needed

## Troubleshooting

### Common Issues

#### Database Errors
- Run `node migrate-database.js` to update schema
- Check database file permissions
- Ensure SQLite is properly installed

#### Member Lookup Issues
- Verify member number format
- Check for duplicate member numbers
- Ensure member exists in database

#### Boat Status Issues
- Refresh the admin page
- Check database connectivity
- Verify boat ID format

### Getting Help
- Check the browser console for error messages
- Review the activity log for system events
- Export data for analysis if needed

## Security Considerations

### Admin Access
- Admin pages should be protected in production
- Consider implementing authentication
- Restrict access to authorized club officials

### Data Privacy
- Member information should be kept secure
- Regular data backups are recommended
- Follow local privacy regulations

### System Maintenance
- Keep the system updated
- Monitor for unusual activity
- Regular database backups

## Future Features

### Planned Admin Features
- Member photo uploads
- Advanced analytics and reporting
- Bulk member import/export
- Automated maintenance scheduling
- Enhanced notification system
- Social feature moderation tools

### Integration Possibilities
- Payment processing for memberships
- Weather API integration
- Maintenance tracking system
- Advanced reporting and analytics 