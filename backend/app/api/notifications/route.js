import { desc, eq } from 'drizzle-orm';
import { db, notifications, posts, users } from '@/db';
import { publicUserColumns, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';

// My notifications
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const list = await db
    .select({
      id: notifications.id,
      userId: notifications.userId,
      fromId: notifications.fromId,
      type: notifications.type,
      postId: notifications.postId,
      read: notifications.read,
      createdAt: notifications.createdAt,
      from: publicUserColumns,
      postContent: posts.content,
    })
    .from(notifications)
    .innerJoin(users, eq(users.id, notifications.fromId))
    .innerJoin(posts, eq(posts.id, notifications.postId))
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  return Response.json({ notifications: list });
});

// Mark all my notifications as read
export const PUT = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));

  return Response.json({ message: 'Notifications lues' });
});
