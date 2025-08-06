# PIN Authentication System - Ymir Sailing Club

## Overview

The Ymir Sailing Club PWA now uses a secure 3-digit PIN authentication system for both regular members and administrators. This provides better security than just using member numbers and names.

## How It Works

### Authentication Flow
1. **Member Login**: Member enters their member number and 3-digit PIN
2. **Admin Login**: Admin enters their member number and 3-digit PIN
3. **Validation**: System verifies credentials against the database
4. **Access**: If valid, user gains access to their respective features

### Security Features
- **3-Digit PINs**: Simple but effective for a sailing club context
- **Separate Admin Authentication**: Admins have additional privileges
- **Session Management**: Uses localStorage for browser session
- **Error Handling**: Clear error messages for invalid credentials

## Database Schema

### Members Table
- `member_number` (TEXT, PRIMARY KEY): Unique member identifier
- `name` (TEXT): Member's full name
- `phone` (TEXT): Contact phone number
- `email` (TEXT): Email address
- `is_admin` (BOOLEAN): Admin status (TRUE/FALSE)
- `pin` (TEXT): 3-digit authentication PIN

## API Endpoints

### Member Login
- **Endpoint**: `POST /api/member-login`
- **Body**: `{ memberNumber: "1234", pin: "123" }`
- **Response**: Member data if successful, error if failed

### Admin Login
- **Endpoint**: `POST /api/admin-login`
- **Body**: `{ memberNumber: "1234", pin: "123" }`
- **Response**: Admin data if successful, error if failed

### Profile Data
- **Endpoint**: `GET /api/profile?memberNumber=1234`
- **Response**: Member profile, trips, friends, etc.

## Test Credentials

### Admin Users
- **Noah Nicol**: Member #1234, PIN: 123
- **Steve**: Member #5678, PIN: 456

### Regular Members
- **John Smith**: Member #1001, PIN: 111
- **Sarah Johnson**: Member #1002, PIN: 222
- **Mike Wilson**: Member #1003, PIN: 333

## User Interfaces

### Member Profile Access
- **URL**: `/en/profile`
- **Fields**: Member Number, 3-Digit PIN
- **Features**: View profile, trip history, friends, etc.

### Admin Panel Access
- **URL**: `/en/admin-login`
- **Fields**: Member Number, 3-Digit PIN
- **Features**: Admin dashboard, member management, data export, etc.

## Implementation Details

### Frontend Authentication
- Uses localStorage to store session information
- Automatic redirect to login if not authenticated
- Clear error messages for invalid credentials

### Backend Validation
- Database queries verify member number and PIN combination
- Separate admin validation checks `is_admin` field
- Proper error handling and response codes

### Security Considerations
- PINs are stored as plain text (for simplicity in this demo)
- In production, consider hashing PINs
- Session timeout after browser close
- No persistent server-side sessions

## Adding New Members

### Via Admin Interface
1. Navigate to `/en/admin-login`
2. Login with admin credentials
3. Go to Member Management
4. Add new member with PIN

### Via Script
```javascript
import { createMember } from './src/lib/database.js';

await createMember(
  '9999',           // member number
  'New Member',     // name
  '+1234567890',    // phone
  'new@example.com', // email
  false,            // isAdmin
  '999'             // PIN
);
```

## Troubleshooting

### Common Issues

#### "Invalid member number or PIN"
- Check that member number exists in database
- Verify PIN matches the member record
- Ensure PIN is exactly 3 digits

#### "Access denied. You are not authorized as an administrator."
- Member exists but is not marked as admin
- Check `is_admin` field in database
- Use admin credentials instead

#### "Internal server error"
- Check database connection
- Verify API endpoints are working
- Check browser console for detailed errors

### Database Queries

#### Check Member PIN
```sql
SELECT * FROM members WHERE member_number = '1234' AND pin = '123';
```

#### List All Admins
```sql
SELECT member_number, name FROM members WHERE is_admin = TRUE;
```

#### Update Member PIN
```sql
UPDATE members SET pin = '999' WHERE member_number = '1234';
```

## Future Enhancements

### Security Improvements
- Hash PINs using bcrypt or similar
- Implement PIN reset functionality
- Add rate limiting for login attempts
- Session timeout configuration

### User Experience
- Remember member number (but not PIN)
- PIN reset via email/SMS
- Account lockout after failed attempts
- Two-factor authentication option

### Admin Features
- Bulk PIN generation
- PIN reset for members
- PIN policy enforcement
- Audit logs for login attempts

## Local Development

### Running Locally
1. Start the development server
2. Access `/en/profile` for member login
3. Access `/en/admin-login` for admin login
4. Use test credentials provided above

### Database Setup
```bash
# Run migration to add PIN column
node migrate-database.js

# Add admin users
node add-admins.js

# Add test members
node add-test-members.js
```

### Testing
- Test member login with regular member credentials
- Test admin login with admin credentials
- Test invalid credentials for error handling
- Test session persistence across page refreshes 