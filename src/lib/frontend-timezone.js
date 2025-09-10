/**
 * Frontend timezone utilities for client-side timezone handling
 * This provides timezone-aware functions that can be used in Astro components
 */

/**
 * Check if a time is overdue (client-side)
 * @param {Date|string} expectedReturn - Expected return time
 * @param {Date|string} currentTime - Current time (default: now)
 * @returns {boolean} True if overdue
 */
export function isOverdue(expectedReturn, currentTime = new Date()) {
  if (!expectedReturn) return false;
  
  const expected = new Date(expectedReturn);
  const current = new Date(currentTime);
  
  if (isNaN(expected.getTime()) || isNaN(current.getTime())) return false;
  
  // For now, use simple comparison - this will be enhanced with proper timezone handling
  // TODO: Implement proper timezone detection and conversion
  return expected < current;
}

/**
 * Format time for display
 * @param {Date|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export function formatTimeForDisplay(date, options = {}) {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options
  };
  
  return dateObj.toLocaleString('en-US', defaultOptions);
}

/**
 * Get time until return
 * @param {Date|string} expectedReturn - Expected return time
 * @param {Date|string} currentTime - Current time (default: now)
 * @returns {Object} Time until return or overdue status
 */
export function getTimeUntilReturn(expectedReturn, currentTime = new Date()) {
  if (!expectedReturn) return { overdue: true, hours: 0, minutes: 0 };
  
  const expected = new Date(expectedReturn);
  const current = new Date(currentTime);
  
  if (isNaN(expected.getTime()) || isNaN(current.getTime())) {
    return { overdue: true, hours: 0, minutes: 0 };
  }
  
  const diff = expected - current;
  
  if (diff <= 0) {
    return { overdue: true, hours: 0, minutes: 0 };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { overdue: false, hours, minutes };
}

/**
 * Calculate hours difference between two times
 * @param {Date|string} startTime - Start time
 * @param {Date|string} endTime - End time
 * @returns {number} Hours difference
 */
export function getHoursDifference(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  return (end - start) / (1000 * 60 * 60);
}

/**
 * Fix incorrectly stored timestamp (for migration)
 * @param {Date|string} timestamp - The timestamp to fix
 * @param {number} offsetHours - Hours to add/subtract
 * @returns {Date} Fixed timestamp
 */
export function fixIncorrectStorage(timestamp, offsetHours = 5) {
  if (!timestamp) return null;
  
  const ts = new Date(timestamp);
  if (isNaN(ts.getTime())) return null;
  
  return new Date(ts.getTime() + (offsetHours * 60 * 60 * 1000));
}
