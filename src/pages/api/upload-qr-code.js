import { getQRCodes, getQRCodeByBoatId, createQRCode, updateQRCode } from '../../lib/database-postgres.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const qrCodeFile = formData.get('qrCode');
    const boatId = formData.get('boatId');
    const boatName = formData.get('boatName');

    if (!qrCodeFile || !boatId || !boatName) {
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
    const fileExtension = qrCodeFile.name.split('.').pop();
    const filename = `qr-codes/${boatId}-${Date.now()}.${fileExtension}`;
    const filePath = join(process.cwd(), 'public', filename);

    // Ensure directory exists
    await mkdir(join(process.cwd(), 'public', 'qr-codes'), { recursive: true });

    // Convert file to buffer and save
    const arrayBuffer = await qrCodeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Save to database with public URL
    const qrCodeUrl = `/${filename}`;
    
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
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 