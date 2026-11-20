import { desc, eq } from 'drizzle-orm';
import { db, notifications, posts, users } from '@/db';
import { getUserId, publicUserColumns, unauthorized } from '@/lib/auth';

// My notifications
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

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
}

// Mark all my notifications as read
export async function PUT(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));

  return Response.json({ message: 'Notifications lues' });
}
