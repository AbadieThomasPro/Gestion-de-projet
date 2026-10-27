import { readDb, writeDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';
import { getFriendStatus } from '@/lib/friends';

// Requests I received
export function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  const requests = db.friendRequests
    .filter((r) => r.toId === userId && r.status === 'pending')
    .map((r) => ({
      ...r,
      from: publicUser(db.users.find((u) => u.id === r.fromId)),
    }));

  return Response.json({ requests });
}

// Send a request
export async function POST(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { toId } = await request.json();
  const db = readDb();

  if (!db.users.some((u) => u.id === toId)) {
    return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }
  if (getFriendStatus(db, userId, toId) !== 'none') {
    return Response.json({ error: 'Demande impossible' }, { status: 400 });
  }

  const friendRequest = {
    id: crypto.randomUUID(),
    fromId: userId,
    toId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.friendRequests.push(friendRequest);
  writeDb(db);

  return Response.json({ request: friendRequest }, { status: 201 });
}
