import { requireUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { withErrorHandler } from '@/lib/handler';
import { isUuid } from '@/lib/ids';
import { prisma } from '@/lib/prisma';

// Pending request received by the user, LL_FRIEND_REQUEST_404 for an invalid id
function pendingRequest(id, userId) {
  if (!isUuid(id)) throw new AppError('LL_FRIEND_REQUEST_404');
  return { id, toId: userId, status: 'pending' };
}

// Accept a request
export const PUT = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);

  const { count } = await prisma.friendRequest.updateMany({
    where: pendingRequest(params.id, userId),
    data: { status: 'accepted' },
  });
  if (count === 0) throw new AppError('LL_FRIEND_REQUEST_404');

  return Response.json({ request: await prisma.friendRequest.findUnique({ where: { id: params.id } }) });
});

// Refuse a request
export const DELETE = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);

  const { count } = await prisma.friendRequest.deleteMany({ where: pendingRequest(params.id, userId) });
  if (count === 0) throw new AppError('LL_FRIEND_REQUEST_404');

  return Response.json({ message: 'Demande refusée' });
});
