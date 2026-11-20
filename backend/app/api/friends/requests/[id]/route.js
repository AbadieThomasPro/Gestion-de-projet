import { and, eq } from 'drizzle-orm';
import { db, friendRequests } from '@/db';
import { requireUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { withErrorHandler } from '@/lib/handler';
import { isUuid } from '@/lib/ids';

// Pending request received by the user, LL_FRIEND_REQUEST_404 for an invalid id
function pendingRequest(id, userId) {
  if (!isUuid(id)) throw new AppError('LL_FRIEND_REQUEST_404');
  return and(eq(friendRequests.id, id), eq(friendRequests.toId, userId), eq(friendRequests.status, 'pending'));
}

// Accept a request
export const PUT = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);

  const [friendRequest] = await db
    .update(friendRequests)
    .set({ status: 'accepted' })
    .where(pendingRequest(params.id, userId))
    .returning();
  if (!friendRequest) throw new AppError('LL_FRIEND_REQUEST_404');

  return Response.json({ request: friendRequest });
});

// Refuse a request
export const DELETE = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);

  const deleted = await db.delete(friendRequests).where(pendingRequest(params.id, userId)).returning();
  if (deleted.length === 0) throw new AppError('LL_FRIEND_REQUEST_404');

  return Response.json({ message: 'Demande refusée' });
});
