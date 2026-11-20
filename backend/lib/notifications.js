import { prisma } from './prisma';

// Notifies the author of a post when someone likes or comments it
export async function addNotification({ type, postId, fromId }) {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (!post || post.authorId === fromId) return;

  await prisma.notification.create({ data: { userId: post.authorId, fromId, type, postId } });
}
