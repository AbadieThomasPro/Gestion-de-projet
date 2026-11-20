import { and, eq } from 'drizzle-orm';
import { db, friendRequests, users } from '@/db';
import { findPublicUser, getUserId, publicUserColumns, unauthorized } from '@/lib/auth';
import { getFriendStatus } from '@/lib/friends';
import { isUuid } from '@/lib/ids';

// Requests I received
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

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
}

// Send a request
export async function POST(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { toId } = await request.json();

  if (!isUuid(toId) || !(await findPublicUser(toId))) {
    return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }
  if ((await getFriendStatus(userId, toId)) !== 'none') {
    return Response.json({ error: 'Demande impossible' }, { status: 400 });
  }

  const [friendRequest] = await db.insert(friendRequests).values({ fromId: userId, toId }).returning();

  return Response.json({ request: friendRequest }, { status: 201 });
}
