import { and, count, eq } from 'drizzle-orm';
import { db, likes, notifications, posts } from '@/db';
import { getUserId, unauthorized } from '@/lib/auth';
import { addNotification } from '@/lib/notifications';
import { isUuid } from '@/lib/ids';

// Like or unlike a post
export async function POST(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const [post] = isUuid(params.id)
    ? await db.select({ id: posts.id }).from(posts).where(eq(posts.id, params.id))
    : [];
  if (!post) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }

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
}
