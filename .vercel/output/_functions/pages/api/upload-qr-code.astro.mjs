import { put } from '@vercel/blob';
import { getQRCodeByBoatId, updateQRCode, createQRCode } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
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

    // Upload to Vercel Blob
    const blob = await put(filename, qrCodeFile, {
      access: 'public',
      addRandomSuffix: false
    });

    // Save to database
    const qrCodeUrl = blob.url;
    
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
