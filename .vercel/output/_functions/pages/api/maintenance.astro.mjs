import { reportMaintenanceIssue, getMaintenanceIssue, getMaintenanceIssues, updateMaintenanceIssue } from '../../chunks/database-postgres_A4NcQA_p.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
  try {
    const body = await request.json();
    const { boat_id, reported_by_member_number, issue_type, description, severity } = body;
    
    if (!boat_id || !reported_by_member_number || !issue_type || !description) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const issueId = await reportMaintenanceIssue({
      boat_id,
      reported_by_member_number,
      issue_type,
      description,
      severity: severity || 'medium'
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      issueId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reporting maintenance issue:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to report maintenance issue' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function GET({ url }) {
  const status = url.searchParams.get('status');
  const issueId = url.searchParams.get('id');
  
  try {
    if (issueId) {
      // Get specific maintenance issue
      const issue = await getMaintenanceIssue(parseInt(issueId));
      return new Response(JSON.stringify({ 
        success: true, 
        issue 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Get maintenance issues with optional status filter
      const issues = await getMaintenanceIssues(status);
      return new Response(JSON.stringify({ 
        success: true, 
        issues 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error fetching maintenance issues:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch maintenance issues' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function PUT({ request }) {
  try {
    const body = await request.json();
    const { issueId, status, resolved_by_member_number, admin_notes } = body;
    
    if (!issueId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Issue ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    await updateMaintenanceIssue(parseInt(issueId), {
      status,
      resolved_by_member_number,
      admin_notes
    });
    
    return new Response(JSON.stringify({ 
      success: true 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating maintenance issue:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to update maintenance issue' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
