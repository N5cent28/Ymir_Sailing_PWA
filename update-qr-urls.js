#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Configuration
const OLD_DOMAIN = 'https://yourdomain.com';
const NEW_DOMAIN = process.argv[2] || 'https://siglingafelagidymir.com';

const FILES_TO_UPDATE = [
  'src/pages/en/qr-codes.astro',
  'src/pages/is/qr-codes.astro',
  'generate-qr-codes.md',
  'ADMIN_GUIDE.md',
  'DEPLOYMENT_GUIDE.md'
];

console.log(`🔄 Updating QR code URLs from ${OLD_DOMAIN} to ${NEW_DOMAIN}`);
console.log('');

let totalChanges = 0;

FILES_TO_UPDATE.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`📝 Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace the domain
    content = content.replace(new RegExp(OLD_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_DOMAIN);
    
    // Count changes
    const changes = (content.match(new RegExp(NEW_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const oldMatches = (originalContent.match(new RegExp(OLD_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${changes} URLs in ${filePath}`);
      totalChanges += changes;
    } else if (oldMatches > 0) {
      console.log(`⚠️  Found ${oldMatches} old URLs but no changes made (already updated?)`);
    } else {
      console.log(`ℹ️  No URLs found in ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('');
console.log(`🎉 Total URLs updated: ${totalChanges}`);

if (totalChanges > 0) {
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Review the changes in the updated files');
  console.log('2. Commit the changes to your repository');
  console.log('3. Deploy to your hosting platform');
  console.log('4. Generate new QR codes using the updated URLs');
  console.log('');
  console.log('🔗 QR Code URLs to generate:');
  console.log('');
  
  const boats = [
    { id: 'boat-1', name: 'Quest 1' },
    { id: 'boat-2', name: 'Quest 2' },
    { id: 'boat-3', name: 'Zest 1' },
    { id: 'boat-4', name: 'Zest 2' },
    { id: 'boat-5', name: 'Zest 3' },
    { id: 'boat-6', name: 'Zest 4' },
    { id: 'boat-7', name: 'Zest 5' },
    { id: 'boat-8', name: 'Zest 6' },
    { id: 'boat-9', name: 'Topaz 1' },
    { id: 'boat-10', name: 'Topaz 2' },
    { id: 'boat-11', name: 'Laser 1' },
    { id: 'boat-12', name: 'Laser 2' },
    { id: 'boat-13', name: 'Laser 3' },
    { id: 'boat-14', name: 'Laser 4' },
    { id: 'kayak', name: 'Kayak' },
    { id: 'paddle-board', name: 'Paddle Board' }
  ];
  
  boats.forEach(boat => {
    console.log(`${NEW_DOMAIN}/qr/${boat.id}    (${boat.name})`);
  });
} else {
  console.log('ℹ️  No changes were made. Make sure you specified the correct new domain.');
  console.log('');
  console.log('Usage: node update-qr-urls.js <new-domain>');
  console.log('Example: node update-qr-urls.js https://siglingafelagidymir.com');
} 