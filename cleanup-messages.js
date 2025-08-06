#!/usr/bin/env node

/**
 * Message Cleanup Script
 * 
 * This script cleans up old messages from the database to free up storage space.
 * Can be run manually or scheduled via cron job.
 * 
 * Usage:
 *   node cleanup-messages.js [daysOld]
 * 
 * Examples:
 *   node cleanup-messages.js 30    # Clean messages older than 30 days (default)
 *   node cleanup-messages.js 7     # Clean messages older than 7 days
 *   node cleanup-messages.js 90    # Clean messages older than 90 days
 */

import { cleanupOldMessages } from './src/lib/database.js';

const daysOld = parseInt(process.argv[2]) || 30;

console.log(`🧹 Starting message cleanup for messages older than ${daysOld} days...`);

try {
  const deletedCount = await cleanupOldMessages(daysOld);
  
  if (deletedCount > 0) {
    console.log(`✅ Successfully cleaned up ${deletedCount} messages older than ${daysOld} days`);
  } else {
    console.log(`ℹ️  No messages found older than ${daysOld} days`);
  }
  
  process.exit(0);
} catch (error) {
  console.error(`❌ Error during message cleanup:`, error);
  process.exit(1);
} 