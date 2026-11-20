import { publicUserSelect, requirePublicUser, requireUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { getFriendStatus } from '@/lib/friends';
import { withErrorHandler } from '@/lib/handler';
import { prisma } from '@/lib/prisma';
import { friendRequestSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';

// Requests I received
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const requests = await prisma.friendRequest.findMany({
    where: { toId: userId, status: 'pending' },
    include: { from: { select: publicUserSelect } },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({ requests });
});

// Send a request
export const POST = withErrorHandler(async (request) => {
  const userId = requireUser(request);
  const { toId } = await parseBody(request, friendRequestSchema);

  await requirePublicUser(toId);
  if ((await getFriendStatus(userId, toId)) !== 'none') throw new AppError('LL_FRIEND_REQUEST_409');

  const friendRequest = await prisma.friendRequest.create({ data: { fromId: userId, toId } });

  return Response.json({ request: friendRequest }, { status: 201 });
});
