import { eq } from 'drizzle-orm';
import { db, notifications, posts } from '@/db';

// Notifies the author of a post when someone likes or comments it
export async function addNotification({ type, postId, fromId }) {
  const [post] = await db.select({ authorId: posts.authorId }).from(posts).where(eq(posts.id, postId));
  if (!post || post.authorId === fromId) return;

  await db.insert(notifications).values({ userId: post.authorId, fromId, type, postId });
}
