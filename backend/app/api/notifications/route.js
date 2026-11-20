import { prisma } from '@/lib/prisma';
import { getUserId, publicUserSelect, unauthorized } from '@/lib/auth';

// My notifications
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const list = await prisma.notification.findMany({
    where: { userId },
    include: { from: { select: publicUserSelect }, post: { select: { content: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const notifications = list.map(({ post, ...n }) => ({ ...n, postContent: post.content }));

  return Response.json({ notifications });
}

// Mark all my notifications as read
export async function PUT(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  await prisma.notification.updateMany({ where: { userId }, data: { read: true } });

  return Response.json({ message: 'Notifications lues' });
}
