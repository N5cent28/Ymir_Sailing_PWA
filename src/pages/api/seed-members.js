import { createMember } from '../../lib/database-postgres.js';

export async function POST({ request }) {
  try {
    // Sample members for testing
    const testMembers = [
      { memberNumber: '001', name: 'John Smith', phone: '555-0101', email: 'john@example.com', pin: '123' },
      { memberNumber: '002', name: 'Jane Doe', phone: '555-0102', email: 'jane@example.com', pin: '456' },
      { memberNumber: '003', name: 'Bob Johnson', phone: '555-0103', email: 'bob@example.com', pin: '789' },
      { memberNumber: '004', name: 'Alice Brown', phone: '555-0104', email: 'alice@example.com', pin: '012' },
      { memberNumber: '005', name: 'Charlie Wilson', phone: '555-0105', email: 'charlie@example.com', pin: '345' },
      { memberNumber: '006', name: 'Diana Davis', phone: '555-0106', email: 'diana@example.com', pin: '678' },
      { memberNumber: '007', name: 'Edward Miller', phone: '555-0107', email: 'edward@example.com', pin: '901' },
      { memberNumber: '008', name: 'Fiona Garcia', phone: '555-0108', email: 'fiona@example.com', pin: '234' },
      { memberNumber: '009', name: 'George Martinez', phone: '555-0109', email: 'george@example.com', pin: '567' },
      { memberNumber: '010', name: 'Helen Anderson', phone: '555-0110', email: 'helen@example.com', pin: '890' }
    ];

    // Create each member
    for (const member of testMembers) {
      await createMember(
        member.memberNumber,
        member.name,
        member.phone,
        member.email,
        false, // isAdmin
        member.pin
      );
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Created ${testMembers.length} test members`,
      members: testMembers
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Seed members error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 