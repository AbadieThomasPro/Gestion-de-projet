import { and, eq, or } from 'drizzle-orm';
import { db, friendRequests, users } from '@/db';
import { getUserId, publicUserColumns, unauthorized } from '@/lib/auth';

// List of my friends
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const friends = await db
    .select(publicUserColumns)
    .from(friendRequests)
    .innerJoin(
      users,
      or(
        and(eq(friendRequests.fromId, userId), eq(users.id, friendRequests.toId)),
        and(eq(friendRequests.toId, userId), eq(users.id, friendRequests.fromId))
      )
    )
    .where(eq(friendRequests.status, 'accepted'));

  return Response.json({ friends });
}
