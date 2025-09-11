# Mobile Push Notifications Guide - Ymir Sailing Club

## 📱 How Mobile Notifications Work

### **Phone Wake-Up & Sound Behavior**

Push notifications are designed to work even when the PWA is not active or the phone is locked. Here's how they work:

#### **✅ When PWA is Closed/Locked:**
- **Background Processing**: Browser service worker handles notifications
- **System Integration**: Phone OS receives notification from browser
- **Screen Wake**: Notifications can wake the phone screen (user setting dependent)
- **Lock Screen Display**: Notifications appear on lock screen
- **Sound & Vibration**: Plays notification sound and vibrates

#### **✅ When PWA is Active:**
- **In-App Notifications**: Shows notification within the app
- **Background Notifications**: Still works when app is in background
- **Sound & Vibration**: Plays notification sound and vibrates

### **🔊 Sound & Vibration Features**

#### **Enhanced Notification Configuration:**
```javascript
{
  vibrate: [200, 100, 200, 100, 200], // More noticeable vibration pattern
  requireInteraction: true,            // Keeps notification visible until user interacts
  silent: false,                       // Ensures sound plays
  tag: 'notification-type',            // Prevents duplicate notifications
  renotify: true,                      // Allows re-notification with same tag
  timestamp: Date.now()                // Notification timestamp
}
```

#### **Mobile-Specific Features:**
- **Vibration Patterns**: Custom vibration sequences for different notification types
- **Sound Override**: Notifications can override "Do Not Disturb" (high priority)
- **Persistent Display**: Notifications stay visible until user interacts
- **Action Buttons**: "View Details" and "Dismiss" buttons on notifications

### **📲 User Experience**

#### **What Users Will Experience:**

1. **Phone Locked/App Closed:**
   - Phone screen wakes up
   - Notification appears on lock screen
   - Notification sound plays
   - Phone vibrates
   - User can tap notification to open app

2. **App in Background:**
   - Notification appears in notification panel
   - Sound and vibration play
   - User can tap to bring app to foreground

3. **App Active:**
   - Notification appears within the app
   - Sound and vibration play
   - User can interact with notification

### **⚙️ User Settings That Affect Notifications**

#### **Browser Settings:**
- **Notification Permission**: Must be granted for notifications to work
- **Sound Settings**: Browser sound settings affect notification sounds
- **Vibration Settings**: Device vibration settings affect notification vibration

#### **Phone Settings:**
- **Do Not Disturb**: Can block notifications (unless high priority)
- **Screen Wake**: Controls whether notifications wake the screen
- **Lock Screen Notifications**: Controls notification display on lock screen
- **App Notifications**: Controls notification behavior for the browser/PWA

### **🔧 Technical Implementation**

#### **Service Worker Configuration:**
```javascript
// Enhanced mobile wake-up and sound configuration
const options = {
  vibrate: [200, 100, 200, 100, 200], // More noticeable vibration
  requireInteraction: true,            // Keeps notification visible
  silent: false,                       // Ensures sound plays
  tag: 'notification-type',            // Prevents duplicates
  renotify: true,                      // Allows re-notification
  timestamp: Date.now()                // Notification timestamp
};
```

#### **Push Notification Payload:**
```javascript
{
  title: "Notification Title",
  body: "Notification message",
  icon: "/icon-192.svg",
  badge: "/icon-192.svg",
  data: {
    type: 'boat_reminder',
    memberNumber: '1234',
    action: 'view_boat'
  },
  actions: [
    { action: "view", title: "View Details" },
    { action: "dismiss", title: "Dismiss" }
  ]
}
```

### **🧪 Testing Mobile Notifications**

#### **Test Scenarios:**

1. **Basic Test:**
   - Visit notification test page
   - Click "Send Test Notification"
   - Verify sound, vibration, and display

2. **Background Test:**
   - Open PWA
   - Switch to another app
   - Send test notification
   - Verify notification appears

3. **Locked Phone Test:**
   - Lock your phone
   - Send test notification
   - Verify phone wakes and shows notification

4. **Boat Reminder Test:**
   - Check out a boat with return time 5 minutes in future
   - Wait for automated reminder
   - Verify notification behavior

### **📋 Troubleshooting**

#### **If Notifications Don't Wake Phone:**
1. Check browser notification permission
2. Check phone's "Do Not Disturb" settings
3. Check browser's notification settings
4. Ensure PWA is installed (not just bookmarked)

#### **If No Sound Plays:**
1. Check phone's notification sound settings
2. Check browser's sound settings
3. Ensure phone isn't in silent mode
4. Check notification priority settings

#### **If Notifications Don't Appear:**
1. Check notification permission is granted
2. Check browser's notification settings
3. Check phone's app notification settings
4. Try refreshing the PWA

### **🚀 Best Practices**

#### **For Users:**
- **Install PWA**: Add to home screen for best notification experience
- **Grant Permissions**: Allow notifications when prompted
- **Check Settings**: Ensure notifications are enabled in browser and phone settings
- **Test Regularly**: Use the test notification feature to verify everything works

#### **For Developers:**
- **Use High Priority**: Set appropriate priority levels for different notification types
- **Include Actions**: Always provide action buttons for user interaction
- **Handle Errors**: Gracefully handle notification permission denials
- **Test Thoroughly**: Test on different devices and browsers

### **📱 Device Compatibility**

#### **Fully Supported:**
- **Android Chrome**: Full wake-up and sound support
- **Android Firefox**: Full wake-up and sound support
- **iOS Safari**: Full wake-up and sound support (iOS 16.4+)

#### **Partially Supported:**
- **Older iOS**: Limited background notification support
- **Some Android browsers**: May have limited wake-up support

#### **Not Supported:**
- **Desktop browsers**: Notifications work but don't wake computer
- **Very old browsers**: May not support push notifications at all

## 🎯 Summary

The Ymir Sailing Club PWA is configured to provide the best possible mobile notification experience:

- **✅ Wakes phones** when notifications arrive
- **✅ Plays notification sounds** and vibrates
- **✅ Works when app is closed** or phone is locked
- **✅ Provides persistent notifications** until user interacts
- **✅ Includes action buttons** for easy interaction
- **✅ Prevents duplicate notifications** with smart tagging

Users will receive timely, audible, and visible notifications for boat reminders, overdue alerts, and other important club communications, ensuring they never miss critical information about their sailing activities.
