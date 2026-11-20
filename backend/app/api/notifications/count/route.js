import { and, count, eq } from 'drizzle-orm';
import { db, friendRequests, notifications } from '@/db';
import { requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';

// Numbers shown in red in the navbar
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

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
});
