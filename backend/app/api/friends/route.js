import { and, eq, or } from 'drizzle-orm';
import { db, friendRequests, users } from '@/db';
import { publicUserColumns, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';

// List of my friends
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

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
});
