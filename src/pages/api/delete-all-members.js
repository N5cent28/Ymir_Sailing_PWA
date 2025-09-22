import { deleteAllNonAdminMembers, verifyMemberCredentials, isAdmin } from '../../lib/database-postgres.js';

export async function POST({ request }) {
  try {
    const { adminMemberNumber, adminPin } = await request.json();
    if (!adminMemberNumber || !adminPin) {
      return new Response(JSON.stringify({ success: false, error: 'Admin credentials required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const verified = await verifyMemberCredentials(adminMemberNumber, adminPin);
    if (!verified || !(await isAdmin(adminMemberNumber))) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid admin credentials' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const count = await deleteAllNonAdminMembers();
    return new Response(JSON.stringify({ success: true, deleted: count, scope: 'non-admin' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Delete all members error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


