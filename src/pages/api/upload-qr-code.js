import { getQRCodes, getQRCodeByBoatId, createQRCode, updateQRCode } from '../../lib/database-postgres.js';
import { put } from '@netlify/blobs';

export async function POST({ request }) {
  try {
    console.log('📤 QR upload request received');
    
    const formData = await request.formData();
    const qrCodeFile = formData.get('qrCode');
    const boatId = formData.get('boatId');
    const boatName = formData.get('boatName');

    console.log('📤 Form data:', { 
      hasFile: !!qrCodeFile, 
      boatId, 
      boatName,
      fileType: qrCodeFile?.type,
      fileName: qrCodeFile?.name
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
    const filename = `qr-codes/${boatId}-${Date.now()}.${fileExtension}`;

    // Convert file to ArrayBuffer
    console.log('📤 Converting file to ArrayBuffer...');
    const arrayBuffer = await qrCodeFile.arrayBuffer();
    console.log('📤 ArrayBuffer size:', arrayBuffer.byteLength);

    // Upload to Netlify Blobs (public bucket)
    console.log('📤 Uploading to Netlify Blobs...');
    const blob = await put(filename, arrayBuffer, {
      contentType: qrCodeFile.type || 'image/png',
      access: 'public'
    });
    console.log('📤 Blob uploaded:', blob.url);

    const qrCodeUrl = blob.url; // Public URL
    
    // Check if QR code already exists for this boat
    const existingQR = await getQRCodeByBoatId(boatId);
    
    if (existingQR) {
      // Update existing record
      await updateQRCode(boatId, qrCodeUrl);
    } else {
      // Create new record
      await createQRCode(boatId, qrCodeUrl);
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
    console.error('Error uploading QR code:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 