import { bulkUpsertMembers, getAllMembers, isAdmin } from '../../lib/database-postgres.js';

// Accepts CSV via POST body with admin credentials in headers
// Headers required: x-admin-member, x-admin-pin
// CSV headers: member_number,name,phone,email,is_admin[,pin][,role]
export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('text/csv') && !contentType.includes('application/octet-stream') && !contentType.includes('text/plain')) {
      return new Response(JSON.stringify({ success: false, error: 'Expected CSV upload (text/csv)' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const adminMemberNumber = request.headers.get('x-admin-member');
    const adminPin = request.headers.get('x-admin-pin');
    if (!adminMemberNumber) {
      return new Response(JSON.stringify({ success: false, error: 'Admin member required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Verify admin status (PIN is optional for upload, just check admin status)
    if (!(await isAdmin(adminMemberNumber))) {
      return new Response(JSON.stringify({ success: false, error: 'Admin access required' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const csvText = await request.text();
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'CSV is empty' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const idx = {
      member_number: headers.indexOf('member_number'),
      name: headers.indexOf('name'),
      phone: headers.indexOf('phone'),
      email: headers.indexOf('email'),
      is_admin: headers.indexOf('is_admin'),
      pin: headers.indexOf('pin'),
      role: headers.indexOf('role')
    };
    if (idx.name === -1) {
      return new Response(JSON.stringify({ success: false, error: 'CSV must include name header' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Build a set of existing PINs to avoid collisions when auto-generating
    const existing = await getAllMembers();
    const existingPins = new Set((existing || []).map(m => m.pin).filter(Boolean));

    function generateUniquePin() {
      // 3-digit pin, allow leading zeros
      let attempt = 0;
      while (attempt < 2000) {
        const pin = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        if (!existingPins.has(pin)) {
          existingPins.add(pin);
          return pin;
        }
        attempt++;
      }
      // Fallback in the unlikely event of exhaustion
      const fallback = Date.now().toString().slice(-3);
      existingPins.add(fallback);
      return fallback;
    }

    const members = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length === 1 && row[0].trim() === '') continue;
      const rawMemberNum = idx.member_number !== -1 ? (row[idx.member_number]?.trim() || '') : '';
      const name = (row[idx.name] || '').trim();
      if (!name) continue;
      let member_number = rawMemberNum;
      if (!member_number) {
        // Generate unique 4-digit member number
        let attempt = 0;
        const existingMembers = existing || [];
        const existingSet = new Set(existingMembers.map(m => m.member_number));
        while (attempt < 10000) {
          const candidate = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          if (!existingSet.has(candidate)) {
            member_number = candidate;
            existingSet.add(candidate);
            break;
          }
          attempt++;
        }
        if (!member_number) {
          member_number = (Date.now() % 10000).toString().padStart(4, '0');
        }
      }
      const phone = idx.phone !== -1 ? (row[idx.phone]?.trim() || null) : null;
      const email = idx.email !== -1 ? (row[idx.email]?.trim() || null) : null;
      const is_admin = idx.is_admin !== -1 ? ['true','1','yes','y'].includes((row[idx.is_admin]||'').trim().toLowerCase()) : false;
      const pin = idx.pin !== -1 ? ((row[idx.pin] || '').trim() || null) : null;
      const finalPin = pin && /^\d{3}$/.test(pin) ? pin : generateUniquePin();
      const role = idx.role !== -1 ? ((row[idx.role] || '').trim().toLowerCase() || 'member') : 'member';

      members.push({ member_number, name, phone, email, is_admin, pin: finalPin, role });
    }

    const upserted = await bulkUpsertMembers(members);
    return new Response(JSON.stringify({ success: true, count: upserted }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Upload members error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


