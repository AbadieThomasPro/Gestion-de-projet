import { readDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';

// List of my friends
export function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  const friendIds = db.friendRequests
    .filter((r) => r.status === 'accepted' && (r.fromId === userId || r.toId === userId))
    .map((r) => (r.fromId === userId ? r.toId : r.fromId));

  const friends = db.users.filter((u) => friendIds.includes(u.id)).map(publicUser);

  return Response.json({ friends });
}
