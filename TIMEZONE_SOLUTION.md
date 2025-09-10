# 🌍 Universal Timezone Solution for Ymir Sailing Club

## Overview
This document outlines a comprehensive timezone solution to make the sailing club system work worldwide for any location.

## Current Issues
- Hardcoded timezone offset (+5 hours) only works for CDT
- No timezone configuration system
- Mixed UTC/local time handling
- Not location-agnostic

## Proposed Solution

### 1. Database Schema Changes

#### Add Timezone Configuration Table
```sql
CREATE TABLE IF NOT EXISTS club_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default timezone settings
INSERT INTO club_settings (setting_key, setting_value) VALUES 
('timezone', 'America/Chicago'),
('country', 'US'),
('date_format', 'MM/DD/YYYY'),
('time_format', '12h');
```

#### Update Check-ins Table
```sql
-- Add timezone information to check-ins
ALTER TABLE check_ins ADD COLUMN timezone VARCHAR(50) DEFAULT 'UTC';
ALTER TABLE check_ins ADD COLUMN departure_timezone VARCHAR(50);
ALTER TABLE check_ins ADD COLUMN expected_return_timezone VARCHAR(50);
ALTER TABLE check_ins ADD COLUMN actual_return_timezone VARCHAR(50);
```

### 2. Configuration System

#### Environment Variables
```bash
# Club Location Configuration
CLUB_TIMEZONE=America/Chicago
CLUB_COUNTRY=US
CLUB_CITY=Madison
CLUB_LATITUDE=43.0731
CLUB_LONGITUDE=-89.4012

# Date/Time Formatting
DATE_FORMAT=MM/DD/YYYY
TIME_FORMAT=12h
LOCALE=en-US
```

#### Configuration File
```javascript
// src/lib/config.js
export const CLUB_CONFIG = {
  timezone: process.env.CLUB_TIMEZONE || 'UTC',
  country: process.env.CLUB_COUNTRY || 'US',
  city: process.env.CLUB_CITY || 'Unknown',
  coordinates: {
    latitude: parseFloat(process.env.CLUB_LATITUDE) || 0,
    longitude: parseFloat(process.env.CLUB_LONGITUDE) || 0
  },
  dateFormat: process.env.DATE_FORMAT || 'MM/DD/YYYY',
  timeFormat: process.env.TIME_FORMAT || '12h',
  locale: process.env.LOCALE || 'en-US'
};
```

### 3. Timezone Utility Functions

#### Core Timezone Handler
```javascript
// src/lib/timezone.js
import { CLUB_CONFIG } from './config.js';

export class TimezoneManager {
  constructor() {
    this.clubTimezone = CLUB_CONFIG.timezone;
    this.locale = CLUB_CONFIG.locale;
  }

  // Convert any time to club timezone
  toClubTime(date, fromTimezone = 'UTC') {
    return new Date(date.toLocaleString('en-US', { timeZone: this.clubTimezone }));
  }

  // Convert club time to UTC for database storage
  toUTC(date, fromTimezone = this.clubTimezone) {
    return new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  }

  // Get current time in club timezone
  getCurrentClubTime() {
    return new Date().toLocaleString('en-US', { timeZone: this.clubTimezone });
  }

  // Format time for display
  formatTime(date, options = {}) {
    const defaultOptions = {
      timeZone: this.clubTimezone,
      locale: this.locale,
      ...options
    };
    return new Date(date).toLocaleString(this.locale, defaultOptions);
  }

  // Check if a time is overdue (timezone-aware)
  isOverdue(expectedReturn, currentTime = new Date()) {
    const expected = this.toClubTime(expectedReturn);
    const current = this.toClubTime(currentTime);
    return expected < current;
  }

  // Calculate time difference in hours
  getHoursDifference(startTime, endTime) {
    const start = this.toClubTime(startTime);
    const end = this.toClubTime(endTime);
    return (end - start) / (1000 * 60 * 60);
  }
}

export const timezoneManager = new TimezoneManager();
```

### 4. Updated Database Functions

#### Fixed getOverdueBoats
```javascript
// src/lib/database-postgres.js
import { timezoneManager } from './timezone.js';

export async function getOverdueBoats() {
  const client = await getClient();
  try {
    // Get all active check-ins
    const result = await client.query(
      `SELECT c.*, b.name as boat_name 
       FROM check_ins c 
       JOIN boats b ON c.boat_id = b.id 
       WHERE c.actual_return IS NULL`
    );
    
    // Filter overdue boats using timezone-aware comparison
    const overdueBoats = result.rows.filter(boat => 
      timezoneManager.isOverdue(boat.expected_return)
    );
    
    return overdueBoats;
  } finally {
    client.release();
  }
}
```

### 5. Frontend Timezone Handling

#### Universal Overdue Check
```javascript
// src/lib/frontend-timezone.js
import { timezoneManager } from './timezone.js';

export function isOverdue(expectedReturn) {
  return timezoneManager.isOverdue(expectedReturn);
}

export function formatTimeForDisplay(date, options = {}) {
  return timezoneManager.formatTime(date, options);
}

export function getTimeUntilReturn(expectedReturn) {
  const now = new Date();
  const expected = new Date(expectedReturn);
  const diff = expected - now;
  
  if (diff <= 0) return { overdue: true, hours: 0, minutes: 0 };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { overdue: false, hours, minutes };
}
```

### 6. Migration Strategy

#### Phase 1: Add Timezone Support
1. Add timezone configuration table
2. Create timezone utility functions
3. Update database functions to use timezone manager

#### Phase 2: Migrate Existing Data
1. Detect timezone of existing data
2. Convert all timestamps to proper UTC storage
3. Add timezone metadata to existing records

#### Phase 3: Update Frontend
1. Replace hardcoded timezone logic
2. Add timezone-aware date/time formatting
3. Update all overdue calculations

### 7. Configuration Examples

#### For Iceland (Reykjavik)
```bash
CLUB_TIMEZONE=Atlantic/Reykjavik
CLUB_COUNTRY=IS
CLUB_CITY=Reykjavik
CLUB_LATITUDE=64.1466
CLUB_LONGITUDE=-21.9426
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=24h
LOCALE=is-IS
```

#### For Australia (Sydney)
```bash
CLUB_TIMEZONE=Australia/Sydney
CLUB_COUNTRY=AU
CLUB_CITY=Sydney
CLUB_LATITUDE=-33.8688
CLUB_LONGITUDE=151.2093
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=12h
LOCALE=en-AU
```

#### For UK (London)
```bash
CLUB_TIMEZONE=Europe/London
CLUB_COUNTRY=GB
CLUB_CITY=London
CLUB_LATITUDE=51.5074
CLUB_LONGITUDE=-0.1278
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=24h
LOCALE=en-GB
```

## Benefits

1. **Universal Compatibility**: Works anywhere in the world
2. **Automatic DST Handling**: Handles daylight saving time changes
3. **Consistent Storage**: All times stored in UTC in database
4. **Local Display**: Times displayed in club's local timezone
5. **Easy Configuration**: Simple environment variable setup
6. **Future-Proof**: Easy to add new locations

## Implementation Priority

1. **High Priority**: Fix current timezone bug with proper solution
2. **Medium Priority**: Add timezone configuration system
3. **Low Priority**: Add location-specific features (weather, etc.)

## Testing Strategy

1. Test with different timezone configurations
2. Test DST transitions
3. Test with users in different timezones
4. Test overdue calculations across timezones
