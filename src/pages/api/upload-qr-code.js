import { getQRCodes, getQRCodeByBoatId, createQRCode, updateQRCode } from '../../lib/database-postgres.js';

export async function POST({ request }) {
  try {
    console.log('📤 QR upload request received');
    console.log('📤 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      APP_URL: process.env.APP_URL,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      cwd: process.cwd()
    });
    
    const formData = await request.formData();
    const qrCodeFile = formData.get('qrCode');
    const boatId = formData.get('boatId');
    const boatName = formData.get('boatName');

    console.log('📤 Form data:', { 
      hasFile: !!qrCodeFile, 
      boatId, 
      boatName,
      fileType: qrCodeFile?.type,
      fileName: qrCodeFile?.name,
      fileSize: qrCodeFile?.size
    });

    if (!qrCodeFile || !boatId || !boatName) {
      console.log('❌ Missing required fields');
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    if (!qrCodeFile.type.startsWith('image/')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'File must be an image'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate filename for reference
    const fileExtension = (qrCodeFile.name && qrCodeFile.name.includes('.')) ? qrCodeFile.name.split('.').pop() : 'png';
    const filename = `${boatId}-${Date.now()}.${fileExtension}`;
    
    // Convert file to base64 for storage in database
    console.log('📤 Converting file to base64...');
    const arrayBuffer = await qrCodeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${qrCodeFile.type};base64,${base64}`;
    
    console.log('📤 File converted to base64, size:', base64.length);
    
    // Store the base64 data URL directly in the database
    const qrCodeUrl = dataUrl;
    console.log('📤 Using data URL for storage:', qrCodeUrl.substring(0, 100) + '...');
    
    // Check if QR code already exists for this boat
    console.log('📤 Checking for existing QR code for boat:', boatId);
    let existingQR;
    try {
      existingQR = await getQRCodeByBoatId(boatId);
      console.log('📤 Existing QR check result:', existingQR ? 'Found' : 'Not found');
    } catch (dbError) {
      console.error('❌ Database error checking existing QR:', dbError);
      throw new Error(`Database check failed: ${dbError.message}`);
    }
    
    if (existingQR) {
      // Update existing record
      console.log('📤 Updating existing QR code record');
      try {
        await updateQRCode(boatId, qrCodeUrl);
        console.log('📤 QR code record updated successfully');
      } catch (updateError) {
        console.error('❌ Database update error:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }
    } else {
      // Create new record
      console.log('📤 Creating new QR code record');
      try {
        await createQRCode(boatId, qrCodeUrl);
        console.log('📤 QR code record created successfully');
      } catch (createError) {
        console.error('❌ Database create error:', createError);
        throw new Error(`Database create failed: ${createError.message}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      filename: filename,
      url: qrCodeUrl,
      message: `QR code uploaded successfully for ${boatName}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ CRITICAL ERROR in QR upload:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error cause:', error.cause);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: error.message,
      name: error.name,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 