import { requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { prisma } from '@/lib/prisma';

// Numbers shown in red in the navbar
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const [notifications, friendRequests] = await Promise.all([
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.friendRequest.count({ where: { toId: userId, status: 'pending' } }),
  ]);

  return Response.json({ notifications, friendRequests });
});
