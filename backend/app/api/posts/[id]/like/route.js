import { and, count, eq } from 'drizzle-orm';
import { db, likes, notifications } from '@/db';
import { requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { addNotification } from '@/lib/notifications';
import { requirePostId } from '@/lib/posts';

// Like or unlike a post
export const POST = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const post = await requirePostId(params.id);

  const myLike = and(eq(likes.postId, post.id), eq(likes.userId, userId));
  const removed = await db.delete(likes).where(myLike).returning();
  const liked = removed.length === 0;

  if (liked) {
    await db.insert(likes).values({ postId: post.id, userId }).onConflictDoNothing();
    await addNotification({ type: 'like', postId: post.id, fromId: userId });
  } else {
    await db
      .delete(notifications)
      .where(
        and(
          eq(notifications.type, 'like'),
          eq(notifications.postId, post.id),
          eq(notifications.fromId, userId),
          eq(notifications.read, false)
        )
      );
  }

  const [{ value }] = await db.select({ value: count() }).from(likes).where(eq(likes.postId, post.id));

  return Response.json({ liked, likesCount: value });
});
