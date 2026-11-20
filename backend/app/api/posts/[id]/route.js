import { requireUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { withErrorHandler } from '@/lib/handler';
import { requirePost } from '@/lib/posts';
import { prisma } from '@/lib/prisma';

// Delete one of my posts
export const DELETE = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const post = await requirePost(params.id);

  if (post.authorId !== userId) throw new AppError('LL_AUTH_403');

  // Likes, comments and notifications of the post are deleted in cascade
  await prisma.post.delete({ where: { id: post.id } });

  return Response.json({ message: 'Publication supprimée' });
});
