import { readDb, writeDb } from '@/lib/db';
import { getUserId, unauthorized } from '@/lib/auth';

function findRequest(db, id, userId) {
  return db.friendRequests.find((r) => r.id === id && r.toId === userId && r.status === 'pending');
}

// Accept a request
export function PUT(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  const friendRequest = findRequest(db, params.id, userId);
  if (!friendRequest) {
    return Response.json({ error: 'Demande introuvable' }, { status: 404 });
  }

  friendRequest.status = 'accepted';
  writeDb(db);

  return Response.json({ request: friendRequest });
}

// Refuse a request
export function DELETE(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  if (!findRequest(db, params.id, userId)) {
    return Response.json({ error: 'Demande introuvable' }, { status: 404 });
  }

  db.friendRequests = db.friendRequests.filter((r) => r.id !== params.id);
  writeDb(db);

  return Response.json({ message: 'Demande refusée' });
}
