import { 
  checkInBoatForMember,
  deleteMember,
  updateMember,
  getMemberActivity,
  getBoatMaintenanceHistory,
  getActiveMaintenanceIssues,
  getAllMembers,
  getBoatStatus,
  getActiveCheckIns,
  getRecentNotifications,
  cleanupOldNotifications,
  getNotificationStats
} from '../../lib/database-postgres.js';

// Boat definitions for export functionality
const boats = [
  { id: 'boat-1', name: 'Quest 1' },
  { id: 'boat-2', name: 'Quest 2' },
  { id: 'boat-3', name: 'Zest 1' },
  { id: 'boat-4', name: 'Zest 2' },
  { id: 'boat-5', name: 'Zest 3' },
  { id: 'boat-6', name: 'Zest 4' },
  { id: 'boat-7', name: 'Zest 5' },
  { id: 'boat-8', name: 'Zest 6' },
  { id: 'boat-9', name: 'Topaz 1' },
  { id: 'boat-10', name: 'Topaz 2' },
  { id: 'boat-11', name: 'Laser 1' },
  { id: 'boat-12', name: 'Laser 2' },
  { id: 'boat-13', name: 'Laser 3' },
  { id: 'boat-14', name: 'Laser 4' },
  { id: 'kayak', name: 'Kayak' },
  { id: 'paddle-board', name: 'Paddle Board' }
];

// Helper function to convert data to CSV
function convertToCSV(data, type) {
  let csvContent = '';
  
  if (type === 'complete') {
    // Complete export
    csvContent += 'MEMBERS\n';
    csvContent += 'Member Number,Name,Phone,Email,Joined,Is Admin,PIN\n';
    data.members.forEach(member => {
      csvContent += `${member.member_number},"${member.name}","${member.phone || ''}","${member.email || ''}","${member.created_at}","${member.is_admin || false}","${member.pin || ''}"\n`;
    });
    
    csvContent += '\nBOATS\n';
    csvContent += 'ID,Name,Status,Type,Notes,Last Maintenance\n';
    data.boats.forEach(boat => {
      csvContent += `${boat.id},"${boat.name}","${boat.status}","${boat.boat_type || 'individual'}","${boat.notes || ''}","${boat.last_maintenance || ''}"\n`;
    });
    
    csvContent += '\nNOTIFICATIONS\n';
    csvContent += 'Type,Message,Date,Boat ID\n';
    data.notifications.forEach(notification => {
      csvContent += `${notification.type},"${notification.message}","${notification.sent_at}","${notification.boat_id || ''}"\n`;
    });
  } else if (type === 'members') {
    // Members export
    csvContent += 'Member Number,Name,Phone,Email,Joined,Is Admin,PIN\n';
    data.forEach(member => {
      csvContent += `${member.member_number},"${member.name}","${member.phone || ''}","${member.email || ''}","${member.created_at}","${member.is_admin || false}","${member.pin || ''}"\n`;
    });
  } else if (type === 'boats') {
    // Boats export
    csvContent += 'ID,Name,Status,Type,Notes,Last Maintenance\n';
    data.forEach(boat => {
      csvContent += `${boat.id},"${boat.name}","${boat.status}","${boat.boat_type || 'individual'}","${boat.notes || ''}","${boat.last_maintenance || ''}"\n`;
    });
  }
  
  return csvContent;
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    switch (action) {
      case 'check_in_boat':
        const { boatId, memberNumber, adminMemberNumber } = data;
        const checkInId = await checkInBoatForMember(boatId, memberNumber, adminMemberNumber);
        return new Response(JSON.stringify({ 
          success: true, 
          checkInId 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'delete_member':
        const { memberNumber: memberToDelete } = data;
        await deleteMember(memberToDelete);
        return new Response(JSON.stringify({ 
          success: true 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'update_member':
        const { memberNumber: memberToUpdate, updateData } = data;
        await updateMember(memberToUpdate, updateData);
        return new Response(JSON.stringify({ 
          success: true 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid action' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error in admin action:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Admin action failed' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET({ url }) {
  const action = url.searchParams.get('action');
  const memberNumber = url.searchParams.get('memberNumber');
  const boatId = url.searchParams.get('boatId');
  
  try {
    switch (action) {
      case 'member_activity':
        if (!memberNumber) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Member number required' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const activity = await getMemberActivity(memberNumber);
        return new Response(JSON.stringify({ 
          success: true, 
          activity 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'boat_maintenance_history':
        if (!boatId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Boat ID required' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const history = await getBoatMaintenanceHistory(boatId);
        return new Response(JSON.stringify({ 
          success: true, 
          history 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'active_maintenance':
        const activeIssues = await getActiveMaintenanceIssues();
        return new Response(JSON.stringify({ 
          success: true, 
          issues: activeIssues 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'getActiveCheckins':
        const allActiveCheckIns = await getActiveCheckIns();
        return new Response(JSON.stringify({ 
          success: true, 
          count: allActiveCheckIns.length 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'notification_stats':
        const stats = await getNotificationStats();
        return new Response(JSON.stringify({ 
          success: true, 
          stats 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'cleanup_notifications':
        const retentionDays = parseInt(url.searchParams.get('days')) || 30;
        const deletedCount = await cleanupOldNotifications(retentionDays);
        return new Response(JSON.stringify({ 
          success: true, 
          deletedCount,
          retentionDays
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'export_data':
        const exportType = url.searchParams.get('type');
        const exportFormat = url.searchParams.get('format');
        
        if (!exportType || !exportFormat) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Export type and format required' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        let exportData;
        
        if (exportType === 'members') {
          exportData = await getAllMembers();
        } else if (exportType === 'boats') {
          const allBoats = await Promise.all(boats.map(async (boat) => {
            const status = await getBoatStatus(boat.id);
            return { ...boat, ...status };
          }));
          exportData = allBoats;
        } else if (exportType === 'complete') {
          const allMembers = await getAllMembers();
          const allBoats = await Promise.all(boats.map(async (boat) => {
            const status = await getBoatStatus(boat.id);
            return { ...boat, ...status };
          }));
          const allNotifications = await getRecentNotifications(1000);
          
          exportData = {
            exportDate: new Date().toISOString(),
            members: allMembers,
            boats: allBoats,
            notifications: allNotifications,
            summary: {
              totalMembers: allMembers.length,
              totalBoats: allBoats.length,
              totalNotifications: allNotifications.length
            }
          };
        } else {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Invalid export type' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (exportFormat === 'json') {
          return new Response(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Content-Disposition': `attachment; filename="ymir-${exportType}-${new Date().toISOString().split('T')[0]}.json"`
            }
          });
        } else if (exportFormat === 'csv') {
          const csvContent = convertToCSV(exportData, exportType);
          return new Response(csvContent, {
            status: 200,
            headers: { 
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="ymir-${exportType}-${new Date().toISOString().split('T')[0]}.csv"`
            }
          });
        } else {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Invalid export format' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
      case 'all_members':
        const members = await getAllMembers();
        return new Response(JSON.stringify({ 
          success: true, 
          members 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'boat_status':
        if (!boatId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Boat ID required' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const status = await getBoatStatus(boatId);
        const activeCheckIns = await getActiveCheckIns(boatId);
        return new Response(JSON.stringify({ 
          success: true, 
          status,
          activeCheckIns 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      default:
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid action' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error in admin GET request:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch admin data' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 