# Message Cleanup System

The Ymir Sailing Club PWA includes an automatic message cleanup system to manage storage space and maintain performance.

## Overview

Messages are automatically cleaned up after a configurable period (default: 30 days) to:
- Free up database storage space
- Improve query performance
- Maintain privacy by removing old conversations
- Comply with data retention policies

## Features

### 1. Manual Cleanup via Admin Dashboard
- Navigate to Admin Dashboard → Maintenance Tools
- Set the number of days (1-365)
- Click "🧹 Clean Up Messages"
- Confirmation dialog prevents accidental deletion

### 2. API Endpoint
- **POST** `/api/cleanup-messages`
- Requires admin authentication
- Returns count of deleted messages

### 3. Command Line Script
```bash
# Clean messages older than 30 days (default)
npm run cleanup-messages

# Clean messages older than 7 days
node cleanup-messages.js 7

# Clean messages older than 90 days
node cleanup-messages.js 90
```

## Scheduled Cleanup

### Using Cron (Linux/macOS)
Add to crontab to run daily at 2 AM:
```bash
0 2 * * * cd /path/to/ymir-sailing-club && npm run cleanup-messages
```

### Using Windows Task Scheduler
1. Create a new scheduled task
2. Set trigger to run daily at 2 AM
3. Action: Start a program
4. Program: `node`
5. Arguments: `cleanup-messages.js`
6. Start in: `C:\path\to\ymir-sailing-club`

## Configuration

### Default Settings
- **Retention Period**: 30 days
- **Admin Required**: Yes
- **Logging**: Console output with emoji indicators

### Customization
- Modify `daysOld` parameter in cleanup functions
- Adjust retention period based on club needs
- Add email notifications for cleanup results

## Safety Features

1. **Admin Authentication**: Only admins can trigger cleanup
2. **Confirmation Dialog**: Prevents accidental deletion
3. **Logging**: All cleanup operations are logged
4. **Error Handling**: Graceful failure with error messages
5. **Dry Run Option**: Can be added for testing

## Database Impact

### Before Cleanup
- Messages accumulate indefinitely
- Database size grows over time
- Query performance may degrade

### After Cleanup
- Only recent messages retained
- Reduced database size
- Improved query performance
- Better user experience

## Monitoring

### Check Cleanup Results
- Admin dashboard shows cleanup status
- Console logs provide detailed information
- API returns deletion count

### Database Size Monitoring
```sql
-- Check total message count
SELECT COUNT(*) FROM messages;

-- Check messages by age
SELECT 
  COUNT(*) as total_messages,
  COUNT(CASE WHEN created_at < datetime('now', '-30 days') THEN 1 END) as old_messages
FROM messages;
```

## Best Practices

1. **Start Conservative**: Begin with 30-day retention
2. **Monitor Usage**: Adjust retention based on club activity
3. **Backup First**: Ensure database backups before cleanup
4. **Test Environment**: Test cleanup on development data first
5. **Communicate**: Inform members about retention policy

## Troubleshooting

### Common Issues

**Error: "Admin access required"**
- Ensure user has admin privileges
- Check member authentication

**Error: "Failed to cleanup messages"**
- Check database connection
- Verify file permissions
- Review error logs

**No messages deleted**
- Check if messages exist older than specified days
- Verify date format in database

### Log Analysis
```bash
# View cleanup logs
grep "🧹" /var/log/ymir-sailing.log

# Check for errors
grep "❌" /var/log/ymir-sailing.log
```

## Future Enhancements

1. **Selective Cleanup**: Clean by conversation or user
2. **Archive Option**: Archive instead of delete
3. **Email Notifications**: Alert admins of cleanup results
4. **Analytics**: Track message volume and cleanup efficiency
5. **Webhook Integration**: Notify external systems of cleanup events 