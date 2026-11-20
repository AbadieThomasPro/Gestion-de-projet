import { prisma } from '@/lib/prisma';
import { findPublicUser, getUserId, publicUserSelect, unauthorized } from '@/lib/auth';
import { getFriendStatus } from '@/lib/friends';
import { isUuid } from '@/lib/ids';

// Requests I received
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const requests = await prisma.friendRequest.findMany({
    where: { toId: userId, status: 'pending' },
    include: { from: { select: publicUserSelect } },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({ requests });
}

// Send a request
export async function POST(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { toId } = await request.json();

  if (!isUuid(toId) || !(await findPublicUser(toId))) {
    return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }
  if ((await getFriendStatus(userId, toId)) !== 'none') {
    return Response.json({ error: 'Demande impossible' }, { status: 400 });
  }

  const friendRequest = await prisma.friendRequest.create({ data: { fromId: userId, toId } });

  return Response.json({ request: friendRequest }, { status: 201 });
}
