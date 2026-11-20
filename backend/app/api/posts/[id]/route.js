import { eq } from 'drizzle-orm';
import { db, posts } from '@/db';
import { requireUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { withErrorHandler } from '@/lib/handler';
import { requirePostId } from '@/lib/posts';

// Delete one of my posts
export const DELETE = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const post = await requirePostId(params.id);

  if (post.authorId !== userId) throw new AppError('LL_AUTH_403');

  // Likes, comments and notifications of the post are deleted in cascade
  await db.delete(posts).where(eq(posts.id, post.id));

  return Response.json({ message: 'Publication supprimée' });
});
