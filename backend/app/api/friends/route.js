import { publicUserSelect, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { prisma } from '@/lib/prisma';

// List of my friends
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

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
});
