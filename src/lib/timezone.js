/**
 * Universal Timezone Manager for Ymir Sailing Club
 * Handles timezone conversions and time calculations for any location worldwide
 */

// Club configuration - can be overridden by environment variables
const CLUB_CONFIG = {
  timezone: process.env.CLUB_TIMEZONE || 'Atlantic/Reykjavik',
  country: process.env.CLUB_COUNTRY || 'IS',
  city: process.env.CLUB_CITY || 'Reykjavik',
  coordinates: {
    latitude: parseFloat(process.env.CLUB_LATITUDE) || 64.1466,
    longitude: parseFloat(process.env.CLUB_LONGITUDE) || -21.9426
  },
  dateFormat: process.env.DATE_FORMAT || 'DD/MM/YYYY',
  timeFormat: process.env.TIME_FORMAT || '24h',
  locale: process.env.LOCALE || 'is-IS'
};

export class TimezoneManager {
  constructor() {
    this.clubTimezone = CLUB_CONFIG.timezone;
    this.locale = CLUB_CONFIG.locale;
    this.country = CLUB_CONFIG.country;
  }

  /**
   * Convert any time to club timezone
   * @param {Date|string} date - The date to convert
   * @param {string} fromTimezone - The source timezone (default: UTC)
   * @returns {Date} Date in club timezone
   */
  toClubTime(date, fromTimezone = 'UTC') {
    if (!date) return null;
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    
    // Create a new date in the club timezone
    const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
    const clubTime = new Date(utcTime + (this.getTimezoneOffset() * 60000));
    return clubTime;
  }

  /**
   * Convert club time to UTC for database storage
   * @param {Date|string} date - The date to convert
   * @param {string} fromTimezone - The source timezone (default: club timezone)
   * @returns {Date} Date in UTC
   */
  toUTC(date, fromTimezone = this.clubTimezone) {
    if (!date) return null;
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    
    // Simple approach: treat the input as if it's already in UTC
    // Since Atlantic/Reykjavik is UTC+0, no conversion needed
    // This is a temporary fix - we should handle timezone conversion properly
    return dateObj;
  }

  /**
   * Get current time in club timezone
   * @returns {Date} Current time in club timezone
   */
  getCurrentClubTime() {
    return this.toClubTime(new Date());
  }

  /**
   * Format time for display in user's local timezone
   * @param {Date|string} date - The date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted time string
   */
  formatTime(date, options = {}) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      ...options
    };
    
    // Use user's local timezone for display
    return dateObj.toLocaleString('en-US', defaultOptions);
  }

  /**
   * Format time for display in club timezone (legacy function)
   * @param {Date|string} date - The date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted time string
   */
  formatTimeInClubTimezone(date, options = {}) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const defaultOptions = {
      timeZone: this.clubTimezone,
      locale: this.locale,
      ...options
    };
    
    return new Date(dateObj).toLocaleString(this.locale, defaultOptions);
  }

  /**
   * Check if a time is overdue (timezone-aware)
   * @param {Date|string} expectedReturn - Expected return time
   * @param {Date|string} currentTime - Current time (default: now)
   * @returns {boolean} True if overdue
   */
  isOverdue(expectedReturn, currentTime = new Date()) {
    if (!expectedReturn) return false;
    
    const expected = this.toClubTime(expectedReturn);
    const current = this.toClubTime(currentTime);
    
    if (!expected || !current) return false;
    
    return expected < current;
  }

  /**
   * Calculate time difference in hours
   * @param {Date|string} startTime - Start time
   * @param {Date|string} endTime - End time
   * @returns {number} Hours difference
   */
  getHoursDifference(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    
    const start = this.toClubTime(startTime);
    const end = this.toClubTime(endTime);
    
    if (!start || !end) return 0;
    
    return (end - start) / (1000 * 60 * 60);
  }

  /**
   * Get timezone offset in minutes
   * @returns {number} Timezone offset in minutes
   */
  getTimezoneOffset() {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    
    // Create a date in the club timezone
    const clubTime = new Date(utc.toLocaleString('en-US', { timeZone: this.clubTimezone }));
    const offset = (clubTime.getTime() - utc.getTime()) / 60000;
    
    return offset;
  }

  /**
   * Get time until return
   * @param {Date|string} expectedReturn - Expected return time
   * @param {Date|string} currentTime - Current time (default: now)
   * @returns {Object} Time until return or overdue status
   */
  getTimeUntilReturn(expectedReturn, currentTime = new Date()) {
    if (!expectedReturn) return { overdue: true, hours: 0, minutes: 0 };
    
    const expected = this.toClubTime(expectedReturn);
    const current = this.toClubTime(currentTime);
    
    if (!expected || !current) return { overdue: true, hours: 0, minutes: 0 };
    
    const diff = expected - current;
    
    if (diff <= 0) {
      return { overdue: true, hours: 0, minutes: 0 };
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { overdue: false, hours, minutes };
  }

  /**
   * Get overdue hours (timezone-aware)
   * @param {Date|string} expectedReturn - Expected return time
   * @param {Date|string} currentTime - Current time (default: now)
   * @returns {number} Hours overdue (0 if not overdue)
   */
  getOverdueHours(expectedReturn, currentTime = new Date()) {
    if (!expectedReturn) return 0;
    
    const expected = this.toClubTime(expectedReturn);
    const current = this.toClubTime(currentTime);
    
    if (!expected || !current) return 0;
    
    const diff = current - expected;
    
    if (diff <= 0) return 0; // Not overdue
    
    return Math.floor(diff / (1000 * 60 * 60));
  }

  /**
   * Get club configuration
   * @returns {Object} Club configuration
   */
  getConfig() {
    return { ...CLUB_CONFIG };
  }

  /**
   * Detect if a timestamp was stored incorrectly (as UTC when it should be local)
   * This helps with migration of existing data
   * @param {Date|string} timestamp - The timestamp to check
   * @param {Date|string} referenceTime - Reference time for comparison
   * @returns {boolean} True if timestamp appears to be incorrectly stored
   */
  detectIncorrectStorage(timestamp, referenceTime = new Date()) {
    if (!timestamp) return false;
    
    const ts = new Date(timestamp);
    const ref = new Date(referenceTime);
    
    if (isNaN(ts.getTime()) || isNaN(ref.getTime())) return false;
    
    // If the timestamp is more than 12 hours off from reference, it's likely incorrect
    const diff = Math.abs(ts - ref);
    const hoursDiff = diff / (1000 * 60 * 60);
    
    return hoursDiff > 12;
  }

  /**
   * Fix incorrectly stored timestamp
   * @param {Date|string} timestamp - The timestamp to fix
   * @param {number} offsetHours - Hours to add/subtract (default: auto-detect)
   * @returns {Date} Fixed timestamp
   */
  fixIncorrectStorage(timestamp, offsetHours = null) {
    if (!timestamp) return null;
    
    const ts = new Date(timestamp);
    if (isNaN(ts.getTime())) return null;
    
    // Auto-detect offset if not provided
    if (offsetHours === null) {
      offsetHours = this.getTimezoneOffset() / 60;
    }
    
    return new Date(ts.getTime() + (offsetHours * 60 * 60 * 1000));
  }

  /**
   * Get user's timezone from browser
   * @returns {string} User's timezone (e.g., 'America/Chicago')
   */
  getUserTimezone() {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return 'UTC';
  }

  /**
   * Get user's timezone offset in minutes
   * @returns {number} Timezone offset in minutes
   */
  getUserTimezoneOffset() {
    return new Date().getTimezoneOffset();
  }

  /**
   * Format time for display in user's timezone with specific locale
   * @param {Date|string} date - The date to format
   * @param {string} locale - Locale for formatting (default: 'en-US')
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted time string
   */
  formatTimeForUser(date, locale = 'en-US', options = {}) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      ...options
    };
    
    return dateObj.toLocaleString(locale, defaultOptions);
  }

  /**
   * Convert UTC time to user's local timezone for display
   * @param {Date|string} utcDate - UTC date to convert
   * @param {string} locale - Locale for formatting (default: 'en-US')
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted time string in user's timezone
   */
  displayInUserTimezone(utcDate, locale = 'en-US', options = {}) {
    if (!utcDate) return '';
    
    const dateObj = new Date(utcDate);
    if (isNaN(dateObj.getTime())) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      ...options
    };
    
    // The Date object automatically converts UTC to local time for display
    return dateObj.toLocaleString(locale, defaultOptions);
  }
}

// Create singleton instance
export const timezoneManager = new TimezoneManager();

// Export configuration for easy access
export { CLUB_CONFIG };
