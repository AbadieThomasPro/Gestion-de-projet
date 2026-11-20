import { findPublicUser, getUserId, unauthorized } from '@/lib/auth';
import { getUserStats } from '@/lib/stats';
import { isUuid } from '@/lib/ids';

// Statistics of a user: posts, likes and comments received, current streak
export async function GET(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  if (!isUuid(params.id) || !(await findPublicUser(params.id))) {
    return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }

  return Response.json(await getUserStats(params.id));
}
