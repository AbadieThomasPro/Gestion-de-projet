import { readDb } from '@/lib/db';
import { getUserId, unauthorized } from '@/lib/auth';

// Numbers shown in red in the navbar
export function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();

  return Response.json({
    notifications: db.notifications.filter((n) => n.userId === userId && !n.read).length,
    friendRequests: db.friendRequests.filter((r) => r.toId === userId && r.status === 'pending').length,
  });
}
