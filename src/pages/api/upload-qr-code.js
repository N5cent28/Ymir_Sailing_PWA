import { getQRCodes, getQRCodeByBoatId, createQRCode, updateQRCode } from '../../lib/database-postgres.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

    // Generate unique filename
    const fileExtension = (qrCodeFile.name && qrCodeFile.name.includes('.')) ? qrCodeFile.name.split('.').pop() : 'png';
    const filename = `${boatId}-${Date.now()}.${fileExtension}`;
    const qrCodesDir = join(process.cwd(), 'public', 'qr-codes');
    const filePath = join(qrCodesDir, filename);

    console.log('📤 File paths:', {
      filename,
      qrCodesDir,
      filePath,
      cwd: process.cwd()
    });

    // Ensure qr-codes directory exists
    console.log('📤 Creating qr-codes directory if it doesn\'t exist...');
    try {
      await mkdir(qrCodesDir, { recursive: true });
      console.log('📤 Directory created/verified successfully');
    } catch (mkdirError) {
      console.error('❌ Directory creation error:', mkdirError);
      throw new Error(`Directory creation failed: ${mkdirError.message}`);
    }

    // Convert file to ArrayBuffer
    console.log('📤 Converting file to ArrayBuffer...');
    const arrayBuffer = await qrCodeFile.arrayBuffer();
    console.log('📤 ArrayBuffer size:', arrayBuffer.byteLength);

    // Write file to local storage
    console.log('📤 Writing file to local storage...');
    let qrCodeUrl;
    try {
      await writeFile(filePath, Buffer.from(arrayBuffer));
      console.log('📤 File written successfully to:', filePath);
      
      // Generate public URL for the file
      const baseUrl = process.env.APP_URL || 'https://siglingafelagidymir.com';
      qrCodeUrl = `${baseUrl}/qr-codes/${filename}`;
      console.log('📤 Generated URL:', qrCodeUrl);
    } catch (fileError) {
      console.error('❌ File write error:', fileError);
      console.error('❌ File write error details:', {
        code: fileError.code,
        errno: fileError.errno,
        syscall: fileError.syscall,
        path: fileError.path
      });
      throw new Error(`File upload failed: ${fileError.message}`);
    }
    
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
      filename: `qr-codes/${filename}`,
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