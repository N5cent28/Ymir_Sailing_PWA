# Ymir Sailing Club PWA - Feature Summary

## Overview
The Ymir Sailing Club Progressive Web App (PWA) is a bilingual (English/Icelandic) boat management system that allows sailors to check boats in and out using QR codes, with real-time tracking and notifications.

## Core Boat Check-In/Out System

### QR Code System
- **Static QR Codes**: Each boat has a unique, permanent QR code
- **Boat Fleet**: 5 boats entered for now
  - Quest 1, Quest 2
  - Zest 1, Zest 2, Zest 3
- **QR Code URLs**: `https://yourdomain.com/qr/boat-1` through `boat-5`
- **Print & Attach**: QR codes can be printed and physically attached to boats

### Check-Out Process (Boat Departure)
1. **Sailor scans QR code** with phone camera
2. **Check-out form appears** with boat status and information
3. **Required fields**:
   - Sailor name
   - Phone number
   - Expected return time
4. **Optional fields**:
   - Member number (auto-fills name/phone if registered)
5. **Validation**:
   - Checks if boat is available/maintenance/out of service
   - Prevents check-out if boat is unavailable
6. **Database recording**: Creates check-in record with departure time

### Check-In Process (Boat Return)
1. **Sailor scans same QR code** or visits admin page
2. **Easy check-in button appears** if there's an active check-in for the boat
3. **Sailor clicks "Check In Now"** button (no need to scan QR code again)
4. **Alternative: Remote check-in** - Sailors can visit "My Boat" page and enter member number
5. **System records** actual return time
6. **Boat status updated** to available
7. **Push notification sent** confirming successful return

### Remote Check-In Feature
- **"My Boat" page**: Dedicated page for finding active boats by member number
- **No QR code needed**: Sailors can check in from anywhere using member number
- **Bilingual support**: Available in English and Icelandic
- **Navigation access**: Easy access via main navigation menu
- **Perfect for forgetful sailors**: Ideal when sailors forget to check in at the boathouse

### Time Extension System
- **10-minute warning**: System detects when boats are approaching return time
- **Extension options**: Sailors can extend time by:
  - 15 minutes
  - 30 minutes
  - 1 hour
- **API endpoint**: `/api/extend-time` handles time updates
- **Database updates**: Expected return time modified in real-time

### Overdue Detection
- **Automatic monitoring**: System checks for overdue boats
- **Hourly notifications**: Sailors receive push notifications every hour when overdue
- **Admin alerts**: After 2 hours overdue, admin receives high-priority alerts
- **Notification system**: All alerts sent via push notifications

## Member Management System

### Member Profiles
- **Member numbers**: Unique identifiers for each member
- **Stored information**:
  - Name
  - Phone number
  - Email address
  - Registration date
- **Auto-fill feature**: Member number lookup fills form fields
- **Reduced data entry**: Members don't need to re-enter information

### Member Lookup API
- **Endpoint**: `/api/member-lookup`
- **Input**: Member number
- **Output**: Member details (name, phone, email)
- **Error handling**: Returns error if member not found

## Notification System

### Push Notification Infrastructure
- **Service worker**: Handles push notifications
- **API endpoint**: `/api/push-notification` ready for integration
- **Firebase ready**: Code prepared for Firebase Cloud Messaging
- **Notification actions**: "View Details" and "Close" buttons
- **Real-time delivery**: Instant notifications to PWA users

### Notification Schedule
- **10 minutes before return**: Extension reminder with options
- **1 hour overdue**: First overdue alert to sailor
- **2 hours overdue**: Admin alert + hourly sailor alert
- **Every hour after**: Continued hourly alerts to sailor
- **Immediate**: Check-in/out confirmations

## Admin Dashboard

### Real-Time Monitoring
- **Boat status overview**: All boats with current status
- **Active check-ins**: Currently checked-out boats
- **Overdue alerts**: Highlighted overdue boats
- **Recent activity**: Latest notifications and actions

### Boat Management
- **Status updates**: Available/Maintenance/Out of Service
- **Notes system**: Add maintenance notes or status explanations
- **API endpoints**: `/api/update-boat-status` for status changes

### Data Export
- **Check-in history**: All boat usage records
- **Member data**: Registered member information
- **Notification logs**: System activity tracking

## Website Features

### Bilingual Support
- **English and Icelandic**: Complete translation of all pages
- **Navigation**: Language toggle in main navigation
- **Content**: All pages, forms, and notifications in both languages

### Contact Information
- **Official business details**: Organization ID, account number, address
- **Interactive contact icons**: Clickable address (Google Maps), phone (dial), email (copy)
- **Social media integration**: Instagram and Facebook links in navigation
- **Google Maps integration**: Direct links to sailing club location

### Pages Available
- **Home pages**: Bilingual landing pages with contact information
- **Courses**: Sailing course information
- **Membership**: Club membership details and benefits
- **Contact**: Contact forms and business information
- **Admin**: Boat management dashboard
- **QR Codes**: QR code management page
- **My Boat**: Remote check-in functionality

## PWA Features

### Installation
- **Add to Home Screen**: Works on iOS and Android
- **Standalone mode**: App-like experience without browser UI
- **Custom icons**: Green Ymir branding
- **Offline support**: Basic functionality works without internet

### Offline Capabilities
- **Service worker**: Caches essential pages
- **Basic functionality**: Check-in forms work offline
- **Data sync**: Syncs when connection restored

### Cross-Platform
- **Mobile optimized**: Responsive design for phones
- **Desktop compatible**: Works on computers
- **Bilingual**: English and Icelandic support

## Database Schema

### Tables
1. **boats**: Boat information and status
2. **check_ins**: All check-in/out records
3. **members**: Member profiles and contact info
4. **notifications**: System notification logs

### Key Relationships
- Check-ins linked to boats and members
- Notifications linked to boats
- Member numbers link to profiles

## API Endpoints

### Check-In/Out
- `POST /api/check-in`: Create new check-out
- `POST /api/check-out`: Complete check-in (return)
- `POST /api/extend-time`: Extend return time

### Management
- `POST /api/update-boat-status`: Update boat status
- `GET /api/check-overdue`: Check for overdue boats
- `GET /api/member-lookup`: Look up member by number
- `GET /api/my-active-boat`: Find active boat by member number

### Notifications
- `POST /api/push-notification`: Send push notifications

## Technical Stack

### Frontend
- **Astro**: Static site generation
- **React**: Interactive components
- **Tailwind CSS**: Styling and responsive design
- **PWA**: Service worker and manifest

### Backend
- **Node.js**: Server runtime
- **SQLite**: Database
- **API Routes**: Astro API endpoints

### Deployment Ready
- **Static hosting**: Can deploy to Vercel, Netlify, etc.
- **Database**: SQLite file included
- **Environment variables**: Ready for production config

## Testing Needed:
-  Check-in/out forms function
-  Admin dashboard
-  Database operations 

### Local Testing Complete
- ✅ QR code pages working
- ✅ PWA installation working
- ✅ Bilingual navigation functional
- ✅ Contact information integrated
- ✅ Social media links working

### Mobile Testing Needed
- 📱 PWA installation on phones
- 📱 QR code scanning
- 📱 Offline functionality
- 📱 Push notifications

## Deployment Requirements

### Production Setup
- **Domain**: Custom domain for QR codes
- **SSL certificate**: Required for PWA features
- **Database**: SQLite or migrate to PostgreSQL
- **Environment variables**: API keys for notifications

### Recommended Hosting
- **Vercel**: Easy deployment with Astro
- **Netlify**: Alternative static hosting
- **Railway**: Full-stack hosting with database

---

*This document summarizes the current state of the Ymir Sailing Club PWA as of July 20th, 2025. The system is functional for local testing and ready for deployment with additional notification service integration.* 