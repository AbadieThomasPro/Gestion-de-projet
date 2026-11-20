import { publicUserSelect, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { prisma } from '@/lib/prisma';

// My notifications
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const list = await prisma.notification.findMany({
    where: { userId },
    include: { from: { select: publicUserSelect }, post: { select: { content: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const notifications = list.map(({ post, ...n }) => ({ ...n, postContent: post.content }));

  return Response.json({ notifications });
});

// Mark all my notifications as read
export const PUT = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  await prisma.notification.updateMany({ where: { userId }, data: { read: true } });

  return Response.json({ message: 'Notifications lues' });
});
