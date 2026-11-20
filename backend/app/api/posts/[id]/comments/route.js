import { publicUserSelect, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { addNotification } from '@/lib/notifications';
import { requirePost } from '@/lib/posts';
import { prisma } from '@/lib/prisma';
import { commentSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';

const withAuthor = { author: { select: publicUserSelect } };

// Comments of a post
export const GET = withErrorHandler(async (request, { params }) => {
  requireUser(request);
  const post = await requirePost(params.id);

  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    include: withAuthor,
    orderBy: { createdAt: 'asc' },
  });

  return Response.json({ comments });
});

// Comment a post
export const POST = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const { content } = await parseBody(request, commentSchema);
  const post = await requirePost(params.id);

  const comment = await prisma.comment.create({
    data: { postId: post.id, authorId: userId, content },
    include: withAuthor,
  });
  await addNotification({ type: 'comment', postId: post.id, fromId: userId });

  return Response.json({ comment }, { status: 201 });
});
