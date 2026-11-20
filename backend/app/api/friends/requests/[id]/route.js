import { and, eq } from 'drizzle-orm';
import { db, friendRequests } from '@/db';
import { getUserId, unauthorized } from '@/lib/auth';
import { isUuid } from '@/lib/ids';

// Pending request received by the user
function pendingRequest(id, userId) {
  return and(
    eq(friendRequests.id, id),
    eq(friendRequests.toId, userId),
    eq(friendRequests.status, 'pending')
  );
}

function notFound() {
  return Response.json({ error: 'Demande introuvable' }, { status: 404 });
}

// Accept a request
export async function PUT(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  if (!isUuid(params.id)) return notFound();

  const [friendRequest] = await db
    .update(friendRequests)
    .set({ status: 'accepted' })
    .where(pendingRequest(params.id, userId))
    .returning();
  if (!friendRequest) return notFound();

  return Response.json({ request: friendRequest });
}

// Refuse a request
export async function DELETE(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  if (!isUuid(params.id)) return notFound();

  const deleted = await db.delete(friendRequests).where(pendingRequest(params.id, userId)).returning();
  if (deleted.length === 0) return notFound();

  return Response.json({ message: 'Demande refusée' });
}
