import { sendMessage, getMessages, markMessageAsRead, getUnreadMessageCount, getMemberByNumber } from '../../lib/database.js';
import { sendPushNotification } from '../../lib/notifications.js';

export async function POST({ request }) {
  try {
    const { action, senderMemberNumber, receiverMemberNumber, message, messageId } = await request.json();
    
    switch (action) {
      case 'send':
        if (!senderMemberNumber || !receiverMemberNumber || !message) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Missing required fields' 
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const messageId = await sendMessage(senderMemberNumber, receiverMemberNumber, message);
        
        // Send push notification to receiver
        try {
          const sender = await getMemberByNumber(senderMemberNumber);
          if (sender) {
            await sendPushNotification(
              `New message from ${sender.name}`,
              message.length > 50 ? message.substring(0, 50) + '...' : message,
              {
                type: 'new_message',
                senderMemberNumber: senderMemberNumber,
                messageId: messageId,
                action: 'open_messages'
              }
            );
          }
        } catch (notificationError) {
          console.error('Failed to send push notification:', notificationError);
          // Don't fail the message send if notification fails
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          messageId: messageId 
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'markRead':
        if (!messageId) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Message ID required' 
          }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        await markMessageAsRead(messageId);
        
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
    console.error('Messages API error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET({ url }) {
  try {
    const memberNumber1 = url.searchParams.get('memberNumber1');
    const memberNumber2 = url.searchParams.get('memberNumber2');
    const action = url.searchParams.get('action');
    
    if (action === 'conversation' && memberNumber1 && memberNumber2) {
      const messages = await getMessages(memberNumber1, memberNumber2);
      
      return new Response(JSON.stringify({ 
        success: true, 
        messages: messages 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (action === 'unreadCount' && memberNumber1) {
      const count = await getUnreadMessageCount(memberNumber1);
      
      return new Response(JSON.stringify({ 
        success: true, 
        count: count 
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid parameters' 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Messages API GET error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 