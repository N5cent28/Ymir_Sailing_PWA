import { bulkUpsertMembers, verifyMemberCredentials, isAdmin } from '../../lib/database-postgres.js';

// Accepts CSV via POST body with admin credentials in headers
// Headers required: x-admin-member, x-admin-pin
// CSV headers: member_number,name,phone,email,is_admin
export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('text/csv') && !contentType.includes('application/octet-stream') && !contentType.includes('text/plain')) {
      return new Response(JSON.stringify({ success: false, error: 'Expected CSV upload (text/csv)' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const adminMemberNumber = request.headers.get('x-admin-member');
    const adminPin = request.headers.get('x-admin-pin');
    if (!adminMemberNumber || !adminPin) {
      return new Response(JSON.stringify({ success: false, error: 'Admin credentials required' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const verified = await verifyMemberCredentials(adminMemberNumber, adminPin);
    if (!verified || !(await isAdmin(adminMemberNumber))) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid admin credentials' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
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
      is_admin: headers.indexOf('is_admin')
    };
    if (idx.member_number === -1 || idx.name === -1) {
      return new Response(JSON.stringify({ success: false, error: 'CSV must include member_number and name headers' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const members = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length === 1 && row[0].trim() === '') continue;
      const member_number = row[idx.member_number]?.trim();
      const name = row[idx.name]?.trim();
      if (!member_number || !name) continue;
      const phone = idx.phone !== -1 ? (row[idx.phone]?.trim() || null) : null;
      const email = idx.email !== -1 ? (row[idx.email]?.trim() || null) : null;
      const is_admin = idx.is_admin !== -1 ? ['true','1','yes','y'].includes((row[idx.is_admin]||'').trim().toLowerCase()) : false;
      members.push({ member_number, name, phone, email, is_admin });
    }

    const upserted = await bulkUpsertMembers(members);
    return new Response(JSON.stringify({ success: true, count: upserted }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Upload members error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


