import { and, eq, or } from 'drizzle-orm';
import { db, friendRequests } from '@/db';

// Request between two users, whatever its direction
export async function findFriendRequest(userId, otherId) {
  const [request] = await db
    .select()
    .from(friendRequests)
    .where(
      or(
        and(eq(friendRequests.fromId, userId), eq(friendRequests.toId, otherId)),
        and(eq(friendRequests.fromId, otherId), eq(friendRequests.toId, userId))
      )
    )
    .limit(1);
  return request;
}

// Returns the relation between two users: 'me', 'friends', 'sent', 'received' or 'none'
export async function getFriendStatus(userId, otherId) {
  if (userId === otherId) return 'me';

  const request = await findFriendRequest(userId, otherId);
  if (!request) return 'none';
  if (request.status === 'accepted') return 'friends';
  return request.fromId === userId ? 'sent' : 'received';
}
