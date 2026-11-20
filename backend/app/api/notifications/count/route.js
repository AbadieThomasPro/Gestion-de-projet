import { prisma } from '@/lib/prisma';
import { getUserId, unauthorized } from '@/lib/auth';

// Numbers shown in red in the navbar
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const [notifications, friendRequests] = await Promise.all([
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.friendRequest.count({ where: { toId: userId, status: 'pending' } }),
  ]);

  return Response.json({ notifications, friendRequests });
}
