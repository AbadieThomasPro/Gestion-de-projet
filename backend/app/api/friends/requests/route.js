import { and, eq } from 'drizzle-orm';
import { db, friendRequests, users } from '@/db';
import { findPublicUser, publicUserColumns, requireUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { getFriendStatus } from '@/lib/friends';
import { withErrorHandler } from '@/lib/handler';
import { friendRequestSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';

// Requests I received
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const requests = await db
    .select({
      id: friendRequests.id,
      fromId: friendRequests.fromId,
      toId: friendRequests.toId,
      status: friendRequests.status,
      createdAt: friendRequests.createdAt,
      from: publicUserColumns,
    })
    .from(friendRequests)
    .innerJoin(users, eq(users.id, friendRequests.fromId))
    .where(and(eq(friendRequests.toId, userId), eq(friendRequests.status, 'pending')));

  return Response.json({ requests });
});

// Send a request
export const POST = withErrorHandler(async (request) => {
  const userId = requireUser(request);
  const { toId } = await parseBody(request, friendRequestSchema);

  if (!(await findPublicUser(toId))) throw new AppError('LL_USER_404');
  if ((await getFriendStatus(userId, toId)) !== 'none') throw new AppError('LL_FRIEND_REQUEST_409');

  const [friendRequest] = await db.insert(friendRequests).values({ fromId: userId, toId }).returning();

  return Response.json({ request: friendRequest }, { status: 201 });
});
