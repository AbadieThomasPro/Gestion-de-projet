import { prisma } from '@/lib/prisma';
import { getUserId, publicUserSelect, unauthorized } from '@/lib/auth';

// List of my friends
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const accepted = { status: 'accepted' };
  const friends = await prisma.user.findMany({
    where: {
      OR: [
        { sentFriendRequests: { some: { ...accepted, toId: userId } } },
        { receivedFriendRequests: { some: { ...accepted, fromId: userId } } },
      ],
    },
    select: publicUserSelect,
  });

  return Response.json({ friends });
}
