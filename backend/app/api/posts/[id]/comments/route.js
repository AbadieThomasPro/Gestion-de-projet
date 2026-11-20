import { prisma } from '@/lib/prisma';
import { getUserId, publicUserSelect, unauthorized } from '@/lib/auth';
import { addNotification } from '@/lib/notifications';
import { isUuid } from '@/lib/ids';

const withAuthor = { author: { select: publicUserSelect } };

// Comments of a post
export async function GET(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  if (!isUuid(params.id)) return Response.json({ comments: [] });

  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    include: withAuthor,
    orderBy: { createdAt: 'asc' },
  });

  return Response.json({ comments });
}

// Comment a post
export async function POST(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { content } = await request.json();
  if (!content || !content.trim()) {
    return Response.json({ error: 'Le commentaire est vide' }, { status: 400 });
  }

  const post = isUuid(params.id) && (await prisma.post.findUnique({ where: { id: params.id } }));
  if (!post) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { postId: post.id, authorId: userId, content: content.trim() },
    include: withAuthor,
  });
  await addNotification({ type: 'comment', postId: post.id, fromId: userId });

  return Response.json({ comment }, { status: 201 });
}
