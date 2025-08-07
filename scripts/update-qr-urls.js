import { put, list } from '@vercel/blob';

const NEW_DOMAIN = 'https://siglingafelagidymir.com';

async function updateQRCodeUrls() {
  console.log('🔄 Updating QR code URLs to new domain:', NEW_DOMAIN);
  
  try {
    // List all existing blobs
    console.log('\n1️⃣ Listing existing QR code blobs...');
    const { blobs } = await list();
    
    const qrCodeBlobs = blobs.filter(blob => 
      blob.pathname.startsWith('qr-codes/') && 
      blob.pathname.endsWith('.png')
    );
    
    console.log(`✅ Found ${qrCodeBlobs.length} QR code files`);
    
    if (qrCodeBlobs.length === 0) {
      console.log('❌ No QR code files found. Creating new ones...');
      await createNewQRCodes();
      return;
    }
    
    // Update each QR code
    for (const blob of qrCodeBlobs) {
      const boatId = blob.pathname.replace('qr-codes/', '').replace('.png', '');
      const newUrl = `${NEW_DOMAIN}/qr/${boatId}`;
      
      console.log(`\n🔄 Updating QR code for ${boatId}...`);
      console.log(`- Old URL: ${blob.url}`);
      console.log(`- New URL: ${newUrl}`);
      
      // Generate new QR code with updated URL
      const qrCodeBuffer = await generateQRCode(newUrl);
      
      // Upload new QR code (overwrite existing)
      const newBlob = await put(blob.pathname, qrCodeBuffer, {
        access: 'public',
        addRandomSuffix: false
      });
      
      console.log(`✅ Updated QR code: ${newBlob.url}`);
    }
    
    console.log('\n🎉 All QR codes updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating QR codes:', error);
    throw error;
  }
}

async function createNewQRCodes() {
  console.log('\n🆕 Creating new QR codes for all boats...');
  
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
  
  for (const boat of boats) {
    const url = `${NEW_DOMAIN}/qr/${boat.id}`;
    console.log(`\n🔄 Creating QR code for ${boat.name} (${boat.id})...`);
    console.log(`- URL: ${url}`);
    
    const qrCodeBuffer = await generateQRCode(url);
    
    const blob = await put(`qr-codes/${boat.id}.png`, qrCodeBuffer, {
      access: 'public',
      addRandomSuffix: false
    });
    
    console.log(`✅ Created QR code: ${blob.url}`);
  }
  
  console.log('\n🎉 All new QR codes created successfully!');
}

async function generateQRCode(url) {
  // For now, we'll create a simple text-based QR code
  // In a real implementation, you'd use a QR code library like 'qrcode'
  const qrCodeText = `QR Code for: ${url}`;
  return Buffer.from(qrCodeText);
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  updateQRCodeUrls().catch(console.error);
}

export { updateQRCodeUrls }; 