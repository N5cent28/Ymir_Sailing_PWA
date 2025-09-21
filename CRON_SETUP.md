# Cron Job Setup for Ymir Sailing Club Notifications

## Problem
Netlify doesn't support built-in cron jobs on free plans. We need an external solution to trigger timed notifications.

## Solutions

### Option 1: External Cron Service (Recommended)
Use a free external cron service to call our notification endpoint:

1. **Cron-job.org** (Free)
   - Go to https://cron-job.org
   - Create account
   - Add new cron job:
     - URL: `https://siglingafelagidymir.com/api/cron-notifications`
     - Schedule: `*/5 * * * *` (every 5 minutes)
     - Method: GET

2. **EasyCron** (Free tier available)
   - Go to https://www.easycron.com
   - Create account
   - Add new cron job with same settings

3. **UptimeRobot** (Free)
   - Go to https://uptimerobot.com
   - Create account
   - Add new monitor:
     - URL: `https://siglingafelagidymir.com/api/cron-notifications`
     - Interval: 5 minutes

### Option 2: Manual Testing (Current)
Use the "Test Cron Job" button on the admin debugging page for immediate testing.

### Option 3: Upgrade Netlify Plan
Upgrade to Netlify Pro ($19/month) to get access to scheduled functions.

## Current Status
- ✅ Notification system is working
- ✅ Manual testing available
- ⏳ External cron service needed for automation

## Testing
1. Go to admin debugging page
2. Click "🕐 Test Cron Job" button
3. Check debug log for results
4. Set up external cron service for automation
