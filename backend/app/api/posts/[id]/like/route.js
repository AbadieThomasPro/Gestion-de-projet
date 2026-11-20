import { requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { requirePost } from '@/lib/posts';
import { prisma } from '@/lib/prisma';

// Like or unlike a post
export const POST = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const post = await requirePost(params.id);

  const { count: removed } = await prisma.like.deleteMany({ where: { postId: post.id, userId } });
  const liked = removed === 0;

  if (liked) {
    await prisma.like.createMany({ data: { postId: post.id, userId }, skipDuplicates: true });
  }

  const likesCount = await prisma.like.count({ where: { postId: post.id } });

  return Response.json({ liked, likesCount });
});
