import { and, count, eq } from 'drizzle-orm';
import { db, friendRequests, notifications } from '@/db';
import { getUserId, unauthorized } from '@/lib/auth';

// Numbers shown in red in the navbar
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const [[unread], [pending]] = await Promise.all([
    db
      .select({ value: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false))),
    db
      .select({ value: count() })
      .from(friendRequests)
      .where(and(eq(friendRequests.toId, userId), eq(friendRequests.status, 'pending'))),
  ]);

  return Response.json({ notifications: unread.value, friendRequests: pending.value });
}
