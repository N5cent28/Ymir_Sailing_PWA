# Ymir Sailing Club PWA - Complete Admin Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Admin Dashboard Overview](#admin-dashboard-overview)
3. [Member Management](#member-management)
4. [Boat Management](#boat-management)
5. [Active Boats Monitoring](#active-boats-monitoring)
6. [Maintenance Management](#maintenance-management)
7. [QR Code Management](#qr-code-management)
8. [Data Export & Analytics](#data-export--analytics)
9. [Notification System](#notification-system)
10. [Security & Access Control](#security--access-control)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

## Getting Started

### Admin Access
To access the admin system, you need to be logged in as an admin member. The system uses a simple PIN-based authentication system.

**Admin Login Process:**
1. Navigate to `/en/admin-login`
2. Enter your member number and 3-digit PIN
3. The system will verify your admin status
4. Once logged in, you'll have access to all admin features

### Navigation Overview
The admin system consists of several key sections accessible from the main admin dashboard:

- **Admin Dashboard** (`/en/admin-dashboard`) - Main overview and quick actions
- **Member Management** (`/en/members`) - Add, edit, and manage club members
- **Boat Management** (`/en/admin`) - Update boat status and settings
- **Active Boats** (`/en/admin-check-ins`) - Monitor boats currently checked out
- **Maintenance** (`/en/admin-maintenance`) - Track and manage boat issues
- **QR Codes** (`/en/admin-qr-codes`) - Upload and manage boat QR codes

## Admin Dashboard Overview

### Quick Statistics
The dashboard provides real-time statistics at a glance:

- **Total Boats**: Complete count of all boats in the system
- **On the Water**: Number of boats currently checked out
- **Available**: Boats ready for use
- **Members**: Total registered club members
- **Maintenance**: Boats under repair
- **Out of Service**: Temporarily unavailable boats

### Quick Actions
The dashboard includes quick action buttons for common tasks:

1. **Edit Members** - Navigate to member management
2. **Manage Boats** - Update boat status and settings
3. **Active Boats** - Monitor boats currently checked out
4. **Maintenance** - Track and manage boat issues
5. **Manage QR Codes** - Upload and manage boat QR codes
6. **Test Notifications** - Test the push notification system

### Real-Time Monitoring
- **Overdue Boats**: Automatically displays boats that are overdue for return
- **Recent Activity**: Latest system notifications and events
- **Boat Status Overview**: Live view of all boats and their current status

## Member Management

### Adding New Members

**Step-by-Step Process:**
1. Navigate to `/en/members`
2. Fill out the "Add New Member" form:
   - **Member Number** (required): Unique identifier (e.g., 1234)
   - **Full Name** (required): Member's complete name
   - **Phone Number** (optional): Contact number
   - **Email Address** (optional): Email for notifications
   - **Admin Status** (optional): Check if member should have admin access
3. Click "Add Member"
4. The system will automatically generate a 3-digit PIN for the member

### Member Information Management

**Viewing Member Details:**
- Click on any member in the member list to view their profile
- View sailing history, trip photos, and activity
- See member's current PIN (for admin reference)

**Member Data Stored:**
- Member number (unique identifier)
- Full name
- Phone number
- Email address
- 3-digit PIN (securely hashed)
- Admin status
- Registration date
- Sailing history and trip photos
- Profile information (bio, sailing experience)

### Bulk Member Operations

**CSV Import:**
- Use the bulk upload feature to import multiple members
- Download the CSV template for proper formatting
- Include: member_number, name, phone, email, is_admin

**Member Search and Filtering:**
- Search members by name, number, or email
- Filter by admin status
- Sort by registration date or name

## Boat Management

### Boat Status Management

**Available Statuses:**
1. **Operational** (Green): Ready for use
2. **Checked Out** (Blue): Currently in use
3. **Maintenance** (Yellow): Under repair/maintenance
4. **Out of Service** (Red): Temporarily unavailable

**Changing Boat Status:**
1. Navigate to `/en/admin`
2. Find the boat in the "Boat Status" section
3. Use the dropdown menu to select new status
4. Add optional notes when prompted
5. Click to confirm the change

### Boat Types

**Individual Boats:**
- Quest 1 & 2
- Zest 1-6
- Topaz 1 & 2
- Laser 1-4
- One user at a time

**Shared Boats:**
- Kayak
- Paddle Board
- Multiple users can use simultaneously

### Boat Information Display

Each boat shows:
- Boat name and ID
- Current status with color coding
- Boat type (individual/shared)
- Active check-ins (if any)
- Maintenance notes
- Last maintenance date

## Active Boats Monitoring

### Real-Time Monitoring

**Accessing Active Boats:**
1. Navigate to `/en/admin-check-ins`
2. View all boats currently checked out
3. See real-time status and overdue alerts

**Information Displayed:**
- Boat name and ID
- Sailor name and member number
- Departure time
- Expected return time
- Current status (On Time/Overdue)
- Overdue hours (if applicable)

### Force Check-In Feature

**When to Use:**
- Member forgot to check in
- Emergency situations
- Boat returned without proper check-in

**Process:**
1. Find the boat in the active boats list
2. Click "Force Check-in" button
3. Confirm the action in the popup
4. Boat will be marked as returned

**Important Notes:**
- Use only when necessary
- System will log the force check-in
- Member will receive notification

## Maintenance Management

### Reporting Maintenance Issues

**Member Reporting Process:**
1. Members can report issues through their profile
2. Select boat, issue type, and severity
3. Provide detailed description
4. Issue appears in admin maintenance dashboard

### Admin Maintenance Management

**Accessing Maintenance Dashboard:**
1. Navigate to `/en/admin-maintenance`
2. View all reported issues
3. Filter by status (Active/All)

**Issue Management:**
- **Active Issues**: Currently open problems
- **All Issues**: Complete history including resolved

**Resolving Issues:**
1. Click "Resolve" button on any active issue
2. Issue status changes to "Resolved"
3. System logs resolution date and admin

### Issue Categories

**Severity Levels:**
- **Critical**: Safety issues requiring immediate attention
- **High**: Significant problems affecting usability
- **Medium**: Minor issues that should be addressed
- **Low**: Cosmetic or minor problems

**Issue Types:**
- Hull damage
- Sail problems
- Equipment malfunction
- Safety equipment
- Other

## QR Code Management

### QR Code System Overview

**Purpose:**
- Enable instant boat checkout via mobile scanning
- Pre-fill boat information for faster check-in
- Mobile-optimized experience

### Managing QR Codes

**Accessing QR Management:**
1. Navigate to `/en/admin-qr-codes`
2. View all boats and their QR code status
3. Upload QR code images for each boat

**Uploading QR Codes:**
1. Click "Upload QR Code" for any boat
2. Select image file (PNG, JPG, SVG)
3. System processes and stores the image
4. QR code appears in boat management pages

**QR Code URLs:**
- Individual boats: `https://yourdomain.com/qr/boat-1`
- Shared boats: `https://yourdomain.com/qr/kayak`
- Each boat has a unique URL

**Testing QR Codes:**
- Use "Test" button to verify QR code functionality
- "Copy URL" button copies the QR code URL to clipboard
- Test on mobile devices to ensure proper functionality

## Data Export & Analytics

### Export Options

**Individual Data Exports:**
- **Members List**: All member information as JSON
- **Boat Status**: Current boat status and check-ins
- **Activity Log**: Recent notifications and system events
- **Maintenance Issues**: All reported maintenance problems

**Complete Data Export:**
- **JSON Export**: All data in structured format
- **CSV Export**: Spreadsheet-compatible format

### Analytics Available

**Member Analytics:**
- Total members
- New members this month
- Member activity levels
- Sailing frequency

**Boat Usage Analytics:**
- Most popular boats
- Usage patterns by time/day
- Average trip duration
- Maintenance frequency

**System Analytics:**
- Check-in/check-out patterns
- Overdue boat frequency
- Maintenance issue trends
- Notification delivery rates

## Notification System

### Push Notifications

**Notification Types:**
- **Boat Reminders**: Return time approaching
- **Overdue Alerts**: Boat is overdue
- **Maintenance Updates**: Boat status changes
- **Club Announcements**: General communications

**Admin Notification Management:**
- Send club-wide announcements
- Monitor notification delivery
- Test notification system
- View notification history

### Testing Notifications

**Test Process:**
1. Navigate to "Test Notifications" from admin dashboard
2. Send test notifications to verify system
3. Check delivery status
4. Troubleshoot any issues

## Security & Access Control

### Admin Authentication

**PIN-Based Security:**
- 3-digit PINs for easy mobile access
- PINs are securely hashed using bcrypt
- Session-based authentication with expiration
- Automatic logout after inactivity

**Admin Access Control:**
- Only members with admin status can access admin features
- Role-based permissions
- Session management with secure storage

### Data Security

**Security Measures:**
- HTTPS encryption for all communication
- Input validation on all forms
- SQL injection prevention
- Secure PIN hashing
- Environment variable protection
- Session security

## Troubleshooting

### Common Issues

**Login Problems:**
- Verify member number and PIN
- Check admin status
- Clear browser cache if needed
- Contact system administrator

**Boat Status Issues:**
- Refresh the admin page
- Check for active check-ins before changing status
- Verify boat ID format
- Force check-in if necessary

**Member Management Issues:**
- Verify member number is unique
- Check required fields are filled
- Ensure proper email format
- Check for duplicate entries

**QR Code Problems:**
- Verify image format (PNG, JPG, SVG)
- Check file size (under 5MB recommended)
- Test QR code URLs
- Regenerate if needed

### Getting Help

**Self-Help Resources:**
- Check browser console for error messages
- Review system activity logs
- Export data for analysis
- Test individual features

**Contact Support:**
- Document the issue with screenshots
- Note error messages
- Include steps to reproduce
- Provide relevant data exports

## Best Practices

### Daily Operations

**Morning Checklist:**
1. Check admin dashboard for overdue boats
2. Review overnight notifications
3. Check maintenance issues
4. Verify boat status accuracy

**Evening Checklist:**
1. Review daily activity
2. Check for any issues
3. Update boat status as needed
4. Plan next day priorities

### Weekly Tasks

**Monday:**
- Review weekend activity
- Check for overdue boats
- Update maintenance status
- Plan week's priorities

**Friday:**
- Export weekly data
- Review member activity
- Check maintenance issues
- Prepare weekend monitoring

### Monthly Tasks

**Month-End:**
- Complete data export and backup
- Review member engagement
- Analyze usage patterns
- Plan maintenance schedules
- Update member information

### Member Communication

**Regular Updates:**
- Send club announcements
- Notify about maintenance
- Share usage statistics
- Provide system updates

**Emergency Procedures:**
- Force check-in overdue boats
- Send urgent notifications
- Update boat status immediately
- Contact members directly if needed

### System Maintenance

**Regular Monitoring:**
- Check system performance
- Monitor notification delivery
- Review error logs
- Update member data

**Data Management:**
- Regular data exports
- Clean up old notifications
- Archive resolved maintenance issues
- Backup member information

### Training New Admins

**Initial Setup:**
1. Create admin account
2. Provide login credentials
3. Walk through each admin feature
4. Practice common tasks
5. Review troubleshooting procedures

**Ongoing Support:**
- Regular check-ins
- Update on new features
- Address questions
- Provide additional training

---

## Quick Reference

### Admin URLs
- Dashboard: `/en/admin-dashboard`
- Members: `/en/members`
- Boats: `/en/admin`
- Active Boats: `/en/admin-check-ins`
- Maintenance: `/en/admin-maintenance`
- QR Codes: `/en/admin-qr-codes`
- Login: `/en/admin-login`

### Emergency Contacts
- System Administrator: [Contact Information]
- Technical Support: [Contact Information]
- Club Management: [Contact Information]

### Key Features Summary
- ✅ Real-time boat monitoring
- ✅ Member management with PIN system
- ✅ Maintenance issue tracking
- ✅ QR code management
- ✅ Push notifications
- ✅ Data export capabilities
- ✅ Multi-language support
- ✅ Mobile-optimized interface
- ✅ Secure authentication
- ✅ Comprehensive analytics

This guide covers all aspects of the Ymir Sailing Club PWA admin system. For additional support or questions, refer to the troubleshooting section or contact the system administrator.