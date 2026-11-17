import { readDb } from '@/lib/db';
import { getUserId, unauthorized } from '@/lib/auth';
import { getUserStats } from '@/lib/stats';

// Statistics of a user: posts, likes and comments received, current streak
export function GET(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  if (!db.users.some((u) => u.id === params.id)) {
    return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }

  return Response.json(getUserStats(db, params.id));
}
