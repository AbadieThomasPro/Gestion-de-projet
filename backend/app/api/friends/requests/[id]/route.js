import { prisma } from '@/lib/prisma';
import { getUserId, unauthorized } from '@/lib/auth';
import { isUuid } from '@/lib/ids';

// Pending request received by the user
function pendingRequest(id, userId) {
  return { id, toId: userId, status: 'pending' };
}

function notFound() {
  return Response.json({ error: 'Demande introuvable' }, { status: 404 });
}

// Accept a request
export async function PUT(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  if (!isUuid(params.id)) return notFound();

  const { count } = await prisma.friendRequest.updateMany({
    where: pendingRequest(params.id, userId),
    data: { status: 'accepted' },
  });
  if (count === 0) return notFound();

  return Response.json({ request: await prisma.friendRequest.findUnique({ where: { id: params.id } }) });
}

// Refuse a request
export async function DELETE(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  if (!isUuid(params.id)) return notFound();

  const { count } = await prisma.friendRequest.deleteMany({ where: pendingRequest(params.id, userId) });
  if (count === 0) return notFound();

  return Response.json({ message: 'Demande refusée' });
}
