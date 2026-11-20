import { prisma } from '@/lib/prisma';
import { getUserId, unauthorized } from '@/lib/auth';
import { addNotification } from '@/lib/notifications';
import { isUuid } from '@/lib/ids';

// Like or unlike a post
export async function POST(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const post = isUuid(params.id) && (await prisma.post.findUnique({ where: { id: params.id } }));
  if (!post) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }

  const { count: removed } = await prisma.like.deleteMany({ where: { postId: post.id, userId } });
  const liked = removed === 0;

  if (liked) {
    await prisma.like.createMany({ data: { postId: post.id, userId }, skipDuplicates: true });
    await addNotification({ type: 'like', postId: post.id, fromId: userId });
  } else {
    await prisma.notification.deleteMany({
      where: { type: 'like', postId: post.id, fromId: userId, read: false },
    });
  }

  const likesCount = await prisma.like.count({ where: { postId: post.id } });

  return Response.json({ liked, likesCount });
}
