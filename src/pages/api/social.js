import { 
  sendFriendRequest, 
  acceptFriendRequest, 
  addTripPhoto, 
  getTripPhotos, 
  likeTripPhoto, 
  unlikeTripPhoto, 
  getTripPhotoLikes, 
  addTripComment, 
  getTripComments,
  createPlannedOuting,
  getPlannedOutings,
  joinOuting,
  getOutingParticipants,
  deleteTripPhoto
} from '../../lib/database.js';

export async function POST({ request }) {
  try {
    const { action, ...data } = await request.json();
    
    switch (action) {
      case 'send_friend_request':
        const { memberNumber1, memberNumber2 } = data;
        const sent = await sendFriendRequest(memberNumber1, memberNumber2);
        return new Response(JSON.stringify({ 
          success: true,
          sent,
          message: sent ? 'Friend request sent' : 'Friend request already exists'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'accept_friend_request':
        const { memberNumber1: req1, memberNumber2: req2 } = data;
        await acceptFriendRequest(req1, req2);
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Friend request accepted'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'add_trip_photo':
        const { checkInId, memberNumber, photoUrl, caption } = data;
        const photoId = await addTripPhoto(checkInId, memberNumber, photoUrl, caption);
        return new Response(JSON.stringify({ 
          success: true,
          photoId,
          message: 'Photo added successfully'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'like_photo':
        const { tripPhotoId, memberNumber: likeMemberNumber } = data;
        const liked = await likeTripPhoto(tripPhotoId, likeMemberNumber);
        return new Response(JSON.stringify({ 
          success: true,
          liked,
          message: liked ? 'Photo liked' : 'Photo already liked'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'unlike_photo':
        const { tripPhotoId: unlikePhotoId, memberNumber: unlikeMemberNumber } = data;
        await unlikeTripPhoto(unlikePhotoId, unlikeMemberNumber);
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Photo unliked'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'add_comment':
        const { tripPhotoId: commentPhotoId, memberNumber: commentMemberNumber, comment } = data;
        const commentId = await addTripComment(commentPhotoId, commentMemberNumber, comment);
        return new Response(JSON.stringify({ 
          success: true,
          commentId,
          message: 'Comment added successfully'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'delete_trip_photo':
        const { tripPhotoId: deletePhotoId } = data;
        await deleteTripPhoto(deletePhotoId);
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Photo deleted successfully'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'create_outing':
        const outingId = await createPlannedOuting(data);
        return new Response(JSON.stringify({ 
          success: true,
          outingId,
          message: 'Outing created successfully'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'join_outing':
        const { outingId: joinOutingId, memberNumber: joinMemberNumber } = data;
        const joined = await joinOuting(joinOutingId, joinMemberNumber);
        return new Response(JSON.stringify({ 
          success: true,
          joined,
          message: joined ? 'Joined outing' : 'Already joined outing'
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      default:
        return new Response(JSON.stringify({ 
          error: 'Invalid action' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
    
  } catch (error) {
    console.error('Social API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    switch (action) {
      case 'trip_photos':
        const checkInId = url.searchParams.get('checkInId');
        const photos = await getTripPhotos(checkInId);
        return new Response(JSON.stringify({ 
          success: true,
          photos
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'photo_likes':
        const tripPhotoId = url.searchParams.get('tripPhotoId');
        const likes = await getTripPhotoLikes(tripPhotoId);
        return new Response(JSON.stringify({ 
          success: true,
          likes
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'photo_comments':
        const photoId = url.searchParams.get('tripPhotoId');
        const comments = await getTripComments(photoId);
        return new Response(JSON.stringify({ 
          success: true,
          comments
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'planned_outings':
        const outings = await getPlannedOutings();
        return new Response(JSON.stringify({ 
          success: true,
          outings
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'outing_participants':
        const outingId = url.searchParams.get('outingId');
        const participants = await getOutingParticipants(outingId);
        return new Response(JSON.stringify({ 
          success: true,
          participants
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      default:
        return new Response(JSON.stringify({ 
          error: 'Invalid action' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
    
  } catch (error) {
    console.error('Social API GET error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 