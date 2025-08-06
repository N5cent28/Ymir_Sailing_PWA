import { getDb } from '../../lib/database.js';
import fs from 'fs';
import path from 'path';

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'qr-codes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = qrCodeFile.name.split('.').pop();
    const filename = `${boatId}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);

    // Convert file to buffer and save
    const arrayBuffer = await qrCodeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    // Save to database
    const db = await getDb();
    
    // Check if QR code already exists for this boat
    const existingQR = await db.get('SELECT * FROM qr_codes WHERE boat_id = ?', [boatId]);
    
    if (existingQR) {
      // Update existing record
      await db.run(
        'UPDATE qr_codes SET filename = ?, boat_name = ?, updated_at = ? WHERE boat_id = ?',
        [filename, boatName, new Date().toISOString(), boatId]
      );
      
      // Delete old file if it exists
      if (existingQR.filename && existingQR.filename !== filename) {
        const oldFilePath = path.join(uploadsDir, existingQR.filename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    } else {
      // Insert new record
      await db.run(
        'INSERT INTO qr_codes (boat_id, boat_name, filename, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [boatId, boatName, filename, new Date().toISOString(), new Date().toISOString()]
      );
    }

    return new Response(JSON.stringify({
      success: true,
      filename: filename,
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